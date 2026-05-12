/**
 * 用 Playwright 截取 live demo 網站截圖
 */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const PUBLIC = '/Applications/Projects/nextjs/sunzhi-will.github.io/public/projects';

// live demo 截圖清單
const SCREENSHOTS = [
  // [URL, dest, waitSelector(可選)]
  ['https://carbon.now.sh',                  `${PUBLIC}/carbon/home.png`,           null],
  ['https://synvize.com',                    `${PUBLIC}/synvize/home.png`,           null],
  ['https://auto-form-ai.vercel.app/',       `${PUBLIC}/gform_ai/preview.png`,       null],
  ['https://sunui.vercel.app/',              `${PUBLIC}/sunui/preview.png`,          null],
  ['https://memorylane-nine.vercel.app/',    `${PUBLIC}/memory_lane/home.png`,       null],
  ['https://postly-gilt.vercel.app',         `${PUBLIC}/postly/logo.png`,            null],
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();

  for (const [url, dest, selector] of SCREENSHOTS) {
    try {
      console.log(`截圖中 ${url}...`);
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(3000);
      await page.screenshot({ path: dest });
      const size = fs.statSync(dest).size;
      console.log(`✓ ${path.basename(dest)}  (${Math.round(size/1024)}KB)`);
    } catch (e) {
      console.log(`✗ FAIL ${path.basename(dest)}: ${e.message.slice(0, 80)}`);
    }
  }

  await browser.close();
  console.log('\n完成！');
})();
