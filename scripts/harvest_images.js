const { chromium } = require('playwright');
const fs = require('fs');

const cards = JSON.parse(fs.readFileSync('data/cards.json', 'utf8'));

// Map card IDs to search URLs where card images are likely found
const SEARCH_PAGES = [
  { bank: 'HSBC', url: 'https://www.hsbc.com.vn/credit-cards/' },
  { bank: 'VIB', url: 'https://www.vib.com.vn/vn/the-tin-dung' },
  { bank: 'Techcombank', url: 'https://techcombank.com/khach-hang-ca-nhan/chi-tieu/the/the-tin-dung' },
  { bank: 'VPBank', url: 'https://www.vpbank.com.vn/ca-nhan/the-tin-dung' },
  { bank: 'TPBank', url: 'https://tpb.vn/ca-nhan/the/the-tin-dung' },
  { bank: 'ACB', url: 'https://www.acb.com.vn/the-ngan-hang/the-tin-dung' },
  { bank: 'Sacombank', url: 'https://www.sacombank.com.vn/ca-nhan/the/the-tin-dung.html' },
  { bank: 'Shinhan', url: 'https://www.shinhan.com.vn/vi/ca-nhan/the/the-tin-dung' },
  { bank: 'VietinBank', url: 'https://www.vietinbank.vn/the-tin-dung' },
  { bank: 'BIDV', url: 'https://www.bidv.com.vn/ca-nhan/san-pham/the' },
  { bank: 'SeABank', url: 'https://www.seabank.com.vn/ca-nhan/the' },
  { bank: 'KBank', url: 'https://www.kasikornbank.com.vn/VN/Personal/Card/Pages/CreditCard.aspx' },
  { bank: 'UOB', url: 'https://www.uob.com.vn/personal/cards/credit-cards/index.page' },
  { bank: 'Standard Chartered', url: 'https://www.sc.com/vn/credit-cards/' },
  { bank: 'Eximbank', url: 'https://www.eximbank.com.vn/san-pham/the-tin-dung' },
  { bank: 'OCB', url: 'https://www.ocb.com.vn/san-pham/the-tin-dung' },
  { bank: 'MSB', url: 'https://www.msb.com.vn/ca-nhan/the' },
  { bank: 'MB Bank', url: 'https://www.mbbank.com.vn' },
  { bank: 'SHB', url: 'https://www.shb.com.vn/ca-nhan/the/the-tin-dung/' },
  { bank: 'LPBank', url: 'https://www.lpbank.com.vn/ca-nhan/the' },
  { bank: 'LioBank', url: 'https://liobank.vn/' },
  { bank: 'Vietcombank', url: 'https://www.vietcombank.com.vn/KHCN/SPDV/The' },
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15',
  });

  const allImages = {};

  for (const { bank, url } of SEARCH_PAGES) {
    const page = await context.newPage();
    try {
      await page.goto(url, { timeout: 15000, waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);

      // Extract all images that look like card images
      const images = await page.evaluate(() => {
        const imgs = [];
        document.querySelectorAll('img').forEach(img => {
          const src = img.src || img.dataset?.src || img.getAttribute('data-lazy-src') || '';
          const alt = (img.alt || '').toLowerCase();
          const w = img.naturalWidth || img.width || 0;
          // Filter: likely card images (not icons, not tiny)
          if (src && (src.includes('card') || src.includes('the-') || src.includes('credit') || 
              src.includes('visa') || src.includes('master') || src.includes('jcb') ||
              src.includes('cashback') || src.includes('platinum') || src.includes('signature') ||
              alt.includes('card') || alt.includes('thẻ') || alt.includes('credit') ||
              w > 150)) {
            imgs.push({ src, alt: img.alt || '', width: w });
          }
        });
        // Also check background images on card-like elements
        document.querySelectorAll('[class*=card], [class*=product], [class*=the-]').forEach(el => {
          const bg = getComputedStyle(el).backgroundImage;
          if (bg && bg !== 'none' && bg.includes('url(')) {
            const m = bg.match(/url\(["']?([^"')]+)/);
            if (m) imgs.push({ src: m[1], alt: 'bg-image', width: 0 });
          }
        });
        return imgs;
      });

      allImages[bank] = images;
      console.log(`✅ ${bank.padEnd(20)} ${images.length} images found`);
    } catch (e) {
      allImages[bank] = [];
      console.log(`❌ ${bank.padEnd(20)} ${e.message?.substring(0, 60)}`);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  fs.writeFileSync('/tmp/card_images.json', JSON.stringify(allImages, null, 2));
  console.log('\nSaved to /tmp/card_images.json');
})();
