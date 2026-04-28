const puppeteer = require("puppeteer");

// Parse CLI args: node platformScraper.js gfg=sachinkd codechef=tariyal_ji
const args = process.argv.slice(2);
const params = {};
args.forEach(arg => {
  const [key, val] = arg.split('=');
  if (key && val) params[key.trim()] = val.trim();
});

async function scrapeGFG(page, userName) {
  try {
    await page.goto(`https://www.geeksforgeeks.org/profile/${userName}?tab=activity`, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    await page.waitForSelector('.ProblemNavbar_head_nav--text__7u4wN', { timeout: 12000 });

    return await page.evaluate(() => {
      const nodes = document.querySelectorAll('.ProblemNavbar_head_nav--text__7u4wN');
      let basic = 0, easy = 0, medium = 0, hard = 0, total = 0;
      nodes.forEach(node => {
        const text = node.innerText;
        const label = text.replace(/[^a-zA-Z]/g, '').toLowerCase();
        const count = parseInt(text.replace(/[^0-9]/g, '')) || 0;
        if (label === 'basic')  basic  = count;
        if (label === 'easy')   easy   = count;
        if (label === 'medium') medium = count;
        if (label === 'hard')   hard   = count;
        if (['school','basic','easy','medium','hard'].includes(label)) total += count;
      });
      return { basic, easy, medium, hard, totalProblemsSolved: total };
    });
  } catch (err) {
    return { basic: 0, easy: 0, medium: 0, hard: 0, totalProblemsSolved: 0, error: err.message };
  }
}

async function scrapeCodeChef(page, userName) {
  try {
    await page.goto(`https://www.codechef.com/users/${userName}`, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // Redirect guard: CodeChef redirects unknown users to homepage
    const finalUrl = page.url();
    if (!finalUrl.includes(`/users/${userName}`)) {
      return { totalSolved: 0, fullyCorrect: 0, partiallyCorrect: 0, error: `User ${userName} not found on CodeChef` };
    }

    return await page.evaluate(() => {
      let totalSolved = 0, fullyCorrect = 0, partiallyCorrect = 0;
      document.querySelectorAll('h3, h5, span, strong, p').forEach(el => {
        const text = (el.innerText || el.textContent || '').trim();
        if (/Total Problems Solved/i.test(text)) {
          const m = text.match(/(\d+)/);
          if (m) totalSolved = parseInt(m[1]);
        }
        if (/Fully\s+Solved/i.test(text)) {
          const m = text.match(/(\d+)/);
          if (m) fullyCorrect = parseInt(m[1]);
        }
        if (/Partially\s+Solved/i.test(text)) {
          const m = text.match(/(\d+)/);
          if (m) partiallyCorrect = parseInt(m[1]);
        }
      });
      return { totalSolved, fullyCorrect, partiallyCorrect };
    });
  } catch (err) {
    return { totalSolved: 0, fullyCorrect: 0, partiallyCorrect: 0, error: err.message };
  }
}

async function main() {
  const gfgUser      = params['gfg']      || '';
  const codechefUser = params['codechef'] || '';

  if (!gfgUser && !codechefUser) {
    console.log(JSON.stringify({ error: 'No usernames provided' }));
    return;
  }

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });

    // Open both pages concurrently inside a single shared Chromium instance
    const [gfgPage, codechefPage] = await Promise.all([
      browser.newPage(),
      browser.newPage()
    ]);

    await Promise.all([
      gfgPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'),
      codechefPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
    ]);

    // Scrape both platforms IN PARALLEL — single cold-start, two concurrent page loads
    const [gfgStats, codechefStats] = await Promise.all([
      gfgUser      ? scrapeGFG(gfgPage, gfgUser)           : Promise.resolve({ basic:0, easy:0, medium:0, hard:0, totalProblemsSolved:0 }),
      codechefUser ? scrapeCodeChef(codechefPage, codechefUser) : Promise.resolve({ totalSolved:0, fullyCorrect:0, partiallyCorrect:0 })
    ]);

    console.log(JSON.stringify({ gfg: gfgStats, codechef: codechefStats }));
  } catch (err) {
    console.log(JSON.stringify({
      gfg:      { basic:0, easy:0, medium:0, hard:0, totalProblemsSolved:0, error: err.message },
      codechef: { totalSolved:0, fullyCorrect:0, partiallyCorrect:0, error: err.message }
    }));
  } finally {
    if (browser) await browser.close();
  }
}

main();
