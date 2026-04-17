# Cashback Optimizer v2

## What This Is

Web app giúp người dùng thẻ tín dụng tại Việt Nam trả lời câu hỏi: **"Tôi sắp trả X đồng cho danh mục Y, nên dùng thẻ nào?"** — có tính đến trần hoàn tiền (cap) đã dùng trong tháng.

## Core Value

**Mỗi lần thanh toán → mở app → nhập số tiền + danh mục → biết ngay thẻ nào tối ưu nhất → confirm → tự động log chi tiêu.**

## How It Works

1. **Setup 1 lần**: User chọn thẻ đang có
2. **Mỗi lần thanh toán**: Nhập số tiền + danh mục → hệ thống gợi ý thẻ tối ưu
3. **Confirm**: User chọn thẻ → giao dịch tự động log, cap còn lại cập nhật
4. **Điều chỉnh**: User có thể sửa/xóa log, nhập giao dịch ngoài app
5. **Reset tự động**: Đầu tháng mới, cap reset về 0

### Optimization Logic

```
Với mỗi thẻ user có:
  cashback = min(amount × rate%, cap_monthly - used_this_month)
  → Thẻ nào cashback cao nhất = gợi ý
```

## Context

- **Thị trường:** Việt Nam, thẻ tín dụng cashback phổ biến, nhiều người có 2-5 thẻ
- **Pain point:** Không biết thẻ nào tối ưu cho giao dịch cụ thể, quên cap đã dùng
- **Data source:** 13 thẻ từ 9 ngân hàng, lưu tại `data/cards.json`
- **Khác biệt vs v1:** Từ "phân bổ lý thuyết" → "gợi ý real-time per giao dịch"

## Constraints

- **Tech stack**: Python (Flask) + vanilla HTML/CSS/JS
- **Storage**: localStorage (không cần auth, không cần backend DB)
- **Timeline**: MVP trong 1-2 tuần
- **Budget**: $0
- **No auth**: v1 không cần đăng nhập

## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Log tự động khi confirm gợi ý | Zero friction, data tích lũy tự nhiên |
| Cho phép điều chỉnh thủ công | User có giao dịch ngoài app |
| localStorage, không backend DB | Đơn giản, không cần auth, privacy |
| Auto reset đầu tháng | Cap cashback tính theo tháng |
| Vẫn giữ trang so sánh thẻ | SEO + giá trị tham khảo |

---
*Last updated: 2026-04-17 — Redesign v2: real-time per-transaction recommendation*
