const { chromium } = require('playwright');
const fs = require('fs');

// Comprehensive list - all bank credit card pages
const TARGETS = [
  // MSB - try multiple paths
  { bank: 'MSB', urls: [
    'https://www.msb.com.vn/ca-nhan/san-pham/the',
    'https://www.msb.com.vn/ca-nhan/san-pham/the/the-tin-dung',
    'https://www.msb.com.vn/ca-nhan/the',
    'https://www.msb.com.vn/san-pham/the-tin-dung',
  ]},
  // MB Bank - try Google cache approach
  { bank: 'MB Bank', urls: [
    'https://www.mbbank.com.vn/chi-tiet-san-pham/the-tin-dung',
    'https://www.mbbank.com.vn/san-pham/the',
    'https://www.mbbank.com.vn',
  ]},
  // All other banks - comprehensive product listing pages
  { bank: 'HSBC', urls: ['https://www.hsbc.com.vn/credit-cards/']},
  { bank: 'VIB', urls: ['https://www.vib.com.vn/vn/the-tin-dung']},
  { bank: 'Techcombank', urls: ['https://techcombank.com/khach-hang-ca-nhan/chi-tieu/the/the-tin-dung']},
  { bank: 'VPBank', urls: ['https://www.vpbank.com.vn/ca-nhan/the-tin-dung']},
  { bank: 'TPBank', urls: ['https://tpb.vn/ca-nhan/the/the-tin-dung']},
  { bank: 'ACB', urls: [
    'https://www.acb.com.vn/the-ngan-hang/the-tin-dung',
    'https://acb.com.vn/en/personal-cards/acb-visa-platinum',
    'https://acb.com.vn/en/personal-cards/acb-visa-signature',
  ]},
  { bank: 'Sacombank', urls: ['https://www.sacombank.com.vn/ca-nhan/the/the-tin-dung.html']},
  { bank: 'Shinhan', urls: [
    'https://www.shinhan.com.vn/vi/ca-nhan/the/the-tin-dung',
    'https://www.shinhan.com.vn/vi/ca-nhan/the/the-tin-dung/visa-platinum-cash-back',
  ]},
  { bank: 'VietinBank', urls: ['https://www.vietinbank.vn/the-tin-dung']},
  { bank: 'Vietcombank', urls: [
    'https://www.vietcombank.com.vn/KHCN/SPDV/The',
    'https://www.vietcombank.com.vn/en/Personal/SPDV/The/Credit_VCB-JCB-Platinum',
    'https://www.vietcombank.com.vn/en/Personal/SPDV/The/Credit_VCB-Mastercard-World',
    'https://www.vietcombank.com.vn/en/Personal/SPDV/The/Credit_VCB-Cashplus-Platinum-Amex',
  ]},
  { bank: 'BIDV', urls: [
    'https://www.bidv.com.vn/ca-nhan/san-pham/the',
    'https://www.bidv.com.vn/ca-nhan/san-pham/the/the-tin-dung',
  ]},
  { bank: 'SeABank', urls: [
    'https://www.seabank.com.vn/ca-nhan/the',
    'https://www.seabank.com.vn/san-pham/the-tin-dung',
  ]},
  { bank: 'KBank', urls: ['https://www.kasikornbank.com.vn/VN/Personal/Card/Pages/CreditCard.aspx']},
  { bank: 'UOB', urls: [
    'https://www.uob.com.vn/personal/cards/credit-cards/index.page',
    'https://www.uob.com.vn/personal/cards/credit-cards/uob-one.page',
  ]},
  { bank: 'Standard Chartered', urls: ['https://www.sc.com/vn/credit-cards/']},
  { bank: 'Eximbank', urls: [
    'https://www.eximbank.com.vn/san-pham/the-tin-dung',
    'https://www.eximbank.com.vn/the',
  ]},
  { bank: 'OCB', urls: [
    'https://www.ocb.com.vn/san-pham/the-tin-dung',
    'https://www.ocb.com.vn/ca-nhan/san-pham/the',
  ]},
  { bank: 'HDBank', urls: [
    'https://www.hdbank.com.vn/vi/ca-nhan/san-pham-dich-vu/the',
    'https://www.hdbank.com.vn/vi/ca-nhan/san-pham-dich-vu/the/the-tin-dung',
  ]},
  { bank: 'SHB', urls: ['https://www.shb.com.vn/ca-nhan/the/the-tin-dung/']},
  { bank: 'LPBank', urls: [
    'https://www.lpbank.com.vn/san-pham/the-tin-dung',
    'https://www.lpbank.com.vn/ca-nhan/the',
  ]},
  { bank: 'LioBank', urls: ['https://liobank.vn/']},
  { bank: 'Nam A Bank', urls: ['https://www.namabank.com.vn/ca-nhan/the/the-tin-dung']},
];

const OUTPUT = '/tmp/harvest_full.json';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15',
    locale: 'vi-VN',
  });
  const results = {};

  for (const { bank, urls } of TARGETS) {
    results[bank] = [];
    let gotGoodData = false;
    for (const url of urls) {
      if (gotGoodData && urls.length > 2) continue; // skip extra URLs if we got good data
      const page = await context.newPage();
      try {
        await page.goto(url, { timeout: 15000, waitUntil: 'networkidle' });
        await page.waitForTimeout(2500);
        const text = await page.evaluate(() => {
          document.querySelectorAll('script,style,noscript,iframe,svg,path,link,meta').forEach(e => e.remove());
          return (document.body?.innerText || '').substring(0, 15000);
        });
        const isUseful = text.length > 300 && !text.includes('Access Denied') && !text.includes('404') && !text.includes('không tìm thấy');
        results[bank].push({ url, chars: text.length, useful: isUseful, text: text.trim() });
        if (isUseful) gotGoodData = true;
        console.log(`${isUseful ? '✅' : '⚠️'} ${bank.padEnd(18)} ${text.length.toString().padStart(5)} chars — ${url.substring(0,65)}`);
      } catch (e) {
        results[bank].push({ url, error: e.message?.substring(0, 120) });
        console.log(`❌ ${bank.padEnd(18)} ERR — ${url.substring(0,50)} — ${e.message?.substring(0,60)}`);
      } finally {
        await page.close();
      }
    }
  }

  await browser.close();
  fs.writeFileSync(OUTPUT, JSON.stringify(results, null, 2));

  // Summary
  console.log('\n=== SUMMARY ===');
  let totalOk = 0, totalFail = 0;
  for (const [bank, pages] of Object.entries(results)) {
    const ok = pages.filter(p => p.useful).length;
    const err = pages.filter(p => p.error || !p.useful).length;
    totalOk += ok; totalFail += err;
    console.log(`${bank.padEnd(20)} ${ok ? '✅' : '❌'} ${ok}/${pages.length} useful`);
  }
  console.log(`\nTotal: ${totalOk} useful pages, ${totalFail} failed/empty`);
})();
