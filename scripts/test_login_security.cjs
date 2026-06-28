const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });

  // 1. Visit /admin and capture the login panel (making sure bypass button is missing)
  await page.goto('http://localhost:5173/admin');
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'login_no_bypass.png' });
  console.log('1. Screenshot saved: login_no_bypass.png');

  // 2. Attempt invalid login
  await page.focus('input[type="email"]');
  await page.keyboard.type('test@example.com');
  await page.focus('input[type="password"]');
  await page.keyboard.type('wrongpass');
  await page.click('button[type="submit"]');
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'login_invalid_credentials.png' });
  console.log('2. Screenshot saved: login_invalid_credentials.png');

  // Clear inputs
  await page.evaluate(() => {
    document.querySelector('input[type="email"]').value = '';
    document.querySelector('input[type="password"]').value = '';
  });

  // 3. Attempt valid custom credentials
  await page.focus('input[type="email"]');
  await page.keyboard.type('gunjansharma@ieee.org');
  await page.focus('input[type="password"]');
  await page.keyboard.type('mishwa2me');
  await page.click('button[type="submit"]');
  await new Promise(r => setTimeout(r, 2000));

  // Should have logged in to dashboard
  await page.screenshot({ path: 'dashboard_after_login.png' });
  console.log('3. Screenshot saved: dashboard_after_login.png');

  await browser.close();
})();
