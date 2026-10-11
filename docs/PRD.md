# PRD – Website Xingfa Tiếu Nghĩa

> **PRD = Product Requirements Document (Tài liệu yêu cầu sản phẩm).**
> File này mô tả website cần làm những gì: mục tiêu, các trang, chức năng, dữ liệu. AI agent (Antigravity) đọc file này trước khi viết code để làm đúng và đủ yêu cầu.

---

## 1. Tổng quan dự án

| Mục | Nội dung |
|---|---|
| Tên dự án | Website Xingfa Tiếu Nghĩa – "Thiết kế nhà panel 3D & đặt thi công trực tuyến" |
| Thương hiệu | **Xingfa Tiếu Nghĩa** – Công ty TNHH Cơ Khí Tiếu Nghĩa (thương hiệu thật) |
| Lĩnh vực | Gia công, lắp đặt cửa sắt, cửa nhôm Xingfa, nhà lắp ráp panel, mái che, tủ bếp nhôm, bảo trì sửa chữa |
| Khu vực | Tây Ninh |
| Website gốc | https://xingfatieunghia.com |
| Mục đích | Đồ án cuối khóa Vibe Coding: website nhiều trang, có database, deploy lên Github Pages |
| Công nghệ | HTML + CSS + JavaScript thuần (không framework), Supabase (database + đăng nhập), Three.js (3D), Leaflet (bản đồ công trình), Chart.js (biểu đồ), Github Pages (nộp bài) → xingfatieunghia.com (chạy thật), Gemini API qua Supabase Edge Function (nút Dịch bằng AI), marked + DOMPurify (hiển thị bài viết Markdown) |
| Ngôn ngữ | **Tiếng Việt (mặc định) · English · 中文 (giản thể)** |

### Điểm khác biệt của dự án (so với landing page thông thường)
1. **Thiết kế nhà lắp ráp panel 3D** – khách tự chỉnh kích thước, loại panel, mái, màu, cửa và xoay xem mô hình 3D; web tự tính diện tích & vật tư.
2. **Thử nhà lên ảnh đất của khách** – tải ảnh khu đất, đặt ngôi nhà 3D vừa thiết kế lên ảnh, lưu ảnh về máy.
3. **Theo dõi tiến độ công trình** – khách nhập mã + SĐT để xem dòng thời gian Khảo sát → Báo giá → Gia công → Lắp đặt → Bàn giao.
4. **Trợ lý tư vấn tự động** – khung chat hỏi nhu cầu, gợi ý sản phẩm phù hợp.
5. **Bản đồ công trình đã thi công** – ghim các công trình trên bản đồ Tây Ninh.
6. **Khách gửi đánh giá** – admin duyệt mới hiển thị.
7. **Bảng thống kê cho admin** – biểu đồ yêu cầu, sản phẩm được quan tâm, lịch sắp tới.
8. **Hiệu ứng chuyển động cao cấp** – màn hình chờ logo, banner chuyển động, số đếm, hiện dần khi cuộn.
9. **3 ngôn ngữ Việt – Anh – Trung** – nút chọn ngôn ngữ đầu trang, dịch cả nội dung sản phẩm, công trình và trợ lý tư vấn; phục vụ khách nước ngoài và chủ xưởng Trung Quốc ở các khu công nghiệp.
10. **Website "2 lớp": cho người và cho AI** – ngoài giao diện cho người, web có lớp dữ liệu riêng để các AI (ChatGPT, Gemini, Claude, Perplexity…) đọc hiểu đúng công ty: `llms.txt`, dữ liệu có cấu trúc schema.org, `robots.txt`, `sitemap.xml`, trang "Dành cho AI" (tối ưu tìm kiếm bằng AI – GEO).
11. **Tin tức / bài viết 3 ngôn ngữ + nút "Dịch bằng AI"** – chủ doanh nghiệp viết bài tiếng Việt, bấm 1 nút là AI (Gemini) dịch sẵn tiếng Anh, tiếng Trung để duyệt rồi đăng; nút này dùng cho cả sản phẩm và công trình.

### Thông tin công ty (dùng đúng, không tự đổi)

