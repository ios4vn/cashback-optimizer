# Phase 3: Spending Tracker

## Plans

### Plan 3.1: Dashboard
**Tasks:**
1. Tab "Lịch sử" → hiển thị dashboard tháng hiện tại
2. Summary cards: tổng chi tiêu, tổng cashback, số giao dịch
3. Cap tracker: mỗi thẻ user có → progress bar cap đã dùng / cap tổng, per danh mục
4. Data từ localStorage `month_usage` + `transactions`

**Verification:** Sau vài giao dịch confirm → dashboard reflect đúng

### Plan 3.2: Transaction History
**Tasks:**
1. Bảng lịch sử giao dịch: ngày, danh mục, số tiền, thẻ, cashback
2. Sort theo ngày (mới nhất trước)
3. Nút sửa → modal edit amount/category/card
4. Nút xóa → confirm → xóa + recalculate cap
5. Recalculate `month_usage` sau mỗi sửa/xóa

**Verification:** Sửa giao dịch → cap cập nhật, xóa → cap giảm

### Plan 3.3: Manual Add + Month Reset
**Tasks:**
1. Nút "Thêm giao dịch" → form: ngày, thẻ, danh mục, số tiền
2. Dùng cho giao dịch ngoài app
3. Auto detect tháng mới: khi mở app, check `current_month` vs stored month
4. Nếu tháng mới: archive transactions cũ vào `history_{YYYY-MM}`, reset `month_usage`
5. Show thông báo "Tháng mới! Cap đã reset"

**Verification:**
- Thêm manual → xuất hiện trong history + cap cập nhật
- Giả lập tháng mới → data reset, archive tháng cũ

## Success Criteria
- [ ] Dashboard hiển thị tổng cashback + cap tracker
- [ ] Lịch sử giao dịch với sửa/xóa
- [ ] Thêm giao dịch manual
- [ ] Auto reset tháng mới

## Estimated Effort
~3-4 hours
