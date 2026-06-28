const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 1000 });

  // 1. Visit Home Page (verify slider renders after Advancing Technology subtitle)
  await page.goto('http://localhost:5173');
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'home_slideshow_rendered.png' });
  console.log('1. Screenshot saved: home_slideshow_rendered.png');

  // 2. Load Admin Login (authed) and go to Manage Slideshow tab
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
    const slideshowBtn = buttons.find(b => b.textContent.includes('Manage Slideshow'));
    if (slideshowBtn) slideshowBtn.click();
  });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'admin_slideshow_tab.png' });
  console.log('2. Screenshot saved: admin_slideshow_tab.png');

  // Click "Add Gallery Slide"
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Add Gallery Slide'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'admin_add_slide_form.png' });
  console.log('3. Screenshot saved: admin_add_slide_form.png');

  await browser.close();
})();
