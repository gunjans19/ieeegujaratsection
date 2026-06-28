const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });

  // 1. Load Admin Login (bypassed) and go to Manage Announcements tab
  await page.goto('http://localhost:5173/admin');
  await new Promise(r => setTimeout(r, 2000));

  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const bypassBtn = buttons.find(b => b.textContent.includes('Bypass Login'));
    if (bypassBtn) bypassBtn.click();
  });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'admin_credits_detailed.png' });
  console.log('1. Screenshot saved: admin_credits_detailed.png');

  await browser.close();
})();
