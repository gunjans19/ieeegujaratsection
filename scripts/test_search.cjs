const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:5173/events');
  await new Promise(r => setTimeout(r, 2000));
  console.log('1. Opened Events page');

  // Find the search input and type "GSCon"
  await page.type('input[placeholder*="Search"]', 'GSCon');
  await new Promise(r => setTimeout(r, 1000));

  const visibleTitles = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('h3')).map(h => h.textContent.trim());
  });
  console.log('2. Search query "GSCon" entered. Visible titles:', visibleTitles);

  await page.screenshot({path: 'search_ui_verified.png'});
  console.log('3. Screenshot saved: search_ui_verified.png');

  await browser.close();
})();
