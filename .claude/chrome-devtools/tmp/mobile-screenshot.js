import { getBrowser, getPage, disconnectBrowser, outputJSON } from '../scripts/lib/browser.js';

async function run() {
  const browser = await getBrowser({ headless: true });
  const page = await getPage(browser);
  
  await page.setViewport({ width: 375, height: 812, isMobile: true, deviceScaleFactor: 2 });
  await page.goto('http://localhost:1458/tours/checkout', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));
  
  await page.screenshot({
    path: '/home/automation/meetup/.claude/chrome-devtools/screenshots/mobile-checkout.png',
    fullPage: true
  });
  
  outputJSON({ success: true, url: page.url() });
  await disconnectBrowser();
}
run();
