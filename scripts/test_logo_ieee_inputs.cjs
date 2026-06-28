const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });

  // 1. Visit Home Page (verify logo has no card container box and is bigger)
  await page.goto('http://localhost:5173');
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'home_logo_bigger.png' });
  console.log('1. Screenshot saved: home_logo_bigger.png');

  // 2. Load Admin Login (authed) and go to Manage Committee tab
  await page.goto('http://localhost:5173/admin');
  await page.waitForSelector('input[type="email"]');
  await page.focus('input[type="email"]');
  await page.keyboard.type('gunjansharma@ieee.org');
  await page.focus('input[type="password"]');
  await page.keyboard.type('mishwa2me');
  await page.click('button[type="submit"]');
  await new Promise(r => setTimeout(r, 2000));

  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('aside nav button'));
    const committeeBtn = buttons.find(b => b.textContent.includes('Manage Committee'));
    if (committeeBtn) committeeBtn.click();
  });
  await new Promise(r => setTimeout(r, 2000));

  // Click "Add Committee Member" to check form inputs
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Add Committee Member'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'admin_committee_ieee_inputs.png' });
  console.log('2. Screenshot saved: admin_committee_ieee_inputs.png');

  await browser.close();
})();
