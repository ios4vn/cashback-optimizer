# Phase 2: Recommendation Engine

## Plans

### Plan 2.1: Recommend API
**Tasks:**
1. Tạo endpoint `POST /api/recommend`:
   - Input: `{amount, category, my_cards[], month_usage: {card_id: {category: amount_used}}}`
   - Logic: với mỗi thẻ, tính `cashback = min(amount × rate%, cap - used)`, xếp hạng
   - Output: `{recommendations: [{card_id, card_name, bank, rate, cashback, cap_total, cap_used, cap_remaining}]}`
2. Handle edge cases: thẻ không có rate cho danh mục → fallback "other", cap = null → unlimited
3. Unit test engine logic

**Verification:** curl test với mock data, verify cap calculation chính xác

### Plan 2.2: Recommendation UI
**Tasks:**
1. Tab "Gợi ý": form nhập số tiền + dropdown danh mục
2. Gọi `/api/recommend` với data từ localStorage (my_cards + month_usage)
3. Render ranking thẻ: card name, rate, cashback, progress bar cap còn lại
4. Highlight thẻ #1 (best choice)
5. Format tiền VNĐ, auto-format input

**Verification:** Nhập 5tr ăn uống → thấy ranking thẻ với cashback chính xác

### Plan 2.3: Confirm + Auto Log
**Tasks:**
1. Nút "Dùng thẻ này" trên mỗi recommendation
2. Confirm → lưu giao dịch vào localStorage: `{date, card_id, category, amount, cashback}`
3. Update `month_usage` trong localStorage
4. Show toast "Đã ghi nhận! Cashback +XXXđ"
5. Form reset, sẵn sàng cho giao dịch tiếp

**Verification:**
- Confirm → log xuất hiện trong localStorage
- Gợi ý lần sau reflect cap đã dùng
- 2 giao dịch liên tiếp cùng thẻ → cap giảm đúng

## Success Criteria
- [ ] API recommend tính đúng cashback có trừ cap
- [ ] UI form gợi ý hoạt động mượt
- [ ] Confirm → auto log → cap cập nhật
- [ ] Gợi ý thay đổi khi cap đã dùng tăng

## Estimated Effort
~3-4 hours
