const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });

  // 1. Visit Home Page (to clear local storage cache if any, or trigger seed on dashboard visit first)
  // Let's go to admin dashboard first to trigger the announcement seed in localStorage
  await page.goto('http://localhost:5173/admin');
  await new Promise(r => setTimeout(r, 2000));
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const bypassBtn = buttons.find(b => b.textContent.includes('Bypass Login'));
    if (bypassBtn) bypassBtn.click();
  });
  await new Promise(r => setTimeout(r, 2000));

  // 2. Now load home page to verify announcements render!
  await page.goto('http://localhost:5173');
  await new Promise(r => setTimeout(r, 2000));
  
  // Scroll to footer/announcements
  await page.evaluate(() => {
    const el = document.querySelector('section.max-w-3xl.md\\:max-w-5xl.mx-auto.px-4.pb-16:last-of-type'); // connect section
    if (el) el.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'home_announcements_ticker.png' });
  console.log('1. Screenshot saved: home_announcements_ticker.png');

  await browser.close();
})();
