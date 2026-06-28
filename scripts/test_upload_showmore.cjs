const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 1000 });

  // 1. Check Admin Dashboard avatar upload field layout
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
    const committeeBtn = buttons.find(b => b.textContent.includes('Manage Committee'));
    if (committeeBtn) committeeBtn.click();
  });
  await new Promise(r => setTimeout(r, 2000));

  // Click "Add Committee Member" to open the form
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Add Committee Member'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'admin_upload_option.png' });
  console.log('1. Screenshot saved: admin_upload_option.png');

  // 2. Load public /committee page showing "Show More"
  await page.goto('http://localhost:5173/committee');
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'committee_showmore_collapsed.png' });
  console.log('2. Screenshot saved: committee_showmore_collapsed.png');

  // 3. Click "Show More" on the first group (Executive Committee)
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Show More'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'committee_showmore_expanded.png' });
  console.log('3. Screenshot saved: committee_showmore_expanded.png');

  await browser.close();
})();
