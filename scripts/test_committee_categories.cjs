const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 1000 }); // Taller viewport to capture all groups

  // 1. Load Admin Login (bypassed) and go to Manage Committee tab
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
  await page.screenshot({ path: 'admin_committee_categories.png' });
  console.log('1. Screenshot saved: admin_committee_categories.png');

  // 2. Load client-facing /committee page
  await page.goto('http://localhost:5173/committee');
  await new Promise(r => setTimeout(r, 2000));
  
  // Take first screenshot
  await page.screenshot({ path: 'committee_client_categories_top.png' });
  console.log('2. Screenshot saved: committee_client_categories_top.png');

  // Scroll down to see Subcommittee, Student Representative Team, and Social Media Committee
  await page.evaluate(() => window.scrollBy(0, 800));
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'committee_client_categories_bottom.png' });
  console.log('3. Screenshot saved: committee_client_categories_bottom.png');

  await browser.close();
})();