- Tên: **Công ty TNHH Cơ Khí Tiếu Nghĩa** (TIẾU có dấu SẮC, không viết "Tiểu")
- Thương hiệu: **Xingfa Tiếu Nghĩa**
- Hotline/Zalo: **097-622-4875** (link gọi: `tel:0976224875`, Zalo: `https://zalo.me/0976224875`)
- Email: **nhomkinhtieunghia@gmail.com**
- Địa chỉ: **12 Ấp An Thuận, xã An Ninh, tỉnh Tây Ninh**
- Giờ làm việc: **Thứ 2 – Chủ nhật, 8:00 – 17:00**
- Facebook: https://www.facebook.com/cokhixingfatieunghia/
- Kinh nghiệm: hơn 10 năm trong nghề · 8 thành viên
- Sứ mệnh: mang đến sản phẩm cửa sắt, cửa nhôm và giải pháp nhà lắp ráp panel chất lượng, an toàn, bền vững; đội ngũ thợ lành nghề, quy trình sản xuất khép kín; đồng hành từ tư vấn – thiết kế – thi công – bảo hành.
- Giá sản phẩm: **không ghi giá**, luôn hiển thị **"Liên hệ"** (kể cả trang thiết kế 3D).
- **Không tự bịa số liệu** (số công trình, số khách hàng…). Chỉ dùng: 10+ năm, 8 thành viên, 6 nhóm dịch vụ, số sản phẩm/công trình đếm từ database.

---

## 2. Danh sách trang (12 trang)

Mọi trang đều có **menu chung** (header), **chân trang chung** (footer), **nút gọi/Zalo nổi** và **trợ lý tư vấn** – tất cả chèn tự động từ file JS dùng chung. Menu phải bấm chuyển được qua lại giữa tất cả các trang (thiếu là bị trừ 0,5 điểm).

Menu: **Trang chủ · Giới thiệu · Sản phẩm · Thiết kế 3D** (nhãn đỏ "Mới") **· Công trình · Tin tức · Đặt lịch & Tiến độ · Giỏ báo giá** (biểu tượng + số lượng).

Đầu header (thanh trên cùng) có **"Ngôn ngữ:" + nút xổ xuống 3 lựa chọn 🇻🇳 Tiếng Việt / 🇬🇧 English / 🇨🇳 中文**. Khách chọn ngôn ngữ nào thì toàn bộ trang đổi sang ngôn ngữ đó ngay (không tải lại trang) và web nhớ lựa chọn cho các trang sau.

Trang Quản trị và trang "Dành cho AI" chỉ có link nhỏ ở footer.

