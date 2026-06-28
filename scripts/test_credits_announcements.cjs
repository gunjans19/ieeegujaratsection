const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });

  // 1. Capture home page footer showing Gunjan Sharma
  await page.goto('http://localhost:5173');
  await new Promise(r => setTimeout(r, 2000));
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'home_credits_verified.png' });
  console.log('1. Screenshot saved: home_credits_verified.png');

  // 2. Capture Admin Dashboard showing Harshpal Singh Solanki
  await page.goto('http://localhost:5173/admin');
  await new Promise(r => setTimeout(r, 2000));
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const bypassBtn = buttons.find(b => b.textContent.includes('Bypass Login'));
    if (bypassBtn) bypassBtn.click();
  });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'admin_credits_verified.png' });
  console.log('2. Screenshot saved: admin_credits_verified.png');

  await browser.close();
})();
