# Cashback Optimizer

## What This Is

Web app giúp người dùng thẻ tín dụng tại Việt Nam tối ưu hoàn tiền (cashback) bằng cách gợi ý thẻ phù hợp nhất cho từng danh mục chi tiêu. Nhập chi tiêu hàng tháng → hệ thống tính toán và đề xuất cách chia thẻ để hoàn tiền tối đa.

## Core Value

**Người dùng nhập chi tiêu → nhận ngay gợi ý thẻ tối ưu cho từng danh mục → biết chính xác mình tiết kiệm được bao nhiêu.**

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Database thẻ cashback phổ biến tại VN (HSBC, Techcombank, VIB, VPBank, TPBank, ACB, Sacombank, MB, Shinhan)
- [ ] Người dùng nhập chi tiêu theo danh mục (ăn uống, online, siêu thị, xăng, du lịch, y tế, giáo dục, khác)
- [ ] Hệ thống gợi ý thẻ tối ưu cho từng danh mục chi tiêu
- [ ] Tính toán tổng cashback ước tính/tháng (có tính cap)
- [ ] So sánh: cashback hiện tại vs cashback tối ưu
- [ ] Xem chi tiết từng thẻ (cashback rates, phí, điều kiện)
- [ ] Responsive web, hoạt động tốt trên mobile
- [ ] Giao diện tiếng Việt

### Out of Scope

- Kết nối ngân hàng / Open Banking — chưa có tại VN
- Tracking giao dịch tự động — cần kết nối bank API
- Mobile app native — web-first, mobile later
- Đăng ký / đăng nhập — miễn phí, không cần auth ở v1
- Affiliate links — chưa cần monetize ở v1
- Promo/ưu đãi theo tháng — data thay đổi liên tục, phức tạp

## Context

- **Thị trường:** Việt Nam, thẻ tín dụng cashback đang phổ biến, nhiều người có 2-5 thẻ nhưng không biết tối ưu
- **Cộng đồng:** Các group Facebook "Hội thẻ tín dụng Việt Nam" có 100k+ thành viên, bài so sánh thẻ luôn 100+ tương tác
- **Pain point đã validate:** Người dùng không biết thẻ nào cashback cao nhất cho từng loại chi tiêu, quên ưu đãi, không track cap
- **Data source:** Thông tin cashback từ website chính thức ngân hàng, cần cập nhật thủ công
- **Rào cản:** Không có Open Banking tại VN, thông tin cashback thay đổi theo chương trình khuyến mãi
- **Đã research:** 13 thẻ từ 9 ngân hàng, data lưu tại `data/cards.json`

## Constraints

- **Tech stack**: Python (Flask) + vanilla HTML/CSS/JS — đơn giản, nhanh, anh Triều quen Python
- **Timeline**: MVP trong 1-2 tuần
- **Budget**: $0 — miễn phí hosting (Vercel/Railway free tier hoặc static)
- **Data**: Cập nhật thủ công từ website ngân hàng, không có API
- **No auth**: v1 không cần đăng nhập, tất cả miễn phí
- **SEO**: Cần SEO tốt để thu hút organic traffic từ Google

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Web app, không mobile app | Web-first, dễ SEO, dễ share link, không cần app store | — Pending |
| Miễn phí, không monetize v1 | Tập trung user acquisition trước, monetize sau | — Pending |
| Flask + vanilla frontend | Đơn giản nhất, anh Triều quen Python, không cần framework nặng | — Pending |
| Data thẻ dạng JSON file | Không cần database phức tạp cho 13 thẻ, dễ cập nhật | — Pending |
| Tiếng Việt only | Target market là VN, không cần đa ngôn ngữ | — Pending |

---
*Last updated: 2026-04-17 after project initialization*
