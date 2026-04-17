const { chromium } = require('playwright');

const BANKS = [
  {
    bank: 'MSB',
    urls: [
      'https://www.msb.com.vn/ca-nhan/the/the-tin-dung',
      'https://www.msb.com.vn/en/personal/cards/credit-cards',
    ],
  },
  {
    bank: 'HSBC',
    urls: [
      'https://www.hsbc.com.vn/en-vn/credit-cards/',
      'https://www.hsbc.com.vn/en-vn/credit-cards/products/cashback/',
      'https://www.hsbc.com.vn/en-vn/credit-cards/products/liveplus/',
    ],
  },
  {
    bank: 'VIB',
    urls: [
      'https://www.vib.com.vn/vn/the-tin-dung',
      'https://www.vib.com.vn/vn/the-tin-dung/vib-cashback',
      'https://www.vib.com.vn/vn/the-tin-dung/vib-supercard',
      'https://www.vib.com.vn/vn/the-tin-dung/vib-online-plus-2in1',
      'https://www.vib.com.vn/vn/the-tin-dung/vib-financial-free',
    ],
  },
  {
    bank: 'Techcombank',
    urls: [
      'https://techcombank.com/khach-hang-ca-nhan/chi-tieu/the/the-tin-dung',
      'https://techcombank.com/khach-hang-ca-nhan/chi-tieu/the/the-tin-dung/techcombank-visa-signature',
      'https://techcombank.com/khach-hang-ca-nhan/chi-tieu/the/the-tin-dung/techcombank-everyday',
    ],
  },
  {
    bank: 'VPBank',
    urls: [
      'https://www.vpbank.com.vn/ca-nhan/the-tin-dung',
      'https://www.vpbank.com.vn/ca-nhan/the-tin-dung/the-tin-dung-z',
      'https://www.vpbank.com.vn/ca-nhan/the-tin-dung/the-tin-dung-MWG-Mastercard',
    ],
  },
  {
    bank: 'TPBank',
    urls: [
      'https://tpb.vn/ca-nhan/the/the-tin-dung',
      'https://tpb.vn/ca-nhan/the/the-tin-dung/tpbank-jcb-cashback',
    ],
  },
  {
    bank: 'ACB',
    urls: [
      'https://www.acb.com.vn/the-ngan-hang/the-tin-dung',
      'https://www.acb.com.vn/the-ngan-hang/the-tin-dung/acb-visa-platinum',
      'https://www.acb.com.vn/the-ngan-hang/the-tin-dung/acb-visa-signature',
    ],
  },
  {
    bank: 'Sacombank',
    urls: [
      'https://www.sacombank.com.vn/ca-nhan/the/the-tin-dung.html',
    ],
  },
  {
    bank: 'MB Bank',
    urls: [
      'https://www.mbbank.com.vn/the/the-tin-dung',
    ],
  },
  {
    bank: 'Shinhan',
    urls: [
      'https://www.shinhan.com.vn/vi/ca-nhan/the/the-tin-dung',
      'https://www.shinhan.com.vn/vi/ca-nhan/the/the-tin-dung/visa-platinum-cash-back',
    ],
  },
  {
    bank: 'VietinBank',
    urls: [
      'https://www.vietinbank.vn/the-tin-dung',
      'https://www.vietinbank.vn/vietinbank-visa-platinum-cashback-20-html',
    ],
  },
  {
    bank: 'Vietcombank',
    urls: [
      'https://www.vietcombank.com.vn/the-tin-dung',
      'https://portal.vietcombank.com.vn/en/Personal/Cards/Pages/Credit-Card.aspx',
    ],
  },
  {
    bank: 'BIDV',
    urls: [
      'https://www.bidv.com.vn/ca-nhan/the/the-tin-dung',
    ],
  },
  {
    bank: 'SeABank',
    urls: [
      'https://www.seabank.com.vn/ca-nhan/the/the-tin-dung',
    ],
  },
  {
    bank: 'KBank',
    urls: [
      'https://www.kasikornbank.com.vn/VN/Personal/Loan/Pages/CreditCard.aspx',
    ],
  },
  {
    bank: 'UOB',
    urls: [
      'https://www.uob.com.vn/personal/cards/credit-cards/index.page',
    ],
  },
  {
    bank: 'Standard Chartered',
    urls: [
      'https://www.sc.com/vn/credit-cards/',
    ],
  },
  {
    bank: 'Eximbank',
    urls: [
      'https://www.eximbank.com.vn/ca-nhan/the/the-tin-dung',
    ],
  },
  {
    bank: 'OCB',
    urls: [
      'https://www.ocb.com.vn/ca-nhan/the/the-tin-dung',
    ],
  },
  {
    bank: 'LioBank',
    urls: [
      'https://liobank.vn/',
    ],
  },
  {
    bank: 'HDBank',
    urls: [
      'https://www.hdbank.com.vn/vi/ca-nhan/san-pham-dich-vu/the/the-tin-dung',
    ],
  },
  {
    bank: 'SHB',
    urls: [
      'https://www.shb.com.vn/the-tin-dung/',
    ],
  },
  {
    bank: 'LPBank',
    urls: [
      'https://www.lpbank.com.vn/the-tin-dung',
    ],
  },
];

(async () => {
  const results = {};
  let browser;
  try {
    browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    const context = browser.contexts()[0] || await browser.newContext();

    for (const { bank, urls } of BANKS) {
      results[bank] = [];
      for (const url of urls) {
        const page = await context.newPage();
        try {
          await page.goto(url, { timeout: 15000, waitUntil: 'domcontentloaded' });
          // Extract all visible text content
          const text = await page.evaluate(() => {
            // Remove scripts, styles, nav, footer noise
            const remove = document.querySelectorAll('script,style,noscript,iframe');
            remove.forEach(el => el.remove());
            return document.body?.innerText?.substring(0, 8000) || '';
          });
          results[bank].push({ url, text: text.trim() });
        } catch (e) {
          results[bank].push({ url, error: e.message?.substring(0, 200) });
        } finally {
          await page.close();
        }
      }
      // Small delay between banks
      await new Promise(r => setTimeout(r, 500));
    }
  } catch (e) {
    console.error('Browser error:', e.message);
  } finally {
    if (browser) await browser.close();
  }

  // Write results
  const fs = require('fs');
  fs.writeFileSync('/tmp/harvest_raw.json', JSON.stringify(results, null, 2));

  // Print summary
  for (const [bank, pages] of Object.entries(results)) {
    const ok = pages.filter(p => p.text && p.text.length > 100).length;
    const err = pages.filter(p => p.error).length;
    const empty = pages.length - ok - err;
    console.log(`${bank.padEnd(20)} ${ok} ok, ${err} err, ${empty} empty`);
  }
})();
