const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });

  // 1. Load Admin Login (bypassed)
  await page.goto('http://localhost:5173/admin');
  await new Promise(r => setTimeout(r, 2000));

  // Click bypass login button
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const bypassBtn = buttons.find(b => b.textContent.includes('Bypass Login'));
    if (bypassBtn) bypassBtn.click();
  });
  await new Promise(r => setTimeout(r, 2000));

  // 2. Go to Manage Committee tab
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('aside nav button'));
    const committeeBtn = buttons.find(b => b.textContent.includes('Manage Committee'));
    if (committeeBtn) committeeBtn.click();
  });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'admin_committee_tab.png' });
  console.log('1. Screenshot saved: admin_committee_tab.png');

  // 3. Edit Anil Roy
  await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('div.grid > div'));
    const anilCard = cards.find(c => c.textContent.includes('Dr. Anil Roy'));
    if (anilCard) {
      const editBtn = anilCard.querySelector('button'); // first button is Edit2
      if (editBtn) editBtn.click();
    }
  });
  await new Promise(r => setTimeout(r, 1000));

  // Focus and type new position "General Chair"
  await page.focus('input[placeholder="Section Chair"]');
  await page.keyboard.down('Control');
  await page.keyboard.press('KeyA');
  await page.keyboard.up('Control');
  await page.keyboard.press('Backspace');
  await page.keyboard.type('General Chair');
  await new Promise(r => setTimeout(r, 500));

  // Submit edit form by clicking the submit button inside form
  await page.evaluate(() => {
    const form = document.querySelector('form');
    if (form) {
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.click();
    }
  });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'admin_committee_edited.png' });
  console.log('2. Screenshot saved: admin_committee_edited.png');

  // 4. Load client-facing /committee page to verify persistence
  await page.goto('http://localhost:5173/committee');
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'committee_client_verified.png' });
  console.log('3. Screenshot saved: committee_client_verified.png');

  await browser.close();
})();
