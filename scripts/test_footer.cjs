const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });
  await page.goto('http://localhost:5173');
  await new Promise(r => setTimeout(r, 2000));

  // Scroll to the absolute bottom of the page
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await new Promise(r => setTimeout(r, 1000));

  await page.screenshot({ path: 'footer_verified.png' });
  console.log('1. Screenshot saved: footer_verified.png');

  await browser.close();
})();
