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

  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('aside nav button'));
    const annBtn = buttons.find(b => b.textContent.includes('Manage Announcements'));
    if (annBtn) annBtn.click();
  });
  await new Promise(r => setTimeout(r, 2000));

  // Click "Add New Announcement" to open the form
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Add New Announcement'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'admin_announcement_link_field.png' });
  console.log('1. Screenshot saved: admin_announcement_link_field.png');

  await browser.close();
})();
