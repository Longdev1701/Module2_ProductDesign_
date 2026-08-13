# THEMIS LEXIGUARD MOBILE — BỘ PROMPT VÀ ASSETS DỰNG ỨNG DỤNG MOBILE EXPO (1:1 DESIGN)

Tệp tài liệu này chứa toàn bộ hình ảnh thiết kế UI mẫu và các bộ Prompt chi tiết 1:1 dùng để đưa vào AI (Cursor, Claude 3.5 Sonnet, Gemini 1.5 Pro, Copilot) nhằm phát triển ứng dụng di động **Themis LexiGuard Mobile** trên nền tảng **Expo React Native (Expo Go)**.

---

## 📁 Cấu trúc Thư mục Tài nguyên (`docs/mobile-prompts/`)

```
docs/mobile-prompts/
├── EXPO_MASTER_PROMPT.md        # System Prompt tổng quan (Color Tokens, Layout Rules, Expo Config)
├── PROMPT_TAB1_LEGAL_RADAR.md   # Prompt 1:1 cho Tab 1 (Cảnh báo Quy định GACC & Rủi ro Xuất khẩu)
├── PROMPT_TAB2_FIELD_SCAN.md    # Prompt 1:1 cho Tab 2 (Quét & Thẩm định Chứng thư Thực địa)
├── PROMPT_TAB3_BATCH_TRACKER.md # Prompt 1:1 cho Tab 3 (Quản lý Lô hàng Xuất khẩu & Chia sẻ Zalo)
├── tab1_legal_radar.jpg         # [Hình ảnh Giao diện Mẫu Tab 1]
├── tab2_field_scan.jpg          # [Hình ảnh Giao diện Mẫu Tab 2]
└── tab3_batch_tracker.jpg       # [Hình ảnh Giao diện Mẫu Tab 3]
```

---

## 🖼️ Danh mục Hình ảnh Thiết kế Mẫu (Image Assets)

| File Ảnh | Tên Màn hình | Mục đích Thiết kế |
| :--- | :--- | :--- |
| [`tab1_legal_radar.jpg`](file:///e:/Projects/Project_ca_nhan/Module2/docs/mobile-prompts/tab1_legal_radar.jpg) | **Tab 1: Legal Risk Radar** | Ra-da cảnh báo quy định GACC Trung Quốc & EU cho Giám đốc XNK |
| [`tab2_field_scan.jpg`](file:///e:/Projects/Project_ca_nhan/Module2/docs/mobile-prompts/tab2_field_scan.jpg) | **Tab 2: Field Compliance Scanner** | Camera quét phiếu test Cadmium & giấy kiểm dịch cho QA/QC |
| [`tab3_batch_tracker.jpg`](file:///e:/Projects/Project_ca_nhan/Module2/docs/mobile-prompts/tab3_batch_tracker.jpg) | **Tab 3: Export Batch Tracker** | Tra cứu mã PUC/PHC, điều kiện thông quan & Chia sẻ Báo cáo PDF Zalo |

---

## 💡 Hướng dẫn Sử dụng với AI Agent (Cursor / Claude / Copilot)

1. **Bước 1**: Đưa file `EXPO_MASTER_PROMPT.md` vào System Prompt hoặc làm context chính của dự án Expo.
2. **Bước 2**: Khi dựng từng màn hình cụ thể, sao chép nội dung Prompt tương ứng:
   - Dựng Tab 1: Đưa file `PROMPT_TAB1_LEGAL_RADAR.md` kèm đính kèm ảnh `tab1_legal_radar.jpg`.
   - Dựng Tab 2: Đưa file `PROMPT_TAB2_FIELD_SCAN.md` kèm đính kèm ảnh `tab2_field_scan.jpg`.
   - Dựng Tab 3: Đưa file `PROMPT_TAB3_BATCH_TRACKER.md` kèm đính kèm ảnh `tab3_batch_tracker.jpg`.
3. **Bước 3**: Yêu cầu AI sinh code chuẩn Expo Router trong thư mục `mobile/app/(tabs)/`.
