const puppeteer = require("puppeteer");

async function getUserStats(userName) {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    const page = await browser.newPage();
    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");

    const response = await page.goto(`https://www.codechef.com/users/${userName}`, { 
      waitUntil: 'networkidle2', 
      timeout: 30000 
    });

    // Check if we were redirected away from the profile page
    const finalUrl = page.url();
    if (!finalUrl.includes(`/users/${userName}`)) {
      console.log(JSON.stringify({ totalSolved: 0, fullyCorrect: 0, partiallyCorrect: 0, error: `User ${userName} not found` }));
      return;
    }

    const stats = await page.evaluate(() => {
      let totalSolved = 0;
      let fullyCorrect = 0;
      let partiallyCorrect = 0;

      // Try modern CodeChef DOM — look for all heading and span/strong elements
      const allEls = document.querySelectorAll('h3, h5, span, strong, p');
      allEls.forEach(el => {
        const text = (el.innerText || el.textContent || '').trim();
        if (/Total Problems Solved/i.test(text)) {
          const match = text.match(/(\d+)/);
          if (match) totalSolved = parseInt(match[1]);
        }
        if (/Fully\s+Solved/i.test(text)) {
          const match = text.match(/(\d+)/);
          if (match) fullyCorrect = parseInt(match[1]);
        }
        if (/Partially\s+Solved/i.test(text)) {
          const match = text.match(/(\d+)/);
          if (match) partiallyCorrect = parseInt(match[1]);
        }
      });

      // Fallback: try reading problem stats from data attributes / specific classes
      const problemCount = document.querySelector('[class*="problems-solved"], [class*="problemsSolved"]');
      if (problemCount && totalSolved === 0) {
        const match = (problemCount.innerText || '').match(/(\d+)/);
        if (match) totalSolved = parseInt(match[1]);
      }

      return { totalSolved, fullyCorrect, partiallyCorrect };
    });
    
    console.log(JSON.stringify(stats));
  } catch (err) {
    console.log(JSON.stringify({ totalSolved: 0, fullyCorrect: 0, partiallyCorrect: 0, error: err.message }));
  } finally {
    if (browser) await browser.close();
  }
}

const args = process.argv.slice(2);
if (args.length > 0) {
  getUserStats(args[0]);
} else {
  console.log(JSON.stringify({ error: "No username provided" }));
}
