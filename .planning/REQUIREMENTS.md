# Requirements: Cashback Optimizer

**Defined:** 2026-04-17
**Core Value:** Người dùng nhập chi tiêu → nhận gợi ý thẻ tối ưu → biết chính xác tiết kiệm bao nhiêu

## v1 Requirements

### Card Database (CARD)

- [ ] **CARD-01**: Hệ thống lưu trữ thông tin thẻ cashback từ 9+ ngân hàng VN
- [ ] **CARD-02**: Mỗi thẻ có: tên, ngân hàng, mạng (Visa/Master/JCB), phí thường niên, cashback rules theo danh mục
- [ ] **CARD-03**: Mỗi cashback rule có: danh mục, tỷ lệ %, cap/tháng, điều kiện đặc biệt
- [ ] **CARD-04**: Người dùng xem danh sách tất cả thẻ với thông tin cơ bản
- [ ] **CARD-05**: Người dùng xem chi tiết từng thẻ (rates, phí, điều kiện)

### Spending Input (SPEND)

- [ ] **SPEND-01**: Người dùng nhập số tiền chi tiêu theo 8 danh mục: ăn uống, online, siêu thị, xăng, du lịch, y tế, giáo dục, khác
- [ ] **SPEND-02**: Người dùng chọn các thẻ mình đang có (multi-select)
- [ ] **SPEND-03**: Form nhập trực quan, dễ dùng trên mobile

### Optimization Engine (OPT)

- [ ] **OPT-01**: Hệ thống tính cashback tối ưu cho từng danh mục dựa trên thẻ user đang có
- [ ] **OPT-02**: Tính toán có tính đến cap/tháng của từng thẻ
- [ ] **OPT-03**: Gợi ý thẻ nào dùng cho danh mục nào
- [ ] **OPT-04**: Tính tổng cashback ước tính/tháng
- [ ] **OPT-05**: So sánh: cashback nếu dùng 1 thẻ cho tất cả vs cashback tối ưu

### Results Display (RESULT)

- [ ] **RESULT-01**: Hiển thị bảng gợi ý: danh mục → thẻ nên dùng → cashback ước tính
- [ ] **RESULT-02**: Hiển thị tổng tiết kiệm/tháng và /năm
- [ ] **RESULT-03**: Highlight sự khác biệt giữa cách dùng hiện tại vs tối ưu
- [ ] **RESULT-04**: Gợi ý thẻ mới nên mở nếu chưa có thẻ tốt cho danh mục nào đó

### UI/UX (UI)

- [ ] **UI-01**: Giao diện tiếng Việt hoàn toàn
- [ ] **UI-02**: Responsive design, hoạt động tốt trên mobile
- [ ] **UI-03**: Trang chủ với value proposition rõ ràng
- [ ] **UI-04**: Flow 3 bước: chọn thẻ → nhập chi tiêu → xem kết quả
- [ ] **UI-05**: Loading state và error handling thân thiện

### SEO & Performance (SEO)

- [ ] **SEO-01**: Meta tags, title, description tối ưu cho từ khóa "thẻ cashback Việt Nam"
- [ ] **SEO-02**: Trang so sánh thẻ có thể index bởi Google
- [ ] **SEO-03**: Page load < 3 giây trên 3G
- [ ] **SEO-04**: Semantic HTML, accessible

## v2 Requirements

### User Accounts

- **USER-01**: Đăng ký/đăng nhập để lưu profile thẻ
- **USER-02**: Lưu lịch sử tính toán

### Monetization

- **MON-01**: Affiliate links mở thẻ mới
- **MON-02**: Freemium model với tính năng nâng cao

### Promo Tracking

- **PROMO-01**: Cập nhật promo/ưu đãi theo tháng
- **PROMO-02**: Thông báo khi có promo mới cho thẻ user đang có

### Advanced

- **ADV-01**: So sánh 2 thẻ side-by-side
- **ADV-02**: Gợi ý combo thẻ tối ưu (nếu user chưa có thẻ nào)
- **ADV-03**: Export kết quả dạng PDF/image để share

## Out of Scope

| Feature | Reason |
|---------|--------|
| Kết nối ngân hàng | Chưa có Open Banking tại VN |
| Tracking giao dịch tự động | Cần bank API, không khả thi |
| Mobile app native | Web-first, mobile responsive đủ cho v1 |
| Đa ngôn ngữ | Target VN only |
| Real-time promo updates | Data thay đổi liên tục, quá phức tạp cho v1 |
| Payment/subscription | Miễn phí hoàn toàn ở v1 |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| CARD-01 | Phase 1 | Pending |
| CARD-02 | Phase 1 | Pending |
| CARD-03 | Phase 1 | Pending |
| CARD-04 | Phase 3 | Pending |
| CARD-05 | Phase 3 | Pending |
| SPEND-01 | Phase 2 | Pending |
| SPEND-02 | Phase 2 | Pending |
| SPEND-03 | Phase 2 | Pending |
| OPT-01 | Phase 2 | Pending |
| OPT-02 | Phase 2 | Pending |
| OPT-03 | Phase 2 | Pending |
| OPT-04 | Phase 2 | Pending |
| OPT-05 | Phase 2 | Pending |
| RESULT-01 | Phase 3 | Pending |
| RESULT-02 | Phase 3 | Pending |
| RESULT-03 | Phase 3 | Pending |
| RESULT-04 | Phase 3 | Pending |
| UI-01 | Phase 4 | Pending |
| UI-02 | Phase 4 | Pending |
| UI-03 | Phase 4 | Pending |
| UI-04 | Phase 4 | Pending |
| UI-05 | Phase 4 | Pending |
| SEO-01 | Phase 5 | Pending |
| SEO-02 | Phase 5 | Pending |
| SEO-03 | Phase 5 | Pending |
| SEO-04 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 26 total
- Mapped to phases: 26
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-17*
*Last updated: 2026-04-17 after initial definition*