| # | File | Tên trang | Nội dung chính |
|---|---|---|---|
| 1 | `index.html` | Trang chủ | Banner chuyển động + 2 nút; 6 nhóm dịch vụ; **khối giới thiệu "Thiết kế nhà panel 3D"** (ảnh động/nút "Thử ngay"); Sản phẩm nổi bật (database); Vì sao chọn chúng tôi; Con số đếm tăng; Quy trình 5 bước; Đánh giá khách hàng (database, đã duyệt); Khối kêu gọi |
| 2 | `gioi-thieu.html` | Về chúng tôi | Giới thiệu, sứ mệnh, con số, 4 giá trị cốt lõi, **Google Maps nhúng** địa chỉ công ty, thông tin liên hệ |
| 3 | `san-pham.html` | Sản phẩm | Lưới sản phẩm (database); lọc theo 6 nhóm; tìm theo tên; đọc `?nhom=` |
| 4 | `chi-tiet.html` | Chi tiết sản phẩm | Đọc `?id=`; ảnh, mô tả, vật liệu, ưu điểm, bảo hành, "Liên hệ"; số lượng + **Thêm vào giỏ báo giá**; nút Đặt lịch; sản phẩm cùng nhóm. Nếu sản phẩm thuộc nhóm `nha-panel` → thêm nút **"Tự thiết kế 3D"** |
| 5 | `thiet-ke-nha.html` | **Thiết kế nhà panel 3D** | Tab 1 **Thiết kế 3D**: bảng tùy chọn + mô hình 3D xoay được + bảng diện tích/vật tư. Tab 2 **Thử lên ảnh đất nhà bạn**. Tab 3 **Gửi thiết kế để báo giá** (form → database, nhận mã TK-xxxxx) |
| 6 | `cong-trinh.html` | Công trình | **Bản đồ** ghim công trình (Leaflet), lọc theo hạng mục, danh sách thẻ công trình; khối **Đánh giá khách hàng** (xem + **form gửi đánh giá** chấm sao) |
| 6a | `tin-tuc.html` | Tin tức | Danh sách bài viết đã đăng (mới nhất trước), lọc chuyên mục (Kiến thức · Tin công ty · Công trình), tìm theo tiêu đề, bài nổi bật to ở đầu, phân trang 9 bài |
| 6b | `bai-viet.html?bai=<slug>` | Chi tiết bài viết | Ảnh đại diện, tiêu đề, ngày đăng, chuyên mục, lượt xem, nội dung Markdown, nút chia sẻ (Facebook, Zalo, sao chép link), "Bài viết liên quan" (cùng chuyên mục), khối kêu gọi liên hệ. Bài chưa có bản dịch → hiện tiếng Việt + dòng nhỏ "Bài này hiện chỉ có tiếng Việt" |
| 7 | `bao-gia.html` | Giỏ báo giá | Bảng giỏ: sửa số lượng, sửa kích thước, xóa; form gửi yêu cầu báo giá → database |
| 8 | `dat-lich.html` | Đặt lịch & Tiến độ | Tab 1 **Đặt lịch khảo sát** → mã TN-xxxx. Tab 2 **Tra cứu & theo dõi tiến độ** bằng mã + SĐT → dòng thời gian tiến độ, **đổi lịch**, **hủy lịch** |
| 9 | `admin.html` | Quản trị (chỉ tiếng Việt) | Đăng nhập. Tab: **Tổng quan** (thống kê + biểu đồ), Sản phẩm, **Bài viết**, Yêu cầu báo giá, Thiết kế nhà, Lịch & Tiến độ, Công trình, Đánh giá. Mỗi yêu cầu hiện cờ ngôn ngữ khách dùng; form sản phẩm/công trình/bài viết có 3 tab nhập VI / EN / 中文 + nút **🌐 Dịch bằng AI** |
| 10 | `ai.html` | Dành cho AI | Trang chữ tĩnh (không cần JavaScript) giới thiệu đầy đủ công ty, 6 nhóm dịch vụ, 15 sản phẩm (có link), quy trình, câu hỏi thường gặp, liên hệ – bằng tiếng Việt và tiếng Anh; giải thích website hỗ trợ AI; nút "Hỏi ChatGPT / Perplexity về Tiếu Nghĩa" mở sẵn câu hỏi mẫu; link xem `llms.txt` |

---

## 3. Danh sách chức năng

### 3.1. Đọc dữ liệu
- F01. Sản phẩm nổi bật ở Trang chủ (`noi_bat = true`).
- F02. Danh sách sản phẩm, lọc theo nhóm, tìm theo tên.
- F03. Chi tiết 1 sản phẩm + sản phẩm cùng nhóm.
- F04. Đánh giá đã duyệt ở Trang chủ và trang Công trình (điểm trung bình + số sao).
- F05. Bản đồ + danh sách công trình, lọc theo hạng mục.

### 3.2. Thêm / Sửa / Xóa dữ liệu – tiêu chí chấm điểm số 3
| Mã | Chức năng | Thao tác | Bảng |
|---|---|---|---|
| F06 | Giỏ báo giá: thêm, sửa số lượng/kích thước, xóa | thêm/sửa/xóa (localStorage) | – |
| F07 | Gửi yêu cầu báo giá | **INSERT** | `yeu_cau_bao_gia` |
| F08 | Gửi thiết kế nhà panel để báo giá | **INSERT** (RPC) | `thiet_ke_nha` |
| F09 | Đặt lịch khảo sát | **INSERT** (RPC) | `lich_khao_sat`, `tien_do` |
| F10 | Đổi ngày/buổi lịch | **UPDATE** (RPC) | `lich_khao_sat` |
| F11 | Hủy lịch | **UPDATE** (RPC) | `lich_khao_sat` |
| F12 | Khách gửi đánh giá | **INSERT** | `danh_gia` |
| F13 | Admin thêm / sửa / xóa sản phẩm | **INSERT / UPDATE / DELETE** | `san_pham` |
| F14 | Admin đổi trạng thái / xóa yêu cầu báo giá, thiết kế | **UPDATE / DELETE** | `yeu_cau_bao_gia`, `thiet_ke_nha` |
| F15 | Admin cập nhật tiến độ công trình (chọn bước + ghi chú) | **UPDATE + INSERT** | `lich_khao_sat`, `tien_do` |
| F16 | Admin thêm / sửa / xóa công trình (chọn vị trí bằng cách bấm lên bản đồ) | **INSERT / UPDATE / DELETE** | `cong_trinh` |
| F17 | Admin duyệt / ẩn / xóa đánh giá | **UPDATE / DELETE** | `danh_gia` |
| F17a | Admin viết / sửa / xóa bài viết, lưu nháp hoặc đăng, tải ảnh lên kho ảnh | **INSERT / UPDATE / DELETE** | `bai_viet`, Storage `anh-web` |
| F17b | Đếm lượt xem bài viết | **UPDATE** (RPC `tang_luot_xem`) | `bai_viet` |

