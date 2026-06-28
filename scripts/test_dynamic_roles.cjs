const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });

  // 1. Log in as Super Admin (Gunjan Sharma)
  await page.goto('http://localhost:5173/admin');
  await page.waitForSelector('input[type="email"]');
  await page.focus('input[type="email"]');
  await page.keyboard.type('gunjansharma@ieee.org');
  await page.focus('input[type="password"]');
  await page.keyboard.type('mishwa2me');
  await page.click('button[type="submit"]');
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'role_superadmin_verified.png' });
  console.log('1. Screenshot saved: role_superadmin_verified.png');

  // Log out
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('aside button'));
    const logoutBtn = buttons.find(b => b.textContent.includes('Sign Out'));
    if (logoutBtn) logoutBtn.click();
  });
  await new Promise(r => setTimeout(r, 2000));

  // 2. Log in as Admin (Harshpal Singh Solanki)
  await page.waitForSelector('input[type="email"]');
  await page.focus('input[type="email"]');
  await page.keyboard.type('harshpal@ieee.org');
  await page.focus('input[type="password"]');
  await page.keyboard.type('mishwa2me');
  await page.click('button[type="submit"]');
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'role_admin_verified.png' });
  console.log('2. Screenshot saved: role_admin_verified.png');

  await browser.close();
})();
