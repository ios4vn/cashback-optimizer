# Project State

## Project Reference

See: .planning/PROJECT.md

**Core value:** Mỗi lần thanh toán → biết ngay thẻ nào tối ưu → confirm → tự log
**Current focus:** Phase 1 - Foundation + Card Setup

## Current Position

Phase: 1 of 5 (Foundation + Card Setup)
Plan: 0 of TBD
Status: Ready to plan
Last activity: 2026-04-17 — v2 redesign, planning docs updated

Progress: [░░░░░░░░░░] 0%

## Accumulated Context

### Decisions

- [v2 Redesign]: Chuyển từ "phân bổ lý thuyết" → "gợi ý per giao dịch real-time"
- [v2 Redesign]: Log tự động khi confirm + cho phép điều chỉnh thủ công
- [v2 Redesign]: localStorage cho storage, auto reset đầu tháng
- [v1 code]: Có sẵn Flask app + templates + CSS từ v1, cần refactor

### Existing Code (from v1)

- `app.py` — Flask app, cần refactor optimize engine
- `templates/index.html` — Cần redesign cho flow mới
- `templates/card.html` — Giữ lại, polish
- `static/style.css` — Giữ dark theme, refactor layout
- `static/app.js` — Cần rewrite cho flow mới
- `data/cards.json` — Giữ nguyên

### Blockers/Concerns

- Không có

---
*Last updated: 2026-04-17*