### 3.3. Tính năng nổi bật
- **F18. Thiết kế nhà panel 3D** (chi tiết `docs/DESIGN.md` mục 8):
  - Tùy chọn: công năng (nhà ở / nhà trọ / kho – xưởng / văn phòng / homestay – chọn công năng sẽ tự điền thông số gợi ý), dài × rộng × cao, loại panel (EPS / PU / vân gỗ), độ dày (50 / 75 / 100 mm), kiểu mái (1 mái lệch / 2 mái), màu vách, màu mái, số cửa đi + loại cửa (nhôm Xingfa / cửa panel), số cửa sổ.
  - Mô hình 3D cập nhật ngay khi đổi tùy chọn; xoay, phóng to bằng chuột hoặc vuốt tay; nút góc nhìn Trước / Bên / Trên / Tự xoay.
  - Bảng kết quả: diện tích sàn, diện tích vách panel, diện tích mái, số tấm panel ước tính, số cửa, thể tích. **Giá: Liên hệ.**
  - Nút **Chụp ảnh thiết kế** (tải PNG), **Chia sẻ** (sao chép link chứa cấu hình `?tk=`), mở link là hiện lại đúng thiết kế.
- **F19. Thử lên ảnh đất nhà bạn**: tải ảnh từ máy (xử lý ngay trên trình duyệt, không gửi lên mạng) → ảnh chụp ngôi nhà 3D (nền trong suốt) đặt lên trên → kéo thả, phóng to/thu nhỏ, lật ngang → **Lưu ảnh ghép** về máy. Chạy được trên điện thoại.
- **F20. Theo dõi tiến độ**: dòng thời gian các bước, bước hiện tại nổi bật, ghi chú và ngày giờ từng bước.
- **F21. Trợ lý tư vấn**: khung chat nổi (góc trái dưới) ở mọi trang; nút trả lời nhanh + ô gõ câu hỏi (nhận diện từ khóa); gợi ý 2–3 sản phẩm từ database kèm nút xem chi tiết / thiết kế 3D / đặt lịch. Không dùng API AI trả phí.
- **F22. Thống kê admin**: thẻ số liệu, biểu đồ đường (yêu cầu theo 6 tháng), biểu đồ cột (top 5 sản phẩm được thêm vào báo giá), biểu đồ tròn (lịch theo trạng thái), danh sách lịch 7 ngày tới.
- **F23. Hiệu ứng cao cấp** (chi tiết `docs/DESIGN.md` mục 9).

### 3.4. Chức năng khác
- F24. Nhúng Google Maps (trang Giới thiệu) – tiêu chí chấm điểm số 4.
- F25. Nút gọi điện + Zalo nổi (góc phải dưới), mọi trang.
- F26. Responsive: đẹp trên điện thoại (từ 360px), máy tính bảng, máy tính.
- F27. Thông báo nhỏ (toast) khi thêm giỏ, gửi thành công, lỗi.
- F28. Kiểm tra form: họ tên bắt buộc, SĐT Việt Nam 10 số bắt đầu bằng 0, ngày hẹn không ở quá khứ, đánh giá phải chọn sao + nội dung ≥ 10 ký tự. Thông báo lỗi hiện theo ngôn ngữ đang chọn.

