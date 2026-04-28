const puppeteer = require("puppeteer");

async function getUserStats(userName) {
  let browser;
  try {
    browser = await puppeteer.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    const page = await browser.newPage();
    
    // Spoof user agent marginally to avoid initial bot flags
    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
    
    await page.goto(`https://www.geeksforgeeks.org/profile/${userName}?tab=activity`, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Wait precisely for the target element classes to appear indicating DOM hydration
    const selector = ".ProblemNavbar_head_nav--text__7u4wN";
    await page.waitForSelector(selector, { timeout: 10000 });
    
    const stats = await page.evaluate(() => {
       const nodes = document.querySelectorAll(".ProblemNavbar_head_nav--text__7u4wN");
       let results = {
           "basic": 0,
           "easy": 0,
           "medium": 0,
           "hard": 0,
           "totalProblemsSolved": 0
       };
       let total = 0;
       
       nodes.forEach(node => {
          const text = node.innerText;
          const label = text.replace(/[^a-zA-Z]/g, "").toLowerCase();
          const countStr = text.replace(/[^0-9]/g, "");
          const count = parseInt(countStr) || 0;
          
          if (label === "basic" || label === "easy" || label === "medium" || label === "hard") {
              results[label] = count;
          }
          if (["school", "basic", "easy", "medium", "hard"].includes(label)) {
              total += count;
          }
       });
       results["totalProblemsSolved"] = total;
       return results;
    });
    
    console.log(JSON.stringify(stats));
  } catch (err) {
    // Return empty stats gracefully instead of crashing
    console.log(JSON.stringify({
       "basic": 0,
       "easy": 0,
       "medium": 0,
       "hard": 0,
       "totalProblemsSolved": 0,
       "error": err.message
    }));
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

const args = process.argv.slice(2);
if (args.length > 0) {
    getUserStats(args[0]);
} else {
    console.log(JSON.stringify({ "error": "No username provided" }));
}
