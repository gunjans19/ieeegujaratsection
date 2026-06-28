const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });
  await page.goto('http://localhost:5173');
  await new Promise(r => setTimeout(r, 2000));

  await page.screenshot({ path: 'home_grid_verified.png' });
  console.log('1. Screenshot saved: home_grid_verified.png');

  // Scroll down to capture the About and Events cards side-by-side
  await page.evaluate(() => window.scrollBy(0, 500));
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'home_about_verified.png' });
  console.log('2. Screenshot saved: home_about_verified.png');

  await browser.close();
})();