### 3.5. Đa ngôn ngữ (ý 2)
- **F29. Chọn ngôn ngữ**: thanh trên cùng header có chữ "Ngôn ngữ:" (đổi theo ngôn ngữ: Language: / 语言：) + nút xổ xuống có cờ: 🇻🇳 Tiếng Việt · 🇬🇧 English · 🇨🇳 中文. Chọn là đổi ngay toàn trang, nhớ trong localStorage, hỗ trợ link `?lang=en` / `?lang=zh` để gửi khách nước ngoài.
- Phạm vi dịch: **8 trang cho khách + trợ lý tư vấn + trang Dành cho AI (Việt/Anh)**. Trang Quản trị giữ tiếng Việt.
- Chữ cố định (menu, nút, tiêu đề, thông báo, nhãn form, tùy chọn 3D…) lấy từ 3 file từ điển `assets/lang/vi.js`, `en.js`, `zh.js`.
- Nội dung database (sản phẩm, công trình) có cột dịch `_en`, `_zh`; trống thì tự hiện tiếng Việt. Đánh giá của khách giữ nguyên ngôn ngữ khách viết.
- Khi khách gửi báo giá / thiết kế / đặt lịch / đánh giá, lưu thêm `ngon_ngu` để công ty biết gọi lại bằng tiếng gì.
- Ngày tháng, số hiển thị theo ngôn ngữ (vi-VN, en-US, zh-CN). Tiếng Trung dùng font **Noto Sans SC**.
- Thẻ `<html lang>` và tiêu đề tab đổi theo ngôn ngữ.

