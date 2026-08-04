# 07. Design System

## Định hướng giao diện

- Chuyên nghiệp, đáng tin cậy, dữ liệu rõ ràng.
- Ít trang trí. Ưu tiên khả năng đọc tài liệu và bảng dữ liệu.
- Không tạo cảm giác chatbot giải trí.

## Color Tokens

```css
--color-primary-900: #00327d;
--color-primary-700: #0047ab;
--color-primary-100: #d2e0fe;

--color-success-700: #18512c;
--color-success-100: #b5f1bf;

--color-warning-700: #8a4f00;
--color-warning-100: #ffddb3;

--color-danger-700: #93000a;
--color-danger-100: #ffdad6;

--color-neutral-950: #191c1e;
--color-neutral-700: #434653;
--color-neutral-300: #c3c6d5;
--color-neutral-100: #eceef0;
--color-neutral-50:  #f7f9fb;
```

> **KHÔNG hardcode màu hex trong component.** Luôn dùng CSS token.

## Typography

| Token | Cỡ | Dùng cho |
|---|---:|---|
| Display | 40px | Hero, landing |
| H1 | 32px | Page title |
| H2 | 24px | Section |
| H3 | 20px | Subsection |
| Body large | 16px | Lead text |
| Body | 14px | Nội dung chính |
| Caption | 12px | Label phụ |
| Label | 11px | Badge, tag |

**Font:** Heading = `Playfair Display` · Body = `Inter` · Code/ID = `JetBrains Mono`

## Component bắt buộc

- Button, Input, Select, Combobox, Date picker
- Badge, Risk badge, Status badge
- Card, Data table, Pagination
- Tabs, Modal, Drawer
- Tooltip, Toast, Skeleton
- Empty state, Error state
- File uploader, Document preview
- Progress stepper
- Finding card, Legal citation card
- Audit timeline

## Accessibility

- Màu không phải tín hiệu duy nhất — mọi status phải có cả icon lẫn text.
- Focus state rõ ràng; keyboard navigation hoạt động.
- Label đầy đủ cho form; modal giữ focus.
- Contrast đạt WCAG AA.
- Tap target tối thiểu 44px.
- Bảng có chế độ scroll trên mobile.
