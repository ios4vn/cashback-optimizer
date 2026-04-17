const { chromium } = require('playwright');
const fs = require('fs');

const URLS = JSON.parse(fs.readFileSync('/tmp/harvest_urls.json', 'utf8'));
const OUTPUT = '/tmp/harvest_raw.json';

// Load existing results
let results = {};
try { results = JSON.parse(fs.readFileSync(OUTPUT, 'utf8')); } catch {}

(async () => {
  for (const { bank, url } of URLS) {
    // Skip already harvested
    if (results[bank]?.find(p => p.url === url && p.text?.length > 50)) continue;

    let browser;
    try {
      browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
      const context = browser.contexts()[0] || await browser.newContext();
      const page = await context.newPage();
      await page.goto(url, { timeout: 12000, waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000); // let JS render
      const text = await page.evaluate(() => {
        document.querySelectorAll('script,style,noscript,iframe,svg').forEach(e => e.remove());
        return (document.body?.innerText || '').substring(0, 10000);
      });
      if (!results[bank]) results[bank] = [];
      results[bank].push({ url, text: text.trim() });
      console.log(`✅ ${bank} — ${url.substring(0,60)} (${text.length} chars)`);
      await page.close();
      await browser.close();
    } catch (e) {
      if (!results[bank]) results[bank] = [];
      results[bank].push({ url, error: e.message?.substring(0, 150) });
      console.log(`❌ ${bank} — ${e.message?.substring(0, 80)}`);
      try { await browser?.close(); } catch {}
    }
    // Save after each URL
    fs.writeFileSync(OUTPUT, JSON.stringify(results, null, 2));
    // Restart lightpanda between pages
    require('child_process').execSync('pkill -f lightpanda; sleep 1; ~/.local/bin/lightpanda serve --host 127.0.0.1 --port 9222 &>/tmp/lp.log &', { shell: '/bin/bash' });
    await new Promise(r => setTimeout(r, 2000));
  }
  console.log('\n=== DONE ===');
  for (const [bank, pages] of Object.entries(results)) {
    const ok = pages.filter(p => p.text?.length > 100).length;
    console.log(`${bank.padEnd(20)} ${ok}/${pages.length} pages`);
  }
})();
