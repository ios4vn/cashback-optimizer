const { chromium } = require('playwright');
const fs = require('fs');

// Banks that failed with Lightpanda (SPA-heavy)
const TARGETS = [
  { bank: 'HSBC', urls: [
    'https://www.hsbc.com.vn/credit-cards/',
    'https://www.hsbc.com.vn/credit-cards/products/cashback/',
    'https://www.hsbc.com.vn/credit-cards/products/liveplus/',
  ]},
  { bank: 'VIB', urls: [
    'https://www.vib.com.vn/vn/the-tin-dung',
    'https://www.vib.com.vn/vn/the-tin-dung/vib-supercard',
    'https://www.vib.com.vn/vn/the-tin-dung/vib-financial-free',
  ]},
  { bank: 'Techcombank', urls: [
    'https://techcombank.com/khach-hang-ca-nhan/chi-tieu/the/the-tin-dung',
    'https://techcombank.com/khach-hang-ca-nhan/chi-tieu/the/the-tin-dung/techcombank-visa-signature',
    'https://techcombank.com/khach-hang-ca-nhan/chi-tieu/the/the-tin-dung/techcombank-everyday',
  ]},
  { bank: 'TPBank', urls: [
    'https://tpb.vn/ca-nhan/the/the-tin-dung',
  ]},
  { bank: 'Sacombank', urls: [
    'https://www.sacombank.com.vn/ca-nhan/the/the-tin-dung.html',
    'https://www.sacombank.com.vn/en/personal/cards/credit-cards/the-tin-dung-sacombank-platinum-american-express.html',
  ]},
  { bank: 'MB Bank', urls: [
    'https://www.mbbank.com.vn/the/the-tin-dung',
  ]},
  { bank: 'Shinhan', urls: [
    'https://www.shinhan.com.vn/vi/ca-nhan/the/the-tin-dung/visa-platinum-cash-back',
  ]},
  { bank: 'VietinBank', urls: [
    'https://www.vietinbank.vn/vietinbank-visa-platinum-cashback-20-html',
  ]},
  { bank: 'Vietcombank', urls: [
    'https://portal.vietcombank.com.vn/Personal/Cards/Pages/Credit-Card.aspx',
  ]},
  { bank: 'UOB', urls: [
    'https://www.uob.com.vn/personal/cards/credit-cards/index.page',
  ]},
  { bank: 'Eximbank', urls: [
    'https://www.eximbank.com.vn/ca-nhan/the/the-tin-dung',
  ]},
  { bank: 'HDBank', urls: [
    'https://www.hdbank.com.vn/vi/ca-nhan/san-pham-dich-vu/the/the-tin-dung',
  ]},
  { bank: 'SHB', urls: [
    'https://www.shb.com.vn/the-tin-dung/',
  ]},
];

const OUTPUT = '/tmp/harvest_spa.json';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    locale: 'vi-VN',
  });
  const results = {};

  for (const { bank, urls } of TARGETS) {
    results[bank] = [];
    for (const url of urls) {
      const page = await context.newPage();
      try {
        await page.goto(url, { timeout: 20000, waitUntil: 'networkidle' });
        await page.waitForTimeout(3000); // extra time for SPA render
        const text = await page.evaluate(() => {
          document.querySelectorAll('script,style,noscript,iframe,svg,path').forEach(e => e.remove());
          return (document.body?.innerText || '').substring(0, 12000);
        });
        results[bank].push({ url, chars: text.length, text: text.trim() });
        console.log(`✅ ${bank.padEnd(18)} ${text.length} chars — ${url.substring(0,65)}`);
      } catch (e) {
        results[bank].push({ url, error: e.message?.substring(0, 150) });
        console.log(`❌ ${bank.padEnd(18)} ${e.message?.substring(0, 80)}`);
      } finally {
        await page.close();
      }
    }
  }

  await browser.close();
  fs.writeFileSync(OUTPUT, JSON.stringify(results, null, 2));
  console.log(`\nSaved to ${OUTPUT}`);
  
  // Summary
  console.log('\n=== Summary ===');
  for (const [bank, pages] of Object.entries(results)) {
    const ok = pages.filter(p => p.text?.length > 200).length;
    const err = pages.filter(p => p.error).length;
    console.log(`${bank.padEnd(18)} ${ok}/${pages.length} ok${err ? `, ${err} err` : ''}`);
  }
})();
