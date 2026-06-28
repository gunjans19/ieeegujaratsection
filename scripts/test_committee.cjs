const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });

  // 1. Capture home page showing Events & Committee
  await page.goto('http://localhost:5173');
  await new Promise(r => setTimeout(r, 2000));
  await page.evaluate(() => window.scrollTo(0, 1000));
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'committee_card_verified.png' });
  console.log('1. Screenshot saved: committee_card_verified.png');

  // 2. Capture /committee page
  await page.goto('http://localhost:5173/committee');
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'committee_page_verified.png' });
  console.log('2. Screenshot saved: committee_page_verified.png');

  await browser.close();
})();
