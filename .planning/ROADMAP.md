# Roadmap: Cashback Optimizer

## Overview

Xây dựng web app tối ưu cashback thẻ tín dụng VN qua 5 phase: data foundation → optimization engine → results UI → polish UX → SEO & deploy. Mỗi phase deliver giá trị độc lập, có thể test ngay.

## Phases

- [ ] **Phase 1: Data Foundation** - Cấu trúc data thẻ cashback + Flask app skeleton
- [ ] **Phase 2: Optimization Engine** - Form nhập chi tiêu + thuật toán tối ưu cashback
- [ ] **Phase 3: Results & Card Display** - Hiển thị kết quả tối ưu + trang chi tiết thẻ
- [ ] **Phase 4: UI/UX Polish** - Responsive, tiếng Việt, flow 3 bước, mobile-friendly
- [ ] **Phase 5: SEO & Deploy** - Meta tags, performance, deploy lên hosting

## Phase Details

### Phase 1: Data Foundation
**Goal**: Flask app chạy được với data thẻ cashback từ JSON, có API endpoint trả về danh sách thẻ
**Depends on**: Nothing (first phase)
**Requirements**: CARD-01, CARD-02, CARD-03
**Success Criteria** (what must be TRUE):
  1. Flask app start được, trả về trang chủ
  2. Data 13 thẻ từ 9 ngân hàng load thành công từ JSON
  3. API `/api/cards` trả về danh sách thẻ dạng JSON
**Plans**: TBD

### Phase 2: Optimization Engine
**Goal**: Người dùng nhập chi tiêu + chọn thẻ → hệ thống tính cashback tối ưu
**Depends on**: Phase 1
**Requirements**: SPEND-01, SPEND-02, SPEND-03, OPT-01, OPT-02, OPT-03, OPT-04, OPT-05
**Success Criteria** (what must be TRUE):
  1. Form nhập chi tiêu 8 danh mục hoạt động
  2. Multi-select chọn thẻ đang có
  3. Thuật toán tính cashback tối ưu có tính cap/tháng
  4. API `/api/optimize` nhận input và trả kết quả chính xác
**Plans**: TBD

### Phase 3: Results & Card Display
**Goal**: Hiển thị kết quả tối ưu trực quan + trang xem chi tiết từng thẻ
**Depends on**: Phase 2
**Requirements**: CARD-04, CARD-05, RESULT-01, RESULT-02, RESULT-03, RESULT-04
**Success Criteria** (what must be TRUE):
  1. Bảng kết quả: danh mục → thẻ gợi ý → cashback ước tính
  2. Tổng tiết kiệm/tháng và /năm hiển thị rõ
  3. So sánh trước/sau tối ưu
  4. Trang chi tiết thẻ với đầy đủ thông tin
  5. Gợi ý thẻ mới nếu thiếu
**Plans**: TBD

### Phase 4: UI/UX Polish
**Goal**: Giao diện hoàn chỉnh, responsive, tiếng Việt, flow mượt trên mobile
**Depends on**: Phase 3
**Requirements**: UI-01, UI-02, UI-03, UI-04, UI-05
**Success Criteria** (what must be TRUE):
  1. Trang chủ có value proposition rõ ràng
  2. Flow 3 bước mượt: chọn thẻ → nhập chi tiêu → xem kết quả
  3. Responsive hoạt động tốt trên mobile (375px+)
  4. Loading states và error handling thân thiện
  5. Toàn bộ UI tiếng Việt
**Plans**: TBD

### Phase 5: SEO & Deploy
**Goal**: Tối ưu SEO, performance, deploy lên hosting miễn phí
**Depends on**: Phase 4
**Requirements**: SEO-01, SEO-02, SEO-03, SEO-04
**Success Criteria** (what must be TRUE):
  1. Meta tags tối ưu cho "thẻ cashback Việt Nam", "so sánh thẻ tín dụng"
  2. Trang so sánh thẻ indexable bởi Google
  3. Page load < 3s trên 3G
  4. Deploy thành công, accessible qua URL public
**Plans**: TBD

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|---------------|--------|-----------|
| 1. Data Foundation | 0/TBD | Not started | - |
| 2. Optimization Engine | 0/TBD | Not started | - |
| 3. Results & Card Display | 0/TBD | Not started | - |
| 4. UI/UX Polish | 0/TBD | Not started | - |
| 5. SEO & Deploy | 0/TBD | Not started | - |
