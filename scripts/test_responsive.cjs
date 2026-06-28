const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Test 1: Mobile Screen (320px width)
  console.log('1. Testing mobile layout (320px)...');
  await page.setViewport({ width: 320, height: 800 });
  await page.goto('http://localhost:5173');
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'home_mobile_verified.png' });
  console.log('2. Screenshot saved: home_mobile_verified.png');

  // Test 2: Desktop Screen (1200px width)
  console.log('3. Testing desktop layout (1200px)...');
  await page.setViewport({ width: 1200, height: 800 });
  await page.goto('http://localhost:5173');
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'home_desktop_verified.png' });
  console.log('4. Screenshot saved: home_desktop_verified.png');

  await browser.close();
})();
