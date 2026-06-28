const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  console.log('1. Navigating to Dashboard...');
  await page.goto('http://localhost:5173/admin/dashboard');
  await new Promise(r => setTimeout(r, 2000));

  // Click "Manage Events" tab
  console.log('2. Switching to Manage Events tab...');
  const tabButtons = await page.$$('button');
  for (const btn of tabButtons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text.includes('Manage Events')) {
      await btn.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 1000));

  // Click "Add New Event" button
  console.log('3. Clicking Add New Event...');
  const addBtn = await page.$('button');
  // Find button with "Add New Event" text
  const buttons = await page.$$('button');
  let clickedAdd = false;
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text.includes('Add New Event')) {
      await btn.click();
      clickedAdd = true;
      break;
    }
  }
  if (!clickedAdd) {
    console.log('Could not find Add New Event button');
    await browser.close();
    return;
  }
  await new Promise(r => setTimeout(r, 1000));

  // Fill form
  console.log('4. Filling form...');
  const inputs = await page.$$('input[type="text"]');
  // Field order: Title, Date, Time, Location, Registration Link
  await inputs[0].type('Auto Verified Event!');
  await inputs[1].type('Dec 30, 2026');
  await inputs[2].type('10:00 AM');
  await inputs[3].type('SCET, Surat');
  await inputs[4].type('https://google.com');

  await page.type('textarea', 'This event was successfully created via automated browser UI clicks.');

  // Click Save
  console.log('5. Clicking Save Event...');
  const saveBtn = await page.$('button[type="submit"]');
  if (saveBtn) {
    await saveBtn.click();
  }
  await new Promise(r => setTimeout(r, 2000));

  // Navigate to events page
  console.log('6. Navigating to Events page...');
  await page.goto('http://localhost:5173/events');
  await new Promise(r => setTimeout(r, 3000));

  const titles = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('h3')).map(h => h.textContent.trim());
  });
  console.log('7. Rendered event titles:', titles);

  await page.screenshot({path: 'add_event_ui_verified.png'});
  console.log('8. Screenshot saved: add_event_ui_verified.png');

  await browser.close();
})();
