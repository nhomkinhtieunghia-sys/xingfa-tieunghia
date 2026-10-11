# Xingfa Tiếu Nghĩa – Thiết kế nhà panel 3D & đặt thi công trực tuyến

Website của **Công ty TNHH Cơ Khí Tiếu Nghĩa** (thương hiệu **Xingfa Tiếu Nghĩa**) – gia công, lắp đặt cửa sắt, cửa nhôm Xingfa, nhà lắp ráp panel, mái che, tủ bếp nhôm tại Tây Ninh.

Đồ án cuối khóa Vibe Coding – Trương Thị Mai.

- 🌐 Web: `https://nhomkinhtieunghia-sys.github.io/xingfa-tieunghia/`
- 💻 Mã nguồn: `https://github.com/nhomkinhtieunghia-sys/xingfa-tieunghia`

> Khi đưa lên tên miền khác (vd xingfatieunghia.com), đổi địa chỉ gốc `https://nhomkinhtieunghia-sys.github.io/xingfa-tieunghia/` trong `sitemap.xml`, `robots.txt`, `llms.txt`, `llms-full.txt`, JSON-LD đầu các trang và `assets/js/config.js`.

## ✨ Điểm khác biệt
- 🏠 **Thiết kế nhà panel 3D** – tự chỉnh kích thước, loại panel, mái, màu, cửa; xoay xem 3D; tự tính diện tích & số tấm panel
- 📷 **Thử nhà lên ảnh đất của bạn** – đặt ngôi nhà 3D lên ảnh khu đất, lưu ảnh ghép
- 📍 **Theo dõi tiến độ công trình** bằng mã + số điện thoại
- 💬 **Trợ lý tư vấn tự động** gợi ý sản phẩm phù hợp
- 🗺️ **Bản đồ công trình** đã thi công · ⭐ **Khách gửi đánh giá** (admin duyệt)
- 📊 **Bảng thống kê** cho admin · 🎬 Hiệu ứng chuyển động cao cấp
- 🌏 **3 ngôn ngữ**: Tiếng Việt · English · 中文 (giản thể) – dịch cả sản phẩm, công trình, trợ lý
- 📰 **Tin tức 3 ngôn ngữ** + nút **🌐 Dịch bằng AI** (Gemini) trong trang quản trị – viết tiếng Việt, AI dịch sẵn tiếng Anh, tiếng Trung
- 🤖 **Website 2 lớp – cho người và cho AI**: `llms.txt`, schema.org JSON-LD, `robots.txt`, `sitemap.xml`, trang "Dành cho AI"

## Công nghệ
HTML · CSS · JavaScript thuần · Supabase (database, đăng nhập, kho ảnh, Edge Function) · Gemini API (dịch) · Three.js (3D) · Leaflet (bản đồ) · Chart.js (biểu đồ) · marked + DOMPurify (bài viết) · Github Pages

## Các trang
| Trang | File |
|---|---|
| Trang chủ | `index.html` |
| Về chúng tôi (Google Maps) | `gioi-thieu.html` |
| Sản phẩm | `san-pham.html` |
| Chi tiết sản phẩm | `chi-tiet.html?id=…` |
| Thiết kế nhà panel 3D | `thiet-ke-nha.html` |
| Công trình & đánh giá | `cong-trinh.html` |
| Tin tức | `tin-tuc.html` |
| Chi tiết bài viết | `bai-viet.html?bai=…` |
| Giỏ báo giá | `bao-gia.html` |
| Đặt lịch & tiến độ | `dat-lich.html` |
| Quản trị | `admin.html` |
| Dành cho AI | `ai.html` |

## Chức năng thao tác database
- Gửi yêu cầu báo giá · gửi thiết kế 3D · gửi đánh giá (INSERT)
- Đặt lịch (INSERT), đổi lịch, hủy lịch (UPDATE)
- Admin: thêm / sửa / xóa sản phẩm, công trình, bài viết (tải ảnh lên kho ảnh); cập nhật tiến độ; duyệt / xóa đánh giá; đổi trạng thái / xóa yêu cầu (INSERT / UPDATE / DELETE)

## Cấu trúc thư mục
```
├── *.html              12 trang
├── llms.txt, llms-full.txt, robots.txt, sitemap.xml   lớp dành cho AI
├── assets/css/         style.css (chung), thiet-ke.css (trang 3D), admin.css
├── assets/js/          config.js (khóa Supabase + hàm chung), layout.js (menu, footer), hieu-ung.js,
│                       ngon-ngu.js (đổi ngôn ngữ), tro-ly.js + tro-ly-du-lieu.js (trợ lý), mỗi trang 1 file JS,
│                       nha-3d.js (mô hình 3D), thu-anh.js (thử ảnh), admin-thong-ke.js (biểu đồ),
│                       admin.js (đăng nhập, sản phẩm, báo giá, thiết kế), admin-tien-do.js, admin-cong-trinh.js (công trình + đánh giá),
│                       admin-bai-viet.js (soạn bài), admin-dich-ai.js (nút Dịch bằng AI)
├── assets/lang/        vi.js, en.js, zh.js – từ điển 3 ngôn ngữ
├── assets/images/      logo.jpg + 11 ảnh thật của công ty
├── database/           schema.sql (8 bảng + phân quyền + hàm), storage.sql (kho ảnh), seed.sql (dữ liệu mẫu)
├── supabase/functions/dich-ai/   index.ts – hàm dịch bằng Gemini (khóa API cất trong Supabase Secrets)
├── docs/               PRD, DESIGN, DATABASE, PROMPTS (.md) + hinh-chup/
└── BAO-CAO.md          báo cáo đồ án
```

## Các file Markdown
| File | Tác dụng |
|---|---|
| `README.md` | Giới thiệu dự án, link, cấu trúc, cách chạy |
| `docs/PRD.md` | Yêu cầu sản phẩm: mục tiêu, trang, chức năng, quy tắc kỹ thuật – AI đọc để biết cần làm gì |
| `docs/DESIGN.md` | Màu sắc, font, logo, hình ảnh, bố cục, hiệu ứng, mô hình 3D – AI đọc để giao diện đồng nhất |
| `docs/DATABASE.md` | Bảng, cột, phân quyền, hàm RPC, mẫu code truy vấn |
| `docs/PROMPTS.md` | Lịch sử prompt AI theo thứ tự kèm kết quả |
| `BAO-CAO.md` | Báo cáo đồ án nộp thầy |
| `HUONG-DAN.md` | Hướng dẫn tạo tài khoản, database, deploy, nộp bài |

## Chạy thử trên máy
1. Tạo dự án Supabase, chạy `database/schema.sql`, `database/storage.sql` rồi `database/seed.sql` trong SQL Editor.
   (Nút Dịch bằng AI: triển khai `supabase/functions/dich-ai` + thêm Secrets `GEMINI_API_KEY`, `GEMINI_MODEL` – xem HUONG-DAN.md Bước 3b.)
2. Điền Project URL và anon key (publishable key) vào `assets/js/config.js`.
   Tạo tài khoản admin: Supabase → Authentication → Users → Add user.
3. Mở `index.html` bằng Live Server (trang 3D cần chạy qua Live Server, không mở trực tiếp file).

---
© 2026 Công Ty TNHH Cơ Khí Tiếu Nghĩa · 12 Ấp An Thuận, An Ninh, Tây Ninh · 097-622-4875
