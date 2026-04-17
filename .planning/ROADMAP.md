# Roadmap: Cashback Optimizer v2

## Overview

Xây dựng web app gợi ý thẻ tối ưu per giao dịch, có tracking cap đã dùng trong tháng. 5 phases, mỗi phase deliver giá trị độc lập.

## Phases

- [ ] **Phase 1: Foundation + Card Setup** — Flask app + data thẻ + UI chọn thẻ đang có
- [ ] **Phase 2: Recommendation Engine** — Form gợi ý nhanh + engine tính cashback có trừ cap
- [ ] **Phase 3: Spending Tracker** — Log giao dịch, dashboard cap, lịch sử, sửa/xóa, reset tháng
- [ ] **Phase 4: Full UI + Card Pages** — Navigation, so sánh thẻ, chi tiết thẻ, responsive polish
- [ ] **Phase 5: SEO & Deploy** — Meta tags, performance, deploy hosting

## Phase Details

### Phase 1: Foundation + Card Setup
**Goal**: Flask app chạy được, user chọn thẻ đang có, lưu localStorage
**Requirements**: SETUP-01, SETUP-02, SETUP-03, CARD-01
**Success Criteria**:
  1. Flask app start, serve trang chủ
  2. API `/api/cards` trả 13 thẻ
  3. UI multi-select thẻ, lưu/load từ localStorage
  4. User thêm/bớt thẻ, refresh vẫn giữ

### Phase 2: Recommendation Engine
**Goal**: User nhập tiền + danh mục → nhận gợi ý thẻ tối ưu có tính cap đã dùng → confirm log
**Depends on**: Phase 1
**Requirements**: REC-01, REC-02, REC-03, REC-04, REC-05, TRACK-01
**Success Criteria**:
  1. Form nhập: số tiền + dropdown danh mục
  2. API `/api/recommend` nhận {amount, category, cards[], used_caps{}} → trả ranking thẻ
  3. Hiển thị top thẻ với: rate, cashback ước tính, cap còn lại
  4. Nút confirm → log giao dịch vào localStorage
  5. Gợi ý thay đổi khi cap đã dùng tăng

### Phase 3: Spending Tracker
**Goal**: Dashboard tracking chi tiêu tháng, lịch sử, sửa/xóa, nhập manual, auto reset
**Depends on**: Phase 2
**Requirements**: TRACK-02, TRACK-03, TRACK-04, TRACK-05, TRACK-06
**Success Criteria**:
  1. Dashboard: tổng cashback tháng, cap còn lại per thẻ per danh mục
  2. Bảng lịch sử giao dịch trong tháng
  3. Sửa/xóa giao dịch, cap tự cập nhật
  4. Nút "Thêm giao dịch" cho chi tiêu ngoài app
  5. Detect tháng mới → reset log (archive tháng cũ)

### Phase 4: Full UI + Card Pages
**Goal**: Navigation hoàn chỉnh, trang so sánh + chi tiết thẻ, responsive mobile-first
**Depends on**: Phase 3
**Requirements**: CARD-02, CARD-03, UI-01, UI-02, UI-03, UI-04, UI-05
**Success Criteria**:
  1. Navigation bar: Gợi ý | Lịch sử | Thẻ của tôi | So sánh
  2. Trang so sánh thẻ dạng bảng
  3. Trang chi tiết thẻ
  4. Mobile-first responsive (375px+)
  5. Loading + error states

### Phase 5: SEO & Deploy
**Goal**: Tối ưu SEO, deploy lên hosting miễn phí
**Depends on**: Phase 4
**Requirements**: SEO-01, SEO-02, SEO-03
**Success Criteria**:
  1. Meta tags tối ưu
  2. Semantic HTML, accessible
  3. Deploy thành công, URL public

## Progress

| Phase | Status | Completed |
|-------|--------|-----------|
| 1. Foundation + Card Setup | Not started | - |
| 2. Recommendation Engine | Not started | - |
| 3. Spending Tracker | Not started | - |
| 4. Full UI + Card Pages | Not started | - |
| 5. SEO & Deploy | Not started | - |

---
*Last updated: 2026-04-17 — v2 redesign*
