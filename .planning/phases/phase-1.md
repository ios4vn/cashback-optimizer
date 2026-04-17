# Phase 1: Foundation + Card Setup

## Plans

### Plan 1.1: Flask App + Card API
**Tasks:**
1. Refactor `app.py`: giữ Flask skeleton, card loading, `/api/cards` endpoint
2. Remove v1 optimize logic (sẽ rewrite ở Phase 2)
3. Verify: `python3 app.py` start OK, `GET /api/cards` trả 13 thẻ

**Verification:** `curl /api/cards | jq length` = 13

### Plan 1.2: Card Setup UI + localStorage
**Tasks:**
1. Rewrite `templates/index.html`: trang chủ mới với card selection grid
2. Rewrite `static/app.js`:
   - Load cards từ API
   - Render card grid với checkbox
   - Save/load selected cards từ localStorage (`cashback_my_cards`)
   - Thêm/bớt thẻ → auto save
3. Update `static/style.css`: giữ dark theme, adjust layout cho flow mới

**Verification:**
- Chọn 3 thẻ → refresh → vẫn checked
- Bỏ chọn 1 thẻ → refresh → đúng 2 thẻ
- Mobile responsive OK

### Plan 1.3: App Shell + Navigation Skeleton
**Tasks:**
1. Tạo navigation bar skeleton (tabs): Gợi ý | Lịch sử | Thẻ của tôi | So sánh
2. Tab "Thẻ của tôi" = card setup UI từ Plan 1.2
3. Tab "Gợi ý" = placeholder (Phase 2)
4. Tab "Lịch sử" = placeholder (Phase 3)
5. Tab "So sánh" = placeholder (Phase 4)
6. SPA-style tab switching (no page reload)

**Verification:**
- Click tabs → content switch, no reload
- URL không thay đổi (SPA trong 1 page)
- Mobile: tabs hiển thị đẹp

## Success Criteria
- [ ] Flask app start, `/api/cards` trả 13 thẻ
- [ ] Card selection UI hoạt động, lưu localStorage
- [ ] Navigation shell với 4 tabs
- [ ] Responsive trên mobile

## Estimated Effort
~2-3 hours
