const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  // Set viewport to mobile width
  await page.setViewport({ width: 390, height: 800 });
  await page.goto('http://localhost:5173');

  console.log('1. Opened home page, waiting for typewriter to type phrase...');
  // Wait for the typewriter animation to complete the first phrase (around 3.5 seconds)
  await new Promise(r => setTimeout(r, 3800));

  await page.screenshot({ path: 'typewriter_wrap_verified.png' });
  console.log('2. Screenshot saved: typewriter_wrap_verified.png');

  await browser.close();
})();