### 3.5b. Tin tức & nút "Dịch bằng AI"
- **F32. Tin tức 3 ngôn ngữ**: trang danh sách + chi tiết bài viết; trang chủ có khối "Bài viết mới nhất" (3 bài). Bài viết soạn bằng Markdown (tiêu đề ##, in đậm, danh sách, ảnh), hiển thị qua `marked` và lọc an toàn bằng `DOMPurify`.
- **F33. Soạn bài trong Quản trị**: ô soạn Markdown + xem trước trực tiếp, 3 tab VI / EN / 中文, chọn chuyên mục, ảnh đại diện (chọn ảnh có sẵn hoặc **tải ảnh lên** kho Supabase Storage `anh-web`), slug tự tạo từ tiêu đề (bỏ dấu), Lưu nháp / Đăng bài, nổi bật.
- **F34. Nút "🌐 Dịch bằng AI"** (form bài viết, sản phẩm, công trình):
  - Chị viết tiếng Việt → bấm nút → gọi Supabase Edge Function `dich-ai` → Gemini dịch → tự điền tab EN và 中文 → admin xem lại, sửa → bấm Lưu. Có tùy chọn "Chỉ dịch ô còn trống" để không ghi đè bản đã sửa tay.
  - Khóa Gemini **cất trong Supabase Secrets**, không nằm trong code web / Github. Hàm chỉ chạy khi admin đã đăng nhập (kiểm tra JWT).
  - Khách xem web **không gọi Gemini** (bản dịch đã lưu sẵn trong database) → số lượng khách không làm tăng chi phí. Dùng gói miễn phí Google AI Studio, không gắn thẻ thanh toán.
  - Đang dịch hiện vòng xoay "AI đang dịch…"; hết lượt miễn phí / lỗi mạng → thông báo tiếng Việt dễ hiểu, không mất chữ đã viết.
  - Không gửi thông tin khách hàng (tên, SĐT) vào hàm dịch.

### 3.6. Website 2 lớp – cho người và cho AI (ý 1)
- **F30. Lớp cho AI** (người xem bình thường không thấy, AI đọc được – **không phụ thuộc JavaScript** vì nhiều bot AI không chạy JS):
  - `llms.txt` (thư mục gốc): bản tóm tắt chuẩn dành cho AI – công ty là ai, làm gì, ở đâu, liên hệ, danh sách trang có link. Viết tiếng Anh + tiếng Việt.
  - `llms-full.txt`: bản đầy đủ – 6 nhóm dịch vụ, 15 sản phẩm (lấy đúng từ `database/seed.sql`), quy trình 5 bước, câu hỏi thường gặp, chính sách giá "Liên hệ".
  - **Dữ liệu có cấu trúc JSON-LD (schema.org)** viết **tĩnh** trong `<head>`: mọi trang có `HomeAndConstructionBusiness` (tên, logo, địa chỉ, hotline, giờ làm việc, khu vực phục vụ Tây Ninh, Facebook, ngôn ngữ vi/en/zh); trang chủ thêm `FAQPage`; trang chi tiết thêm `BreadcrumbList`.
  - `robots.txt`: cho phép mọi bot, ghi rõ cho phép GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended; chặn `admin.html`; chỉ đường tới `sitemap.xml`.
  - `sitemap.xml`: liệt kê các trang công khai + 15 link `chi-tiet.html?id=1..15` + link các bài viết mẫu `bai-viet.html?bai=<slug>`.
  - Giới hạn cần biết: bài viết mới đăng sau này hiển thị bằng JavaScript nên bot AI không chạy JS chưa đọc được ngay – khi đưa lên xingfatieunghia.com sẽ cập nhật `sitemap.xml`/`llms-full.txt` định kỳ (nhờ AI tạo lại từ database).
  - `san-pham.html` có khối `<noscript>` liệt kê tĩnh 15 sản phẩm + link chi tiết.
- **F31. Lớp cho người, để thấy được phần AI**:
  - Khối **"Câu hỏi thường gặp"** ở trang chủ (8 câu, dạng mở/đóng) – viết tĩnh trong HTML để AI đọc được, đồng thời dịch theo ngôn ngữ.
  - Trang **`ai.html` "Dành cho AI"** (link ở footer).
- Lưu ý trung thực: `llms.txt` là chuẩn mới, không đảm bảo AI nào cũng đọc; schema.org, robots.txt, sitemap.xml là chuẩn lâu năm. Không ghi trên web câu kiểu "chắc chắn được ChatGPT giới thiệu".

---

## 4. Dữ liệu
Chi tiết 8 bảng, cột, quyền truy cập, hàm RPC, Edge Function dịch: xem **`docs/DATABASE.md`**. Tạo bảng: `database/schema.sql`; kho ảnh: `database/storage.sql`; dữ liệu mẫu: `database/seed.sql` (15 sản phẩm, 10 công trình mẫu, 3 đánh giá thật từ website, **kèm bản dịch tiếng Anh + tiếng Trung giản thể** cho sản phẩm và công trình, 3 bài viết mẫu chỉ có tiếng Việt để thử nút Dịch bằng AI).

> Công trình trong `seed.sql` là **dữ liệu minh họa**. Trang Công trình phải hiện dòng chú thích nhỏ: *"Một số công trình đang được cập nhật hình ảnh thực tế"*. Chủ doanh nghiệp sửa lại bằng trang Quản trị.

---

## 5. Quy tắc kỹ thuật (AI phải tuân thủ)

1. **Tách file rõ ràng**: mỗi trang 1 file HTML + file JS riêng trong `assets/js/`. Tính năng lớn tách thêm file (vd 3D tách `nha-3d.js`, thử ảnh `thu-anh.js`). Không dồn code vào một file lớn.
2. Khóa Supabase (URL + anon key) **chỉ đặt 1 chỗ**: `assets/js/config.js`.
3. Đa ngôn ngữ trong `assets/js/ngon-ngu.js` + từ điển `assets/lang/vi.js`, `en.js`, `zh.js`. Menu, footer, top bar ngôn ngữ, nút nổi dùng chung trong `assets/js/layout.js`; trợ lý trong `assets/js/tro-ly.js` + dữ liệu câu trả lời trong `assets/js/tro-ly-du-lieu.js`; hiệu ứng chung trong `assets/js/hieu-ung.js`.
4. Màu sắc, font khai báo bằng biến CSS trong `assets/css/style.css` theo `docs/DESIGN.md`. CSS riêng cho trang 3D và admin được phép tách `assets/css/thiet-ke.css`, `assets/css/admin.css`.
5. Dùng đường dẫn **tương đối** (`assets/...`, `chi-tiet.html?id=3`) để chạy được trên Github Pages.
6. Thư viện nạp qua CDN, ghi đúng phiên bản:
   - Supabase: `https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2`
   - Three.js 0.160.0 (dạng module, importmap): `https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js` và `.../three@0.160.0/examples/jsm/` (OrbitControls)
   - Leaflet 1.9.4: `https://unpkg.com/leaflet@1.9.4/dist/leaflet.css` + `leaflet.js`
   - Chart.js 4.4.1: `https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js`
   - marked 12.0.2: `https://cdn.jsdelivr.net/npm/marked@12.0.2/marked.min.js` · DOMPurify 3.1.6: `https://cdn.jsdelivr.net/npm/dompurify@3.1.6/dist/purify.min.js`
7. Logo dùng **đúng 1 file** `assets/images/logo.jpg` ở mọi nơi (header, footer, favicon, màn hình chờ, trợ lý).
8. **Đa ngôn ngữ**: KHÔNG viết cứng chữ hiển thị trong JS; mọi chữ lấy qua hàm `t('khoa')` hoặc thuộc tính `data-i18n="khoa"`. HTML tĩnh viết sẵn **tiếng Việt có dấu** (để AI/Google đọc được khi không chạy JS). Mỗi khi thêm chữ mới phải thêm khóa vào `assets/lang/vi.js` (bản dịch en/zh làm ở prompt dịch).
9. Có xử lý lỗi: không tải được dữ liệu thì hiện thông báo thân thiện, không để trang trắng. Trình duyệt không hỗ trợ 3D (WebGL) thì hiện thông báo + vẫn dùng được bảng tính diện tích.
10. Comment code bằng tiếng Việt ở đầu mỗi file và mỗi hàm chính.
11. Không dùng `alert()` / `confirm()` của trình duyệt – dùng hộp thoại (modal) trong trang.
12. Tôn trọng `prefers-reduced-motion`: người dùng tắt hiệu ứng thì không chạy chuyển động.
13. Đường dẫn tương đối để chạy được ở cả 2 nơi: `https://nhomkinhtieunghia-sys.github.io/xingfa-tieunghia/` (nộp bài) và thư mục con trên `xingfatieunghia.com` (chạy thật). Địa chỉ web chính đặt **1 chỗ** trong `assets/js/config.js` (`DIA_CHI_WEB`) và ghi chú rõ trong `llms.txt`, `sitemap.xml`, `robots.txt` để dễ đổi khi chuyển nơi.

---

## 6. Tiêu chí hoàn thành (đối chiếu đề của thầy – bản 10/10/2026, tổng 10 điểm)

| Tiêu chí của thầy | Điểm | Đáp ứng bằng |
|---|---|---|
| 1. Ít nhất 3 trang: Home, About, Detail | 3 (mỗi trang 1) | `index.html`, `gioi-thieu.html`, `chi-tiet.html` (+9 trang khác) |
| 2. Có database (CSV, SQLite, Supabase) | 3 | Supabase: 8 bảng `san_pham`, `bai_viet`, `yeu_cau_bao_gia`, `thiet_ke_nha`, `lich_khao_sat`, `tien_do`, `cong_trinh`, `danh_gia` + kho ảnh Storage + Edge Function |
| 3. Ít nhất 2 chức năng insert/update/delete | 2 | F07–F17b |
| 4. Nhúng Google Maps / YouTube | 0,5 | Google Maps ở `gioi-thieu.html` (+ bản đồ công trình) |
| 5. Dùng file .md | 0,5 | `README.md`, `docs/PRD.md`, `docs/DESIGN.md`, `docs/DATABASE.md`, `docs/PROMPTS.md`, `BAO-CAO.md`, `HUONG-DAN.md` |
| 6. Github Public, gửi link | 0,5 | Repo `xingfa-tieunghia` chế độ Public |
| 7. Deploy (Github Pages) | 0,5 | `https://nhomkinhtieunghia-sys.github.io/xingfa-tieunghia/` |

**Báo cáo** (`BAO-CAO.md`): mô tả dự án + logo · các trang · chức năng · các file .md · thứ tự prompt + kết quả.

**Tránh bị trừ điểm (mỗi lỗi -0,5):**
- Các trang phải liên kết với nhau → menu chung `layout.js`, bấm thử hết các link.
- Thương hiệu thật phải có hình ảnh thật + logo thật → ảnh và logo tải từ xingfatieunghia.com, nằm sẵn trong `assets/images/`, logo dùng thống nhất 1 file `logo.jpg`.
