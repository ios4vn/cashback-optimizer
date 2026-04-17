# Requirements: Cashback Optimizer v2

**Defined:** 2026-04-17
**Core Value:** Mỗi lần thanh toán → biết ngay thẻ nào tối ưu → confirm → tự log

## v1 Requirements

### Card Setup (SETUP)

- [ ] **SETUP-01**: User chọn thẻ đang sở hữu từ danh sách 13 thẻ (multi-select)
- [ ] **SETUP-02**: Lưu danh sách thẻ đã chọn vào localStorage
- [ ] **SETUP-03**: User có thể thêm/bớt thẻ bất kỳ lúc nào

### Transaction Recommendation (REC)

- [ ] **REC-01**: User nhập số tiền + chọn danh mục chi tiêu
- [ ] **REC-02**: Hệ thống tính cashback mỗi thẻ user có, **trừ đi cap đã dùng trong tháng**
- [ ] **REC-03**: Xếp hạng thẻ từ cashback cao → thấp, gợi ý thẻ #1
- [ ] **REC-04**: Hiển thị chi tiết: thẻ, rate, cashback ước tính, cap còn lại
- [ ] **REC-05**: User confirm chọn thẻ → giao dịch tự động log vào lịch sử tháng

### Spending Tracker (TRACK)

- [ ] **TRACK-01**: Lưu log giao dịch trong tháng vào localStorage (thẻ, danh mục, số tiền, ngày)
- [ ] **TRACK-02**: Hiển thị dashboard: tổng cashback tháng này, cap còn lại mỗi thẻ
- [ ] **TRACK-03**: User xem lịch sử giao dịch trong tháng
- [ ] **TRACK-04**: User sửa/xóa giao dịch đã log (cho giao dịch nhập sai)
- [ ] **TRACK-05**: User nhập giao dịch ngoài app (manual add)
- [ ] **TRACK-06**: Tự động reset đầu tháng mới (detect tháng thay đổi)

### Card Database (CARD)

- [ ] **CARD-01**: Data 13 thẻ từ 9 ngân hàng load từ JSON
- [ ] **CARD-02**: Trang so sánh tất cả thẻ (bảng tổng hợp)
- [ ] **CARD-03**: Trang chi tiết từng thẻ (rates, phí, điều kiện, cap)

### UI/UX (UI)

- [ ] **UI-01**: Giao diện tiếng Việt, dark theme
- [ ] **UI-02**: Responsive, mobile-first (dùng khi đứng ở quầy thanh toán)
- [ ] **UI-03**: Trang chủ = form gợi ý nhanh (nhập tiền + danh mục → kết quả ngay)
- [ ] **UI-04**: Navigation: Gợi ý | Lịch sử | Thẻ của tôi | So sánh thẻ
- [ ] **UI-05**: Loading state và error handling

### SEO (SEO)

- [ ] **SEO-01**: Meta tags tối ưu cho "cashback thẻ tín dụng Việt Nam"
- [ ] **SEO-02**: Trang so sánh thẻ indexable
- [ ] **SEO-03**: Semantic HTML, accessible

## v2 Requirements (Later)

- Đăng nhập để sync data cross-device
- Push notification nhắc cap sắp đầy
- Import sao kê từ file CSV/PDF
- Affiliate links mở thẻ mới

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| SETUP-01~03 | Phase 1 | Pending |
| CARD-01 | Phase 1 | Pending |
| REC-01~05 | Phase 2 | Pending |
| TRACK-01~06 | Phase 3 | Pending |
| CARD-02~03 | Phase 4 | Pending |
| UI-01~05 | Phase 4 | Pending |
| SEO-01~03 | Phase 5 | Pending |

---
*Last updated: 2026-04-17 — v2 redesign*
