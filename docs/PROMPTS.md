# PROMPTS – Bộ câu lệnh AI theo thứ tự

> **File này dùng để làm gì?** Ghi lại **thứ tự các prompt** đã dùng trong Antigravity để xây website, kèm **kết quả** của từng prompt. Đây là nguồn cho mục "Lịch sử Prompt AI" trong báo cáo nộp thầy.
>
> **Cách dùng:** dán lần lượt từng prompt vào Antigravity. Xong prompt nào, mở web kiểm tra rồi **ghi kết quả vào ô "Kết quả"** (làm được gì, lỗi gì, sửa thế nào) và chụp màn hình lưu vào `docs/hinh-chup/` (đặt tên theo số prompt, vd `p08-thiet-ke-3d.png`).
> AI làm sai thì gõ thêm prompt sửa lỗi, ghi vào "Prompt phụ" của bước đó (thầy chấm cả quá trình, ghi thật là tốt nhất).
>
> **Tổng: 21 prompt** – Nhóm A (1–7) phần bắt buộc của thầy · Nhóm B (8–17) tính năng khác biệt · Nhóm C (18–19) 3 ngôn ngữ + lớp cho AI · Nhóm D (20–21) kiểm tra & deploy.
>
> ⚠️ **Quy tắc xuyên suốt (AI tự nhớ từ prompt 1):** mọi chữ hiển thị đều qua `t('khoa')` / `data-i18n`, thêm khóa vào `assets/lang/vi.js`; mọi INSERT/RPC gửi kèm `ngon_ngu`. Bản dịch en/zh làm một lần ở prompt 18.

---

## NHÓM A – PHẦN NỀN TẢNG

## Prompt 1 – Đọc tài liệu & dựng khung dự án

```
Bạn là lập trình viên web. Hãy đọc kỹ 3 file docs/PRD.md, docs/DESIGN.md, docs/DATABASE.md trong dự án này.

Sau đó dựng khung dự án (chưa cần làm chi tiết từng trang):
- 12 file HTML ở thư mục gốc: index.html, gioi-thieu.html, san-pham.html, chi-tiet.html, thiet-ke-nha.html, cong-trinh.html, tin-tuc.html, bai-viet.html, bao-gia.html, dat-lich.html, admin.html, ai.html
- assets/css/style.css: biến màu, font theo DESIGN.md mục 2–3; kiểu chung cho nút, thẻ, toast, modal, header, footer, nút nổi
- assets/js/config.js: khởi tạo Supabase client (để trống SUPABASE_URL, SUPABASE_ANON_KEY), hàm dùng chung: tên nhóm, tên bước tiến độ, định dạng số/ngày kiểu Việt Nam, toast, modal xác nhận, kiểm tra SĐT, quản lý giỏ báo giá trong localStorage
- assets/js/layout.js: tự chèn top bar + header (menu 8 mục theo PRD mục 2, "Thiết kế 3D" có nhãn Mới), footer, nút gọi/Zalo nổi, nút lên đầu trang vào mọi trang; tô sáng trang đang mở; menu ☰ điện thoại; số lượng giỏ
- assets/js/hieu-ung.js: để sẵn khung (sẽ làm ở prompt 2)
- ĐA NGÔN NGỮ theo DESIGN.md mục 11: assets/js/ngon-ngu.js (t, apDungNgonNgu, tuDB, layNgonNgu, dinhDangSo, dinhDangNgay, sự kiện doi-ngon-ngu)
  + assets/lang/vi.js (đủ khóa), en.js, zh.js (tạm dịch phần menu/footer/top bar).
  Top bar trên header có chữ "Ngôn ngữ:" + nút xổ xuống 🇻🇳 Tiếng Việt / 🇬🇧 English / 🇨🇳 中文, chọn là đổi ngay, nhớ lựa chọn, đọc ?lang=.
  Từ giờ mọi chữ hiển thị phải qua t() hoặc data-i18n, HTML tĩnh viết sẵn tiếng Việt.
- Mỗi trang 1 file JS riêng trong assets/js/ (trang-chu.js, gioi-thieu.js, san-pham.js, chi-tiet.js, thiet-ke-nha.js, cong-trinh.js, tin-tuc.js, bai-viet.js, bao-gia.js, dat-lich.js, admin.js)
- ai.html để trống (làm ở prompt 19); tin-tuc.html, bai-viet.html để trống (làm ở prompt 16)

Ảnh và logo thật ĐÃ CÓ SẴN trong assets/images/ (DESIGN.md mục 5) – không tải thêm, không đổi tên.
Dùng đường dẫn tương đối để chạy được trên Github Pages. Comment tiếng Việt ở đầu mỗi file.
Làm xong hãy liệt kê cấu trúc thư mục và cho biết file nào làm nhiệm vụ gì.
```

**Kết quả:** Tạo 31 file: 12 trang HTML, `style.css`, `config.js`, `layout.js`, `ngon-ngu.js`, 3 file ngôn ngữ (`vi.js`, `en.js`, `zh.js`), 11 file JS từng trang. Có top bar, menu, footer, nút chọn ngôn ngữ, nút gọi/Zalo dùng chung cho mọi trang.

**Prompt phụ:**
- **1a** – Sửa menu ☰ điện thoại không bấm được, footer thiếu link, nút chọn ngôn ngữ đang là ô `<select>` → đổi thành nút xổ xuống, thêm favicon → **đạt**.
- **1b** – Giao diện còn xấu (menu gãy 2 dòng, nút gọi quá to, cờ hiện chữ "VN" vì Windows không hiển thị emoji cờ) → yêu cầu header 1 dòng, cờ vẽ bằng SVG, icon SVG thay emoji, footer 4 cột → **đẹp hơn rõ**.
- **1c** – Cột "Liên hệ" footer bị vỡ (chữ bị bóp từng chữ), tên thương hiệu gãy dòng, giỏ hàng dính nút Gọi → **đạt**.
- **1d** – Lỗi ngôn ngữ: chọn English rồi sang trang khác thì menu/footer lại về tiếng Việt. Nguyên nhân: `ngon-ngu.js` dịch trang TRƯỚC khi `layout.js` chèn menu/footer. Sửa: gọi `apDungNgonNgu()` sau khi `layout.js` chèn xong → **đạt** (chuyển 4 trang vẫn giữ tiếng Anh, `?lang=zh` hiện tiếng Trung).

📷 Ảnh: `docs/hinh-chup/p01-khung.png`

---

## Prompt 2 – Trang chủ + hiệu ứng cao cấp

```
Làm hoàn chỉnh index.html + assets/js/trang-chu.js theo DESIGN.md mục 7 "Trang chủ" (có "Câu hỏi thường gặp" viết tĩnh trong HTML; khối "Bài viết mới nhất" tạm hiện "Đang tải..."),
và làm assets/js/hieu-ung.js theo DESIGN.md mục 9: màn hình chờ logo (chỉ lần đầu trong phiên), banner Ken Burns + chữ gõ tự động,
hiện dần khi cuộn (data-hieu-ung), số đếm tăng (data-dem), header thu nhỏ khi cuộn, đường nối quy trình chạy dần, tắt hết khi prefers-reduced-motion.
- Thẻ dịch vụ bấm sang san-pham.html?nhom=<mã nhóm>. Nút "Thiết kế nhà 3D" sang thiet-ke-nha.html.
- Khối "Sản phẩm nổi bật" và "Đánh giá" tạm hiện "Đang tải..." – sẽ nối database ở prompt 4.
- Chữ dùng đúng thông tin công ty trong PRD.md mục 1, không bịa số liệu, không ghi giá.
```

**Kết quả:** Trang chủ đủ các khối: banner ảnh lớn (Ken Burns + chữ gõ tự động), 6 dịch vụ bằng ảnh thật, khối "Tự thiết kế nhà panel 3D", sản phẩm nổi bật, vì sao chọn chúng tôi, số liệu đếm tăng, quy trình 5 bước, đánh giá, bài viết mới, 8 câu hỏi thường gặp, khối kêu gọi. Các khối lấy từ database tạm hiện "Đang tải..." (nối ở prompt 4).

**Prompt phụ:**
- **2a** – Nội dung dính sát mép màn hình; AI tự ghi số "50+ mẫu sản phẩm" (số bịa, database chỉ có 15); nút bị gạch chân; mục "Vì sao chọn" dùng emoji, thiếu mô tả; 6 thẻ dịch vụ xếp 4 cột bị lẻ → yêu cầu thêm `.container` 1200px, sửa số thành 15, icon SVG + mô tả lấy đúng website thật, lưới 3 cột, khối kêu gọi nền navy → **đạt**.

📷 Ảnh: `docs/hinh-chup/p02-trang-chu.png`

---

## Prompt 3 – Trang Giới thiệu + Google Maps

```
Làm hoàn chỉnh gioi-thieu.html theo DESIGN.md mục 7 "Giới thiệu":
- Giới thiệu, sứ mệnh Công ty TNHH Cơ Khí Tiếu Nghĩa (đúng nội dung PRD.md mục 1), ảnh ve-chung-toi.jpg
- 3 con số đếm tăng: 10+ năm kinh nghiệm, 8 thành viên, 6 nhóm dịch vụ
- 4 giá trị cốt lõi: Chất lượng – Uy tín – Đúng hẹn – Tận tâm
- Nhúng Google Maps địa chỉ "12 Ấp An Thuận, An Ninh, Tây Ninh" bằng iframe (không cần API key):
  https://www.google.com/maps?q=12+%E1%BA%A4p+An+Thu%E1%BA%ADn,+An+Ninh,+T%C3%A2y+Ninh&output=embed
  rộng 100%, cao 400px, bo góc, loading="lazy"; bên cạnh là khung thông tin liên hệ + nút "Chỉ đường".
```

**Kết quả:** Trang Giới thiệu có: banner tiêu đề, giới thiệu + sứ mệnh công ty kèm ảnh xưởng, 3 con số đếm tăng (10+ năm, 8 thành viên, 6 nhóm dịch vụ), 4 giá trị cốt lõi có icon, mục "Bản đồ & Liên hệ" với iframe Google Maps + khung liên hệ + nút Chỉ đường.

**Prompt phụ:**
- **3a** – Không thấy Google Maps: bản đồ có trong code nhưng bị hiệu ứng "hiện dần khi cuộn" giữ ở trạng thái trong suốt nên khung trắng trơn. Thêm 2 lỗi: trang có thanh cuộn ngang (menu điện thoại giấu bên phải làm trang rộng ra), chữ "Giới thiệu" trên banner tối không đọc được → yêu cầu bỏ hiệu ứng khỏi bản đồ, đổi link nhúng bản đồ, thêm dự phòng tự hiện sau 2 giây cho mọi phần tử có hiệu ứng, chặn cuộn ngang, banner tiêu đề chữ trắng + breadcrumb dùng chung cho các trang con → **đạt**: Google Maps hiện đúng khu vực An Ninh Đông (Tây Ninh), hết thanh cuộn ngang, banner chữ trắng có breadcrumb "Trang chủ › Giới thiệu".

```
Sửa trang Giới thiệu:
1. Google Maps không hiện: bỏ data-hieu-ung khỏi .map-wrapper và .contact-info-card – bản đồ phải luôn hiện ngay, không phụ thuộc hiệu ứng cuộn. Thêm title="Bản đồ Xingfa Tiếu Nghĩa" cho iframe. Đổi src iframe thành:
   https://maps.google.com/maps?q=12%20%E1%BA%A4p%20An%20Thu%E1%BA%ADn%2C%20An%20Ninh%2C%20T%C3%A2y%20Ninh&t=&z=15&ie=UTF8&iwloc=&output=embed
2. hieu-ung.js: thêm dự phòng – sau 2 giây phần tử nào có data-hieu-ung mà vẫn chưa hiện thì tự thêm class da-hien, để không bao giờ có nội dung bị ẩn vĩnh viễn.
3. Trang bị thanh cuộn ngang trên máy tính do .mobile-menu nằm ngoài màn hình (right: -300px): thêm overflow-x: hidden cho html, body và ẩn hẳn .mobile-menu (visibility: hidden) khi chưa mở.
4. Tiêu đề "Giới thiệu" trên banner đầu trang đang chữ tối trên nền tối, không đọc được: đổi chữ trắng, thêm dòng breadcrumb "Trang chủ › Giới thiệu" màu trắng mờ. Áp dụng kiểu banner tiêu đề này cho mọi trang con sau này (đưa vào style.css class .page-banner).
```

📷 Ảnh: `docs/hinh-chup/p03-gioi-thieu.png`

---

## Prompt 4 – Kết nối Supabase + trang Sản phẩm

```
Tôi đã tạo database Supabase bằng database/schema.sql và database/seed.sql.
URL: https://mzopvxoyakqybboaugul.supabase.co
Anon key (publishable): sb_publishable_qI6kSOCZJPK4UI2lZ4e06g_PCgoc6TI
(Đây là khóa publishable – loại mới thay cho anon, dùng được với supabase-js@2, được phép để trên web.)

1. Điền 2 giá trị trên vào assets/js/config.js.
2. Làm san-pham.html + san-pham.js: đọc bảng san_pham theo thu_tu, lưới thẻ theo DESIGN.md, chip lọc "Tất cả" + 6 nhóm,
   ô tìm kiếm theo tên, đọc ?nhom= trên URL để lọc sẵn. Mỗi thẻ có nút "Xem chi tiết" sang chi-tiet.html?id=<id>.
3. Trang chủ: nối "Sản phẩm nổi bật" (6 sản phẩm noi_bat = true), "Đánh giá" (điểm trung bình + 3 đánh giá mới nhất từ bảng danh_gia),
   con số "N mẫu sản phẩm" đếm từ database.
   Tên, mô tả sản phẩm hiển thị bằng tuDB() theo ngôn ngữ; đổi ngôn ngữ thì vẽ lại.
4. Khi đang tải hiện khung chờ (skeleton); lỗi mạng hiện thông báo thân thiện, không để trang trắng.
```

**Kết quả (lần đầu):** Đã điền khóa Supabase vào `config.js`, làm trang Sản phẩm (chip lọc 6 nhóm, ô tìm kiếm), nối trang chủ với database. Nhưng trang Sản phẩm báo "Không thể tải danh sách sản phẩm" – Console: `Cannot read properties of undefined` tại `tuDB`. Nguyên nhân: AI tự đặt sai tên cột (`ten_vi`, `mo_ta_vi`, `ma_nhom`, `loi_nhan_vi`, `ten_khach_hang`, `ngay_tao`…) thay vì đọc `docs/DATABASE.md`, và gọi `tuDB()` sai cách.

**Prompt phụ:**
- **4a** – Sửa tên cột cho khớp database thật → **đạt**: trang Sản phẩm hiện đủ 15 mẫu có ảnh; chip "Cửa nhôm Xingfa" còn 3; tìm "panel" ra 4 (gồm cả "Sửa chữa cổng sắt, nhà panel" – đúng); `?nhom=mai-che` ra 2; chọn English tên đổi sang tiếng Anh (vd "Polycarbonate Canopy"); trang chủ hiện 6 sản phẩm nổi bật + 3 đánh giá 5 sao thật (Chú 9, Hồ Văn Luân, Chị 7).

```
Trang Sản phẩm báo "Không thể tải danh sách sản phẩm", Console: TypeError tại tuDB (ngon-ngu.js:35).
Nguyên nhân: san-pham.js và trang-chu.js dùng SAI tên cột. Hãy đọc lại docs/DATABASE.md và sửa đúng tên cột thật:
- Bảng san_pham: ten, mo_ta_ngan, mo_ta_chi_tiet, nhom (KHÔNG có ten_vi, mo_ta_vi, ma_nhom); hinh_anh là CHUỖI 1 đường dẫn (không phải mảng) → dùng trực tiếp sp.hinh_anh.
- Bảng danh_gia: ho_ten, so_sao, noi_dung, dich_vu, created_at (KHÔNG có ten_khach_hang, loi_nhan_vi, ngay_tao).
- Hàm tuDB(dong, tenCot) nhận 2 tham số: dòng dữ liệu và tên cột gốc. Ví dụ: tuDB(sp, 'ten'), tuDB(sp, 'mo_ta_ngan'). KHÔNG truyền 3 giá trị.
  Đánh giá của khách KHÔNG dịch, hiện nguyên dg.noi_dung.
- Lọc theo nhóm dùng sp.nhom; tên nhóm hiển thị bằng TieuNghia.tenNhom(sp.nhom) và phải dịch theo ngôn ngữ (dùng t()).
Sửa xong kiểm tra: san-pham.html hiện đủ 15 sản phẩm có ảnh; bấm chip "Cửa nhôm Xingfa" còn 3; gõ "panel" ra 3; san-pham.html?nhom=mai-che ra 2;
trang chủ hiện 6 sản phẩm nổi bật + 3 đánh giá 5 sao; chọn English thì tên sản phẩm đổi sang tiếng Anh.
```

- **4b** – 6 sản phẩm dùng ảnh trùng nhau (3 mẫu cửa sắt chung 1 ảnh, mái che, bảo trì…) → nhờ AI tạo 6 ảnh mới (thầy cho phép ảnh AI; không lấy ảnh trên mạng để tránh bản quyền) + file SQL cập nhật database → **đạt**: AI tạo 6 ảnh (1200×896, ~170–270KB), chạy `database/cap-nhat-anh.sql` trên Supabase → trang Sản phẩm hiện 15 ảnh khác nhau. Lưu ý: lần đầu vẫn thấy ảnh trùng vì quên chạy file SQL – web lấy đường dẫn ảnh từ database chứ không từ thư mục.

```
6 sản phẩm đang dùng ảnh trùng nhau. Hãy dùng công cụ tạo ảnh AI của bạn tạo 6 ảnh MỚI, phong cách ảnh chụp thực tế,
ánh sáng ban ngày tự nhiên, bối cảnh nhà ở/công trình miền Nam Việt Nam, giống tông ảnh có sẵn trong assets/images/,
KHÔNG có chữ, logo hay watermark trong ảnh, tỉ lệ 4:3, lưu .jpg (nén ≤ 250KB, rộng 1400px) vào assets/images/ đúng tên sau:
1. sp-cua-sat-rao.jpg – cửa sắt 2 cánh và hàng rào sắt sơn đen trước nhà phố
2. sp-lan-can-cau-thang.jpg – lan can ban công và cầu thang sắt kết hợp tay vịn gỗ trong nhà
3. sp-vach-kinh-cuong-luc.jpg – mặt tiền cửa hàng vách kính cường lực khung nhôm xám
4. sp-nha-panel-pu.jpg – nhà xưởng lắp ráp panel PU màu trắng xám, khung thép, mái tôn
5. sp-mai-hien-di-dong.jpg – mái hiên bạt kéo di động trước quán cà phê
6. sp-sua-cong-sat.jpg – thợ đang hàn sửa cổng sắt, tia lửa hàn
Sau đó tạo file database/cap-nhat-anh.sql gồm 6 lệnh UPDATE san_pham SET hinh_anh='assets/images/<tên file>' WHERE thu_tu=<số>
(thu_tu: 2 cửa sắt – cửa rào, 3 lan can, 6 vách kính, 8 nhà panel PU, 13 mái hiên di động, 15 sửa chữa cổng sắt).
Cập nhật bảng hình ảnh trong docs/DESIGN.md mục 5 (ghi rõ 6 ảnh này là ảnh tạo bằng AI).
```
Sau khi chạy: mở Supabase → SQL Editor → dán nội dung `database/cap-nhat-anh.sql` → Run.

- **4c** – Thêm ảnh đại diện cho khối đánh giá: dùng ảnh người châu Á tạo bằng AI, ghi rõ nhãn "Ảnh minh họa" để không gây hiểu nhầm là ảnh thật của khách → **đạt**: 3 ảnh tròn (18–25KB), dưới mỗi ảnh có nhãn "Ảnh minh họa", cạnh tên có tick xanh "Đã sử dụng dịch vụ"; chạy `database/cap-nhat-avatar.sql` (thêm cột `anh_minh_hoa`). Đánh giá khách tự gửi sau này không có ảnh sẽ hiện ô chữ cái đầu tên. *Lý do chọn ảnh minh họa có nhãn: 3 đánh giá là khách thật, nếu dùng ảnh AI mà không ghi chú sẽ khiến người xem hiểu nhầm là ảnh thật của khách.*

```
Khối đánh giá khách hàng: thêm ảnh đại diện MINH HỌA tạo bằng AI.
1. Tạo 3 ảnh chân dung người Việt Nam, phong cách ảnh chụp tự nhiên, nền ngoài trời mờ, ánh sáng ban ngày, mặc trang phục thường ngày,
   vuông 1:1, 400×400px, .jpg ≤ 60KB, KHÔNG chữ/logo, lưu vào assets/images/:
   - avatar-minh-hoa-1.jpg – người đàn ông khoảng 60 tuổi, hiền hậu (cho đánh giá "Chú 9")
   - avatar-minh-hoa-2.jpg – người đàn ông khoảng 40 tuổi, chủ xưởng (cho "Hồ Văn Luân")
   - avatar-minh-hoa-3.jpg – người phụ nữ khoảng 40 tuổi (cho "Chị 7")
2. Database: tạo file database/cap-nhat-avatar.sql:
   alter table danh_gia add column if not exists anh_minh_hoa text;
   + 3 lệnh UPDATE danh_gia SET anh_minh_hoa='assets/images/avatar-minh-hoa-N.jpg' WHERE ho_ten='...';
   Cập nhật docs/DATABASE.md mục bảng danh_gia (cột anh_minh_hoa: ảnh minh họa, không phải ảnh thật của khách).
3. Giao diện thẻ đánh giá (trang chủ, sau này cả trang Công trình): ảnh tròn 64px viền trắng + bóng; ngay dưới ảnh có dòng chữ nhỏ 11px màu xám
   "Ảnh minh họa" (khóa i18n, dịch được); alt ảnh cũng ghi "Ảnh minh họa". Đánh giá nào KHÔNG có anh_minh_hoa (khách tự gửi sau này)
   thì hiện ô tròn chữ cái đầu tên nền gradient navy → đỏ, không ghi nhãn.
4. Thêm dấu tick xanh nhỏ + chữ "Đã sử dụng dịch vụ" cạnh tên khách.
```
Sau khi chạy: Supabase → SQL Editor → dán `database/cap-nhat-avatar.sql` → Run.

📷 Ảnh: `docs/hinh-chup/p04-san-pham.png`

---

## Prompt 5 – Trang Chi tiết sản phẩm

```
Đọc docs/DATABASE.md, dùng ĐÚNG tên bảng và tên cột trong đó (bảng san_pham: ten, nhom, mo_ta_ngan, mo_ta_chi_tiet, vat_lieu, uu_diem, bao_hanh, gia, hinh_anh + các cột _en/_zh), không tự đặt tên. Hiển thị chữ từ database bằng tuDB(sp, 'ten').
Làm chi-tiet.html + chi-tiet.js theo DESIGN.md mục 7 "Chi tiết":
- Đọc ?id=, lấy 1 dòng san_pham. Không có/không tìm thấy thì hiện "Không tìm thấy sản phẩm" + nút quay lại.
- Breadcrumb, ảnh lớn (bấm phóng to), tên, nhãn nhóm, mô tả chi tiết, vật liệu, ưu điểm (tách theo ;) có dấu ✓, bảo hành, "Liên hệ".
- Ô số lượng (+/-) và nút "Thêm vào giỏ báo giá" → localStorage, toast, cập nhật số trên biểu tượng giỏ.
- Nút "Đặt lịch khảo sát" sang dat-lich.html?dich_vu=<nhóm>. Nếu nhóm là nha-panel thêm nút "Tự thiết kế 3D" sang thiet-ke-nha.html.
- Khối "Sản phẩm cùng nhóm" tối đa 3 sản phẩm. Đổi tiêu đề tab thành tên sản phẩm.
```

**Kết quả:** Trang Chi tiết chạy đúng: đọc `?id=`, banner + breadcrumb "Trang chủ › Sản phẩm › tên", ảnh lớn, nhãn nhóm, "Liên hệ", mô tả chi tiết, vật liệu, bảo hành, danh sách ưu điểm; ô số lượng +/- và nút thêm giỏ lưu vào localStorage, số trên biểu tượng giỏ cập nhật; nút Đặt lịch sang `dat-lich.html?dich_vu=nha-panel`; sản phẩm nhóm nhà panel có nút Tự thiết kế 3D; khối sản phẩm cùng nhóm (id 7, 9); tiêu đề tab đổi theo tên sản phẩm; `?id=999` báo "Không tìm thấy sản phẩm". Lỗi: 8 nhãn hiện mã khóa thô thay vì chữ (`sanPham.vatLieu`, `sanPham.baoHanh`, `sanPham.uuDiem`, `sanPham.soLuong`, `sanPham.themVaoGio`, `sanPham.datLichKhaoSat`, `sanPham.tuThietKe3D`, `sanPham.sanPhamCungNhom`, `sanPham.quayLai`) do chưa thêm khóa vào `vi.js`; chưa có toast khi thêm giỏ.

**Prompt phụ:**
- **5a** – Thêm khóa ngôn ngữ còn thiếu + toast → **đạt**: 9 khóa đã có ở cả `vi.js`, `en.js`, `zh.js`; rà 147 khóa đang dùng trên các trang – không còn khóa thiếu; nhãn hiện đúng chữ (Vật liệu, Bảo hành, Ưu điểm có dấu ✓ xanh, Số lượng); bấm thêm giỏ hiện toast "Đã thêm vào giỏ báo giá" + link Giỏ báo giá; ảnh lớn bấm phóng to, Esc để đóng.

```
Trang chi-tiet.html đang hiện mã khóa thô thay vì chữ: sanPham.vatLieu, sanPham.baoHanh, sanPham.uuDiem, sanPham.soLuong,
sanPham.themVaoGio, sanPham.datLichKhaoSat, sanPham.tuThietKe3D, sanPham.sanPhamCungNhom, sanPham.quayLai.
1. Thêm đủ các khóa này vào assets/lang/vi.js (Vật liệu, Bảo hành, Ưu điểm, Số lượng, Thêm vào giỏ báo giá, Đặt lịch khảo sát,
   Tự thiết kế 3D, Sản phẩm cùng nhóm, Quay lại danh sách sản phẩm); thêm luôn bản tiếng Anh vào en.js và tiếng Trung giản thể vào zh.js.
2. Rà toàn bộ các file JS đã làm (trang-chu.js, gioi-thieu.js, san-pham.js, chi-tiet.js, layout.js): mọi khóa t('...') / data-i18n đang dùng
   đều phải có trong vi.js. Liệt kê các khóa đã bổ sung.
3. Bấm "Thêm vào giỏ báo giá" phải hiện toast "Đã thêm vào giỏ báo giá" (góc phải trên, tự tắt sau 3 giây) kèm link "Xem giỏ".
4. Danh sách ưu điểm: mỗi dòng có dấu ✓ màu xanh lá phía trước.
5. Ảnh lớn bấm vào thì phóng to (lightbox nền tối, bấm ra ngoài hoặc Esc để đóng).
```

📷 Ảnh: `docs/hinh-chup/p05-chi-tiet.png`

---

## Prompt 6 – Giỏ báo giá + gửi yêu cầu (INSERT)

```
Làm bao-gia.html + bao-gia.js theo DESIGN.md mục 7 "Giỏ báo giá":
- Bảng giỏ từ localStorage: ảnh nhỏ, tên (link chi tiết), số lượng +/- (SỬA), ô "Kích thước / ghi chú" (SỬA), nút xóa (XÓA), "Xóa hết".
- Giỏ trống: hình minh họa + nút "Xem sản phẩm".
- Form: họ tên*, SĐT* (10 số, bắt đầu 0), email, địa chỉ công trình, ghi chú.
- "Gửi yêu cầu báo giá": INSERT vào yeu_cau_bao_gia (danh_sach là mảng JSON), thành công thì xóa giỏ,
  hiện "Cảm ơn anh/chị, Xingfa Tiếu Nghĩa sẽ gọi lại trong thời gian sớm nhất" + hotline. Khóa nút khi đang gửi.
```

**Kết quả:** Trang Giỏ báo giá chạy đúng: bảng giỏ có ảnh nhỏ, tên, số lượng +/- (SỬA), ô kích thước/ghi chú (SỬA), nút thùng rác (XÓA), "Xóa toàn bộ"; số trên biểu tượng giỏ cập nhật; giỏ trống hiện "Giỏ báo giá của bạn đang trống" + nút Xem sản phẩm. Form kiểm tra dữ liệu: nhập SĐT "12345" báo "Vui lòng nhập đầy đủ họ tên và số điện thoại hợp lệ (10 số)". Gửi hợp lệ → **INSERT thành công** vào bảng `yeu_cau_bao_gia` (kèm `danh_sach` JSON và `ngon_ngu`), xóa giỏ, hiện "Cảm ơn anh/chị, Xingfa Tiếu Nghĩa sẽ gọi lại trong thời gian sớm nhất! Hotline hỗ trợ: 097-622-4875". (Đã gửi 1 đơn thử tên "TEST Claude kiem tra" – xóa trong trang Quản trị sau.)

**Sự cố phát sinh:** khi làm prompt này, Antigravity dùng PowerShell ghi lại 3 file `assets/lang/vi.js`, `en.js`, `zh.js` nên **hỏng mã hóa chữ** (vd nút hiện "ThÃªm vÃ o giá» bÃ¡o giÃ¡", tiếng Trung thành ký tự rác). Claude đã khôi phục bằng cách đổi ngược mã hóa (208 dòng, không mất chữ nào), lưu bản hỏng ở `_to_delete/lang-hong-ma-hoa/`. Bài học: yêu cầu AI **luôn ghi file bằng UTF-8 (không BOM)**, không dùng lệnh PowerShell `Set-Content`/`Out-File` mặc định để sửa file có tiếng Việt/Trung.

**Prompt phụ:**
- **6a** – Sửa lỗi nhỏ ô kích thước + dặn AI giữ mã hóa UTF-8 → **đạt phần lớn**: 3 file ngôn ngữ giữ đúng UTF-8 (không BOM, không ký tự lỗi); có khóa `baoGia.camOnTen` ở cả 3 ngôn ngữ, tên khách chèn bằng `textContent`; xóa sản phẩm hỏi xác nhận bằng hộp thoại trong trang; ô kích thước rộng 178px, có placeholder. Còn 2 lỗi: nút "Đồng ý" trong hộp thoại bị **tàng hình** (dùng biến màu `--mau-thong-bao` không tồn tại → nền trong suốt, chữ trắng); sản phẩm không có `kich_thuoc` vẫn hiện chữ "undefined".
- **6b** – Sửa nút Đồng ý tàng hình + chữ undefined → **đạt**: nút "Đồng ý" màu đỏ hiện rõ trong hộp thoại xóa; ô kích thước sản phẩm chưa có kích thước để trống + placeholder "VD: 1m2 x 2m4" (không còn chữ undefined).

```
Sửa 2 lỗi nhỏ ở bao-gia:
1. Nút "Đồng ý" trong hộp thoại xác nhận xóa đang tàng hình vì dùng biến màu --mau-thong-bao KHÔNG tồn tại.
   Tìm mọi chỗ dùng var(--mau-thong-bao) trong toàn dự án, thay bằng var(--mau-nhan) (đỏ). Chuyển style của nút vào style.css (class .btn-nguy-hiem).
2. bao-gia.js dòng tạo ô kích thước: value="${sp.kich_thuoc}" → dùng (sp.kich_thuoc || '') và escape ký tự đặc biệt (", <, >) trước khi đưa vào thuộc tính value,
   để sản phẩm cũ không có kich_thuoc không hiện chữ "undefined".
Giữ UTF-8 không BOM, không dùng PowerShell để ghi file.
```

```
Sửa trang bao-gia.html:
1. Ô "Kích thước / ghi chú": sản phẩm chưa có kich_thuoc thì để TRỐNG và hiện placeholder "VD: 1m2 x 2m4" (đang hiện chữ "undefined" và "Tiêu chuẩn").
   Cột này rộng hơn (tối thiểu 160px), ô nhập chiếm hết chiều rộng cột. Trên điện thoại bảng giỏ chuyển thành dạng thẻ dọc dễ bấm.
2. Bấm xóa 1 sản phẩm hoặc "Xóa toàn bộ" phải hỏi xác nhận bằng hộp thoại trong trang (modal), không dùng confirm() của trình duyệt.
3. Câu cảm ơn sau khi gửi đang viết cứng tiếng Việt trong JS – chuyển sang khóa t('baoGia.camOnTen') có tham số tên, thêm vào vi.js/en.js/zh.js.
   Tên khách chèn vào trang phải dùng textContent (không chèn thẳng vào innerHTML) để tránh lỗi bảo mật.
QUY TẮC MÃ HÓA (áp dụng từ giờ cho mọi lần sửa file): luôn đọc/ghi file bằng UTF-8 không BOM, xuống dòng LF.
KHÔNG dùng PowerShell Set-Content / Out-File / Add-Content để sửa file có tiếng Việt hoặc tiếng Trung – hãy dùng công cụ sửa file của bạn.
Sửa xong mở lại vi.js, zh.js kiểm tra tiếng Việt và tiếng Trung vẫn hiển thị đúng.
```

📷 Ảnh: `docs/hinh-chup/p06-gio-bao-gia.png`

---

## Prompt 7 – Đặt lịch & theo dõi tiến độ (INSERT / UPDATE)

```
Làm dat-lich.html + dat-lich.js theo DESIGN.md mục 7 "Đặt lịch & Tiến độ", dùng các hàm RPC trong DATABASE.md mục 9:
Tab 1 "Đặt lịch khảo sát": họ tên*, SĐT*, địa chỉ công trình*, dịch vụ (6 nhóm, đọc sẵn ?dich_vu=), ngày hẹn* (không chọn ngày quá khứ),
  buổi (Sáng 8h–11h / Chiều 13h–17h), ghi chú → db.rpc("dat_lich_khao_sat") → hộp lớn hiện MÃ LỊCH + nút sao chép,
  nhắc khách lưu mã để theo dõi tiến độ.
Tab 2 "Tra cứu & tiến độ": nhập mã + SĐT (đọc sẵn ?ma= nếu có) → db.rpc("tra_cuu_lich") → thẻ thông tin lịch +
  DÒNG THỜI GIAN 7 bước (DATABASE.md mục 5) đúng kiểu DESIGN.md: bước đã qua xanh lá + ngày giờ + ghi chú, bước hiện tại đỏ nhấp nháy,
  bước chưa tới màu xám; đã hủy hiện dải đỏ.
  Nút "Đổi lịch" (db.rpc("doi_lich")) và "Hủy lịch" (hộp xác nhận trong trang → db.rpc("huy_lich")) chỉ hiện khi còn
  Chờ xác nhận / Đã xác nhận. Làm xong tự tải lại tiến độ.
Báo lỗi tiếng Việt dễ hiểu khi sai mã/SĐT.
```

> 🤖 **Từ Prompt 7 trở đi:** theo yêu cầu của chị Mai, **Claude (AI agent)** tự viết code theo đúng nội dung prompt bên dưới (thay vì dán vào Antigravity), rồi tự mở web bằng Chrome để kiểm tra, chụp màn hình và ghi kết quả. Prompt vẫn giữ nguyên để thấy rõ yêu cầu từng bước.

**Kết quả:** Trang Đặt lịch & Tiến độ có 2 tab. Kiểm tra thật trên Live Server + Supabase:
- **Đặt lịch (INSERT):** link `dat-lich.html?dich_vu=nha-panel` tự chọn sẵn "Nhà lắp ráp panel"; ô ngày không cho chọn quá khứ; SĐT sai báo lỗi. Gửi lịch thử "TEST Claude kiem tra" → nhận mã **TN-3287**, hộp thành công có dấu tick, nút Sao chép mã / Xem tiến độ / Đặt lịch khác.
- **Tra cứu:** đúng mã + SĐT → thẻ thông tin (khách, dịch vụ, ngày + buổi, địa chỉ) và **dòng thời gian 7 bước**: bước hiện tại đỏ nhấp nháy + nhãn "Hiện tại", bước chưa tới màu xám, có ngày giờ + ghi chú. Sai SĐT → "Không tìm thấy lịch..." (khách không xem được lịch người khác).
- **Đổi lịch (UPDATE):** hộp thoại chọn ngày/buổi mới → lưu → dòng thời gian thêm "Khách đổi lịch sang 15/10/2026 (buổi chiều)", ngày hẹn đổi theo.
- **Hủy lịch (UPDATE):** hộp xác nhận trong trang → trạng thái "Đã hủy", dải đỏ "Lịch này đã bị hủy", nút Đổi/Hủy tự ẩn.
- Đổi sang 中文/English: nhãn, tên bước, tên dịch vụ, ngày tháng đổi theo ngôn ngữ.

**Prompt phụ:**
- **7a** – Nút chọn buổi Sáng/Chiều bị vỡ chữ thành nhiều dòng (ô radio bị kéo rộng 100%) → sửa CSS `.dl-buoi input { width: auto }` → **đạt**.

📷 Ảnh: `docs/hinh-chup/p07-dat-lich.png`, `p07b-tien-do.png`, `p07c-ma-lich.png`

---

## NHÓM B – TÍNH NĂNG KHÁC BIỆT

## Prompt 8 – Thiết kế nhà panel 3D (phần 1: mô hình + tùy chọn + tính toán)

```
Đọc kỹ DESIGN.md mục 8. Làm thiet-ke-nha.html (tab 1 "Thiết kế 3D") gồm:
- assets/js/nha-3d.js: module Three.js 0.160.0 (importmap từ jsdelivr) + OrbitControls, dựng mô hình nhà panel đúng mô tả
  (nền cỏ, sàn, vách có đường ron mỗi 1m, đầu hồi, mái tôn sóng 1 mái/2 mái, cửa đi, cửa sổ, ánh sáng có bóng đổ).
  Xuất các hàm khoiTao, capNhat, datGocNhin, batTuXoay, chupAnh. Renderer alpha + preserveDrawingBuffer.
- assets/js/thiet-ke-nha.js: object TUY_CHON ở đầu file; bảng tùy chọn (công năng tự điền gợi ý, kích thước thanh trượt + ô số,
  loại panel, độ dày, kiểu mái, ô màu vách/mái, số cửa đi + loại cửa, số cửa sổ); đổi tùy chọn là mô hình cập nhật ngay;
  bảng kết quả 6 ô theo đúng công thức DESIGN.md (số kiểu Việt Nam, hiệu ứng đếm), ô cuối "Giá: Liên hệ".
- Thanh nút dưới khung 3D: Trước · Bên · Trên · Tự xoay.
- assets/css/thiet-ke.css cho riêng trang này. Điện thoại: khung 3D trên, tùy chọn dưới.
- Máy không hỗ trợ WebGL: hiện thông báo, bảng tính diện tích vẫn dùng được.
```

**Kết quả:** (Claude làm) Tạo `assets/js/nha-3d.js` (Three.js 0.160.0 + OrbitControls), `assets/js/thiet-ke-nha.js`, `assets/css/thiet-ke.css`. Kiểm tra trên Chrome:
- Mô hình đúng mô tả: nền cỏ, sàn bê tông, vách có **đường ron mỗi 1 m**, đầu hồi, mái tôn sóng có diềm + úp nóc (2 mái) hoặc 1 mái lệch, cửa nhôm Xingfa kính xanh / cửa panel, cửa sổ có bậu, bóng đổ mềm.
- Bảng tùy chọn thu gọn được: 5 công năng tự điền gợi ý (Nhà ở, Nhà trọ, Kho – xưởng, Văn phòng, Homestay), thanh trượt + ô số kích thước, EPS/PU/Vân gỗ + 50/75/100 mm, 1 mái/2 mái, ô màu tròn, nút +/− số cửa. Đổi tùy chọn → mô hình dựng lại ngay, không tải lại trang.
- Bảng kết quả đúng công thức DESIGN.md, số kiểu Việt Nam có hiệu ứng đếm. Kiểm tra tay: Nhà ở 8×5×3,2 → sàn 40 m², vách 76,8 m², mái 49,9 m², 25 tấm, 128 m³; Kho 20×10×5 m 1 mái → vách 310,8 m², mái 221,7 m², 63 tấm, 1.000 m³ (khớp tính tay).
- Nút Trước · Bên · Trên · Tự xoay hoạt động; kéo chuột xoay, cuộn phóng to. Máy không có WebGL → hiện thông báo, bảng tính vẫn chạy.

**Prompt phụ:** không cần.

📷 Ảnh: `docs/hinh-chup/p08-thiet-ke-3d.png`, `p08b-kho-xuong-1-mai.png`

---

## Prompt 9 – Thiết kế 3D (phần 2: chụp ảnh, chia sẻ, gửi báo giá – INSERT)

```
Tiếp tục thiet-ke-nha.html:
- Nút "Chụp ảnh" tải file PNG thiết kế. Nút "Chia sẻ" sao chép link thiet-ke-nha.html?tk=<cấu hình mã hóa base64 an toàn tiếng Việt>;
  mở trang có ?tk= thì nạp đúng thiết kế.
- Tab 3 "Gửi thiết kế để báo giá": tóm tắt cấu hình + ảnh chụp nhỏ + bảng kết quả | form họ tên*, SĐT*, địa chỉ, ghi chú
  → db.rpc("gui_thiet_ke_nha", { ..., p_cau_hinh, p_ket_qua }) → hộp thành công hiện mã TK-xxxxx + hotline. Khóa nút khi đang gửi.
- Trang chủ: khối "Tự thiết kế nhà panel 3D" bấm "Thử ngay" sang trang này.
```

**Kết quả:** (Claude làm) Nút **Chụp ảnh** tải file PNG có nền trời. Nút **Chia sẻ** sao chép link `thiet-ke-nha.html?tk=...` (base64 an toàn URL); mở link trong tab mới nạp đúng thiết kế Kho – xưởng 20×10×5 m, 1 mái, xanh dương (đã thử). Tab **Gửi thiết kế để báo giá**: tóm tắt cấu hình + ảnh 3D nhỏ + bảng kết quả, form họ tên/SĐT/địa chỉ/ghi chú → gọi `gui_thiet_ke_nha` → **INSERT thành công**, nhận mã **TK-49062** (đơn thử "TEST Claude kiem tra" – xóa trong Quản trị sau). Nút bị khóa khi đang gửi. Trang chủ khối "Tự thiết kế nhà panel 3D" nút "Thử ngay" đã trỏ sang trang này.

**Prompt phụ:**
- **9a** – Sau khi gửi, khung form vẫn hiện cùng hộp thành công (thuộc tính `hidden` bị `display: grid` đè) → thêm CSS `.tk-section [hidden] { display: none !important; }` → **đạt**.
- **9b** – Chụp ảnh ngay sau khi đổi tùy chọn có lúc ra mô hình cũ (khung hình chưa kịp vẽ lại) → hàm chụp tự cập nhật mô hình trước khi chụp → **đạt**.

📷 Ảnh: `docs/hinh-chup/p09-gui-thiet-ke.png`

---

## Prompt 10 – Thử nhà lên ảnh đất của khách

```
Làm tab 2 "Thử lên ảnh đất nhà bạn" của thiet-ke-nha.html trong file riêng assets/js/thu-anh.js theo DESIGN.md mục 8:
- Vùng kéo thả / nút "Chọn ảnh" (jpg, png), đọc ảnh bằng FileReader (không tải lên mạng).
- Lấy ảnh ngôi nhà từ nha-3d.js chupAnh({nenTrongSuot:true}) đặt lên giữa ảnh; kéo thả bằng chuột và ngón tay (pointer events),
  thanh trượt Kích thước, nút Lật ngang, nút "Chụp lại góc nhìn".
- Nút "Lưu ảnh ghép": vẽ 2 lớp lên canvas đúng vị trí/tỉ lệ, tải file thiet-ke-tieu-nghia.jpg.
- Ghi chú nhỏ "Ảnh chỉ xử lý trên máy của bạn". Chạy tốt trên điện thoại.
```

**Kết quả:** (Claude làm) File `assets/js/thu-anh.js`. Chọn ảnh/kéo thả ảnh JPG, PNG (đọc bằng FileReader, không tải lên mạng) → ngôi nhà 3D hiện tại được chụp **nền trong suốt, giữ bóng đổ**, tự cắt viền trống rồi đặt giữa ảnh. Kéo nhà bằng chuột (đã thử kéo sang bãi cỏ), thanh trượt Kích thước, Lật ngang, **Chụp lại góc nhìn** (quay về tab 3D, xoay xong bấm nút đỏ "Dùng góc nhìn này" để quay lại), Đổi ảnh khác. **Lưu ảnh ghép** vẽ 2 lớp lên canvas đúng vị trí/tỉ lệ, kèm dòng chữ nhỏ "Xingfa Tiếu Nghĩa · 097-622-4875", tải file `thiet-ke-tieu-nghia.jpg`. Đổi thiết kế rồi quay lại tab ảnh → tự chụp lại nhà mới.

📷 Ảnh: `docs/hinh-chup/p10-thu-anh-dat.png`

---

## Prompt 11 – Trang Công trình: bản đồ + đánh giá (INSERT)

```
Làm cong-trinh.html + cong-trinh.js theo DESIGN.md mục 7 "Công trình":
- Bản đồ Leaflet 1.9.4 (nền OpenStreetMap, không cần API key), ghim từ bảng cong_trinh (vi_do, kinh_do), icon ghim màu theo hạng mục,
  tự canh khung vừa tất cả ghim; popup có ảnh, tên, hạng mục, địa điểm, năm.
- Chip lọc hạng mục; danh sách thẻ công trình bên cạnh, bấm thẻ thì bản đồ bay tới ghim và mở popup.
- Dòng chú thích nhỏ: "Một số công trình đang được cập nhật hình ảnh thực tế".
- Khối #danh-gia: điểm trung bình + thanh phân bố sao, danh sách đánh giá đã duyệt, form gửi đánh giá (họ tên*, chọn 1–5 sao*,
  nội dung* ≥ 10 ký tự, dịch vụ không bắt buộc) → INSERT bảng danh_gia → "Cảm ơn! Đánh giá sẽ hiển thị sau khi được duyệt."
```

**Kết quả:** (Claude làm) `cong-trinh.html` + `cong-trinh.js`: bản đồ Leaflet 1.9.4 nền OpenStreetMap, 10 ghim màu theo hạng mục, tự canh khung vừa tất cả ghim; popup có ảnh, tên, hạng mục, địa điểm, năm; chip lọc hạng mục có số đếm; danh sách thẻ bên phải – bấm thẻ bản đồ bay tới ghim và mở popup; dòng chú thích "Một số công trình đang được cập nhật hình ảnh thực tế". Khối `#danh-gia`: điểm trung bình lớn + thanh phân bố 5→1 sao, danh sách đánh giá đã duyệt (ảnh minh họa có nhãn), form họ tên / chọn sao / nội dung ≥ 10 ký tự / dịch vụ → **INSERT** `danh_gia` (luôn chờ duyệt) → "Cảm ơn! Đánh giá sẽ hiển thị sau khi được duyệt."

Kiểm tra thật trên Live Server + Supabase (11/10, 8h sáng): 10 ghim, 10 thẻ, 3 đánh giá đã duyệt, điểm TB 5,0; bấm thẻ "Cổng sắt mỹ thuật nhà vườn" → popup mở đúng ảnh, hạng mục, địa điểm, năm; gửi đánh giá thử "TEST Claude kiem tra" 5 sao → **INSERT thành công**, hiện lời cảm ơn, đánh giá chưa hiện trên web (đúng – chờ duyệt).

📷 Ảnh: `docs/hinh-chup/p11-cong-trinh.png`

**Prompt phụ:**
- **11a** – Nội dung đánh giá do khách gõ được đưa thẳng vào HTML ở trang chủ → có thể bị chèn mã. Sửa: mã hóa ký tự đặc biệt trước khi hiển thị, trang chủ chỉ lấy đánh giá `da_duyet = true` → **đạt** (thử với đánh giá chứa `<img onerror>` → hiện nguyên văn, không chạy mã).
- **11c** – Khi tab trình duyệt bị ẩn, hiệu ứng bay của bản đồ bị tạm dừng nên popup không mở → thêm dự phòng mở popup sau 1 giây → **đạt**.
- **11b** – `layout.js` phát sự kiện đổi ngôn ngữ mỗi lần đổi cỡ cửa sổ → trên điện thoại cuộn trang làm bản đồ nhảy về vị trí cũ. Sửa: chỉ phát khi qua mốc 1200px → **đạt**.

---

## Prompt 12 – Trợ lý tư vấn tự động

```
Làm trợ lý tư vấn theo PRD F21 và DESIGN.md mục 6, gồm 2 file:
- assets/js/tro-ly-du-lieu.js: kịch bản hội thoại dạng object dễ sửa: lời chào; các nhánh "Tôi cần làm cửa", "Tôi cần nhà panel",
  "Mái che / tủ bếp", "Sửa chữa – bảo trì", "Hỏi thông tin"; mỗi nhánh 1–2 câu hỏi có nút trả lời nhanh;
  danh sách từ khóa → câu trả lời cho câu gõ tự do (giá, bảo hành, khu vực, thời gian thi công, địa chỉ, giờ làm việc, Xingfa nhập khẩu
  hay Việt Nam, EPS hay PU...). Câu hỏi về giá luôn trả lời: báo giá miễn phí sau khảo sát + hotline. Không bịa số năm bảo hành.
- Kịch bản viết đủ 3 ngôn ngữ (vi, en, zh), từ khóa nhận diện cả tiếng Anh, tiếng Trung; trợ lý nói theo ngôn ngữ đang chọn,
  đổi ngôn ngữ thì lời chào đổi theo.
- assets/js/tro-ly.js: nút chat nổi góc trái dưới mọi trang (gắn qua layout.js), khung chat có hiệu ứng "đang gõ...",
  kết thúc mỗi nhánh gợi ý 2–3 sản phẩm từ bảng san_pham theo nhóm (thẻ mini + nút Xem chi tiết) và nút "Thiết kế 3D" / "Đặt lịch" / "Gọi ngay".
  Không hiểu câu hỏi thì gợi ý gọi hotline/Zalo. Lưu lịch sử chat trong sessionStorage.
```

**Kết quả:** (Claude làm) `tro-ly-du-lieu.js` (kịch bản 3 ngôn ngữ: lời chào, 5 nhánh, 27 lượt trả lời, 22 nhóm từ khóa Việt/Anh/Trung) + `tro-ly.js` (nút chat nổi góc trái dưới, tự nạp qua `layout.js` ở mọi trang khách, trừ admin). Có hiệu ứng "đang gõ…", nút trả lời nhanh, cuối nhánh gợi ý 3 sản phẩm từ bảng `san_pham` (thẻ ảnh + "Xem chi tiết") và nút Thiết kế 3D / Đặt lịch / Gọi ngay. Câu hỏi giá luôn trả lời "báo giá miễn phí sau khảo sát + hotline"; bảo hành không ghi số năm. Kiểm tra 19 câu gõ tự do: "giá cửa nhôm bao nhiêu" → báo giá, "gia công cửa nhôm" → cửa nhôm (không nhầm với "giá"), "đặt lịch khảo sát" → đặt lịch (không nhầm "sát" với cửa sắt), "门多少钱" → báo giá, "保修多久" → bảo hành, câu lạ → gợi ý gọi hotline/Zalo. Đổi sang 中文 → toàn bộ hội thoại đổi tiếng Trung; chuyển trang vẫn giữ lịch sử chat (sessionStorage).

Kiểm tra thật trên Live Server: mở trợ lý ở trang chủ → "Tôi cần nhà panel" → "Nhà ở / homestay" → gợi ý đúng 3 sản phẩm thật từ database (Nhà lắp ráp panel EPS, PU, vân gỗ dân dụng) + nút Thiết kế 3D, Đặt lịch, Gọi.

📷 Ảnh: `docs/hinh-chup/p12-tro-ly.png`

**Prompt phụ:**
- **12a** – "tủ bếp nhôm" bị hiểu là cửa nhôm → đưa từ khóa tủ bếp, mái che lên trước từ khóa nhôm → **đạt**.

---

## Prompt 13 – Quản trị (phần 1): đăng nhập, sản phẩm, báo giá, thiết kế

```
Làm admin.html + admin.js (+ assets/css/admin.css) theo DESIGN.md mục 7 "Quản trị":
- Chưa đăng nhập: hộp đăng nhập email + mật khẩu (db.auth.signInWithPassword), có Đăng xuất.
- Thanh bên 8 mục có số đếm: Tổng quan, Sản phẩm, Bài viết (làm ở prompt 17), Yêu cầu báo giá, Thiết kế nhà, Lịch & Tiến độ, Công trình, Đánh giá.
- Tab Sản phẩm: bảng + "Thêm" (INSERT), "Sửa" (UPDATE), "Xóa" (DELETE, hộp xác nhận). Form modal: tên, nhóm, mô tả ngắn, mô tả chi tiết,
  vật liệu, ưu điểm, giá (mặc định Liên hệ), ảnh (chọn từ danh sách file trong assets/images), nổi bật, thứ tự;
  các ô chữ có 3 tab nhập 🇻🇳 VI / 🇬🇧 EN / 🇨🇳 中文 (cột gốc, _en, _zh). Trang admin giữ tiếng Việt.
- Mọi danh sách yêu cầu hiện cờ ngôn ngữ khách dùng (cột ngon_ngu).
- Tab Yêu cầu báo giá: mới nhất lên đầu, xem các sản phẩm khách chọn, đổi trạng thái (UPDATE), xóa (DELETE).
- Tab Thiết kế nhà: bảng mã TK, khách, kích thước, loại panel, diện tích; nút "Xem 3D" mở thiet-ke-nha.html?tk=<cấu hình> tab mới;
  đổi trạng thái, xóa. (Tạm để trống các tab còn lại – làm ở prompt 14, 15.)
```

**Kết quả:** (Claude làm) `admin.html`, `admin.js`, `assets/css/admin.css`: hộp đăng nhập email + mật khẩu (Supabase Auth), Đăng xuất; thanh bên 8 mục có số đếm (mục mới / chờ xử lý tô đỏ). Tab **Sản phẩm**: bảng + tìm tên, Thêm (**INSERT**), Sửa (**UPDATE**), Xóa (**DELETE**, hộp xác nhận trong trang); form có 3 tab 🇻🇳 VI / 🇬🇧 EN / 🇨🇳 中文 (chấm xanh khi đã có bản dịch), chọn ảnh có sẵn hoặc tải ảnh lên kho `anh-web` (tự nén ≤1600px). Tab **Yêu cầu báo giá**: thẻ mới nhất trước, cờ ngôn ngữ khách, danh sách sản phẩm khách chọn, đổi trạng thái (**UPDATE**), xóa (**DELETE**). Tab **Thiết kế nhà**: mã TK, khách, kích thước, panel, diện tích, nút "Xem 3D" mở đúng thiết kế, đổi trạng thái, xóa.

> Claude không dùng mật khẩu của chị Mai: phần quản trị được kiểm tra trước bằng trình duyệt tự động với dữ liệu mẫu giả lập (0 lỗi), sau đó **chị Mai tự đăng nhập** (11/10) và Claude xem lại với dữ liệu thật: 8 mục hiện đúng số đếm, form sửa sản phẩm có sẵn bản dịch EN/中文, dòng thời gian tiến độ TN-3287, soạn bài có xem trước.

**Prompt phụ:**
- **13a** – Số đếm tổng (Sản phẩm 15, Bài viết 3, Công trình 10) cũng tô đỏ như việc cần xử lý → đổi thành màu xám, chỉ mục chờ xử lý mới tô đỏ → **đạt**.


📷 Ảnh: `docs/hinh-chup/p13-admin-san-pham.png`
---

## Prompt 14 – Quản trị (phần 2): tiến độ, công trình, đánh giá

```
Tiếp tục admin.js:
- Tab Lịch & Tiến độ: danh sách theo ngày hẹn, lọc theo bước; nút "Cập nhật tiến độ" mở modal chọn bước tiếp theo + ghi chú
  → UPDATE lich_khao_sat.trang_thai + INSERT tien_do; xem lịch sử tiến độ dạng dòng thời gian; xóa lịch (DELETE).
- Tab Công trình: bảng + Thêm/Sửa/Xóa (ô chữ có 3 tab VI/EN/中文); trong form có bản đồ Leaflet nhỏ, bấm lên bản đồ để chọn vị trí (tự điền vi_do, kinh_do).
- Tab Đánh giá: lọc Chờ duyệt / Đã duyệt; nút Duyệt / Ẩn (UPDATE da_duyet), Xóa (DELETE).
```

**Kết quả:** (Claude làm, tách file `admin-tien-do.js`, `admin-cong-trinh.js`) Tab **Lịch & Tiến độ**: bảng theo ngày hẹn, lọc theo bước, lịch quá hạn tô hồng; "Cập nhật tiến độ" mở hộp có dòng thời gian bên trái + chọn bước tiếp theo (tự chọn sẵn bước kế) và ghi chú cho khách → **UPDATE** `lich_khao_sat.trang_thai` + **INSERT** `tien_do`; xóa lịch (**DELETE**). Tab **Công trình**: Thêm/Sửa/Xóa, 3 tab ngôn ngữ, bản đồ Leaflet nhỏ – bấm hoặc kéo ghim để tự điền vĩ độ, kinh độ. Tab **Đánh giá**: lọc Chờ duyệt / Đã duyệt, nút "Duyệt hiện lên web" / "Ẩn khỏi web" (**UPDATE** `da_duyet`), Xóa (**DELETE**).


📷 Ảnh: `docs/hinh-chup/p14-admin-tien-do.png`
---

## Prompt 15 – Quản trị (phần 3): Tổng quan & biểu đồ

```
Làm tab "Tổng quan" trong file riêng assets/js/admin-thong-ke.js, dùng Chart.js 4.4.1:
- 5 thẻ số liệu: yêu cầu báo giá mới, thiết kế mới, lịch 7 ngày tới, đánh giá chờ duyệt, điểm đánh giá trung bình.
- Biểu đồ đường: số yêu cầu báo giá + thiết kế + lịch theo 6 tháng gần nhất.
- Biểu đồ cột: top 5 sản phẩm được thêm vào báo giá nhiều nhất (đếm từ danh_sach JSON).
- Biểu đồ tròn: lịch theo bước tiến độ.
- Bảng lịch 7 ngày tới. Màu theo DESIGN.md. Không có dữ liệu thì hiện "Chưa có dữ liệu" thay vì biểu đồ trống.
```

**Kết quả:** (Claude làm) `admin-thong-ke.js` với Chart.js 4.4.1: 5 thẻ số liệu (yêu cầu mới, thiết kế mới, lịch 7 ngày tới, đánh giá chờ duyệt, điểm TB) – bấm thẻ nhảy tới tab tương ứng; biểu đồ đường 6 tháng (yêu cầu báo giá, thiết kế, lịch), biểu đồ cột ngang top 5 sản phẩm được thêm vào báo giá (đếm từ `danh_sach`), biểu đồ tròn lịch theo bước tiến độ; bảng lịch 7 ngày tới. Không có dữ liệu → hiện "Chưa có dữ liệu".

**Prompt phụ:**
- **15a** – Hộp soạn bài không toàn màn hình và chân hộp thoại bị nền xanh đậm (bị kiểu `footer` của trang web đè) → sửa CSS riêng cho header/footer bên trong hộp thoại, thẻ đánh giá, trợ lý → **đạt**.


📷 Ảnh: `docs/hinh-chup/p15-admin-tong-quan.png`
---

## Prompt 16 – Trang Tin tức & chi tiết bài viết

```
Làm tin-tuc.html + tin-tuc.js và bai-viet.html + bai-viet.js theo DESIGN.md mục 7 "Tin tức" và "Chi tiết bài viết", bảng bai_viet trong DATABASE.md mục 8b:
- Tin tức: chỉ bài da_dang = true, mới nhất trước; chip chuyên mục, ô tìm theo tiêu đề, bài nổi bật to ở đầu, lưới thẻ, phân trang 9 bài.
- Chi tiết: đọc ?bai=<slug>; tiêu đề/tóm tắt/nội dung theo ngôn ngữ bằng tuDB(); nội dung Markdown hiển thị bằng marked 12.0.2 + lọc DOMPurify 3.1.6;
  bản dịch trống thì hiện tiếng Việt + dòng nhỏ "Bài này hiện chỉ có tiếng Việt" (dịch theo ngôn ngữ); gọi db.rpc("tang_luot_xem") 1 lần mỗi phiên;
  thời gian đọc ước tính; nút chia sẻ Facebook, Zalo, Sao chép link; 3 bài liên quan cùng chuyên mục; đổi <title> và meta description.
  Không tìm thấy bài → thông báo + nút về Tin tức.
- Trang chủ: nối khối "Bài viết mới nhất" (3 bài). Thêm "Tin tức" vào menu (layout.js) đúng vị trí PRD mục 2.
```

**Kết quả:** (Claude làm) `tin-tuc.html` + `tin-tuc.js`: chỉ bài `da_dang = true`, mới nhất trước, chip Kiến thức / Tin công ty / Công trình, ô tìm (không cần gõ dấu), bài nổi bật dạng thẻ ngang lớn, lưới 3/2/1 cột, phân trang 9 bài. `bai-viet.html` + `bai-viet.js`: đọc `?bai=<slug>`, ảnh đại diện phủ gradient + tiêu đề trắng, chuyên mục · ngày · lượt xem · phút đọc; Markdown hiển thị bằng marked 12.0.2 + lọc DOMPurify 3.1.6; chọn EN/中文 mà bài chưa dịch → hiện tiếng Việt kèm dòng "Bài này hiện chỉ có tiếng Việt" (dịch theo ngôn ngữ); `tang_luot_xem` gọi 1 lần mỗi phiên; chia sẻ Facebook, Zalo (điện thoại mở bảng chia sẻ, máy tính sao chép link), Sao chép link; 3 bài liên quan; đổi `<title>` và meta description; slug sai → "Không tìm thấy bài viết" + nút về Tin tức. Trang chủ: khối "Bài viết & Tin tức" hiện 3 bài mới nhất; menu đã có mục Tin tức.

Kiểm tra thật: trang Tin tức hiện bài nổi bật + 2 thẻ; mở bài `nha-panel-eps-hay-pu` ở chế độ 中文 → menu, chuyên mục, ngày, "次浏览" đổi tiếng Trung, hiện dòng "本文目前仅有越南语版本。", **lượt xem tăng từ 0 lên 1** (RPC `tang_luot_xem`), 2 bài liên quan.

📷 Ảnh: `docs/hinh-chup/p16-tin-tuc.png`, `p16b-bai-viet-zh.png`

---

## Prompt 17 – Quản trị bài viết + nút "Dịch bằng AI" (Gemini)

```
Đọc PRD.md mục 3.5b, DATABASE.md mục 8b–8d, DESIGN.md mục 7 "Quản trị – soạn bài viết" và "Nút Dịch bằng AI".
1. Viết Edge Function supabase/functions/dich-ai/index.ts (Deno) đúng bảng mô tả DATABASE.md mục 8d: đọc GEMINI_API_KEY, GEMINI_MODEL từ
   Deno.env, gọi Gemini generateContent trả JSON {en:{...}, zh:{...}} cùng khóa với đầu vào, có bảng thuật ngữ, giữ Markdown,
   xử lý CORS + OPTIONS, báo lỗi tiếng Việt (401/429/500). Comment tiếng Việt từng bước. Viết thêm file
   supabase/functions/dich-ai/HUONG-DAN-TRIEN-KHAI.md: cách dán code vào Supabase Dashboard → Edge Functions và thêm 2 Secrets.
2. File riêng assets/js/admin-dich-ai.js: hàm dichBangAI(nhomO) dùng chung cho form sản phẩm, công trình, bài viết:
   gom ô tiếng Việt → db.functions.invoke("dich-ai") → điền tab EN / 中文; tùy chọn "Chỉ dịch ô còn trống"; trạng thái "AI đang dịch…";
   toast "Đã dịch xong – vui lòng xem lại trước khi lưu"; lỗi thì giữ nguyên chữ. Gắn nút "🌐 Dịch bằng AI" vào form sản phẩm và công trình.
3. Tab "Bài viết" trong admin (file riêng assets/js/admin-bai-viet.js): bảng bài (tiêu đề, chuyên mục, trạng thái Nháp/Đã đăng, có EN/中文 chưa,
   lượt xem, ngày); Thêm / Sửa / Xóa (INSERT/UPDATE/DELETE); modal soạn bài toàn màn hình: Markdown + xem trước, thanh công cụ nhỏ,
   3 tab VI/EN/中文 + nút Dịch bằng AI, chuyên mục, slug tự tạo từ tiêu đề (bỏ dấu tiếng Việt), ảnh đại diện (chọn ảnh có sẵn
   hoặc tải lên Storage "anh-web" – nén ảnh ≤1600px trước khi tải), nổi bật, "Lưu nháp" / "Đăng bài".
Chưa có khóa Gemini thì nút vẫn hiện, bấm báo "Chưa cấu hình khóa Gemini – xem HUONG-DAN.md Bước 3b".
```

**Kết quả:** (Claude làm)
1. `supabase/functions/dich-ai/index.ts` (Deno): đọc `GEMINI_API_KEY`, `GEMINI_MODEL` từ Secrets, gọi Gemini `generateContent` (JSON, temperature 0.2), hướng dẫn dịch có bảng thuật ngữ, giữ Markdown, chỉ trả JSON cùng khóa; CORS + OPTIONS; báo lỗi tiếng Việt 400/401/429/500; giới hạn 20.000 ký tự. Comment tiếng Việt từng bước. Kèm `HUONG-DAN-TRIEN-KHAI.md`.
2. `admin-dich-ai.js`: hàm dùng chung cho form sản phẩm, công trình, bài viết – gom ô tiếng Việt → `db.functions.invoke("dich-ai")` → điền EN/中文, tùy chọn "Chỉ dịch ô còn trống", nút "⏳ AI đang dịch…" + ô nhấp nháy, xong tự sang tab EN + toast "Đã dịch xong – vui lòng xem lại trước khi lưu"; lỗi giữ nguyên chữ; chưa triển khai hàm / chưa có khóa → báo "Chưa cấu hình khóa Gemini – xem HUONG-DAN.md Bước 3b".
3. `admin-bai-viet.js`: bảng bài (tiêu đề, chuyên mục, Nháp/Đã đăng, có EN/中文 chưa, lượt xem, ngày); modal soạn bài toàn màn hình: 3 tab ngôn ngữ, Markdown + xem trước trực tiếp, thanh công cụ (B, I, ##, danh sách, link, chèn ảnh tải lên kho), slug tự tạo từ tiêu đề bỏ dấu, ảnh đại diện có sẵn / tải lên, nổi bật, "Lưu nháp" / "Đăng bài" (**INSERT / UPDATE**), Xóa (**DELETE**).

> Chị Mai tự triển khai hàm `dich-ai` và thêm 2 Secrets (`GEMINI_API_KEY`, `GEMINI_MODEL = gemini-3.8-flash` – model Flash miễn phí 20 lượt/ngày); Claude không nhập khóa API thay chị.

Kiểm tra thật (11/10): trước khi có khóa, hàm trả đúng "Chưa cấu hình khóa Gemini"; sau khi có khóa, bấm **🌐 Dịch bằng AI** ở bài "Quy trình báo giá và thi công…" → khoảng 10–20 giây điền đủ tiêu đề, tóm tắt, nội dung EN + 中文, **giữ nguyên Markdown**, tên "Xingfa Tiếu Nghĩa" và số điện thoại; thuật ngữ đúng bảng (兴发铝合金, "Liên hệ" → "Contact for quote" / "欢迎咨询报价").

📷 Ảnh: `docs/hinh-chup/p17b-dich-bang-ai.png`


📷 Ảnh: `docs/hinh-chup/p17-admin-soan-bai.png`
---

## NHÓM C – 3 NGÔN NGỮ & LỚP CHO AI

## Prompt 18 – Dịch toàn bộ sang tiếng Anh & tiếng Trung giản thể

```
Đọc assets/lang/vi.js. Dịch đầy đủ TẤT CẢ khóa sang assets/lang/en.js (tiếng Anh tự nhiên, văn phong doanh nghiệp)
và assets/lang/zh.js (tiếng Trung GIẢN THỂ 简体, dùng thuật ngữ ngành: 兴发铝合金, 夹芯板, 钢结构...). Giữ nguyên tên riêng
"Xingfa Tiếu Nghĩa", số điện thoại, địa chỉ tiếng Việt (thêm phiên âm không dấu cho bản Anh).
Sau đó kiểm tra: lần lượt chọn English và 中文 trên từng trang khách (10 trang + trợ lý + mô hình 3D + thông báo lỗi form)
– không còn chữ tiếng Việt sót, không vỡ giao diện vì chữ dài/ngắn, font Noto Sans SC hiện đúng.
Link ?lang=en, ?lang=zh hoạt động. Liệt kê các khóa còn thiếu đã bổ sung.
```

**Kết quả:** (Claude làm) Bổ sung **98 khóa** còn thiếu ở `en.js` và `zh.js` (nhóm `trangChu` 61 khóa, `faq` 16, `gioiThieu` 21) – tiếng Anh văn phong doanh nghiệp, tiếng Trung giản thể dùng thuật ngữ 兴发铝合金, 夹芯板, 装配式房屋; địa chỉ giữ tiếng Việt + phiên âm không dấu ở bản Anh. Giờ 3 file có số khóa bằng nhau. Sửa thêm chữ viết cứng trong JS: dòng chữ gõ tự động ở banner (khóa `trangChu.goChu`), giá "Liên hệ" ở trang chi tiết. Ô nhập có `data-i18n-placeholder` được dịch ở mọi trang. Kiểm tra tự động 11 trang × 3 ngôn ngữ (máy tính 1366px + điện thoại 390px): **0 lỗi JavaScript, 0 khóa thô, không tràn ngang**; chữ tiếng Việt còn lại chỉ là tên riêng, địa chỉ, nội dung khách gõ (đánh giá) và bài viết chưa dịch (đúng thiết kế – chờ nút Dịch bằng AI).

---

## Prompt 19 – Website 2 lớp: lớp cho AI (GEO)

```
Làm "lớp cho AI" theo PRD.md mục 3.6 và DESIGN.md mục 10. Tất cả phải đọc được KHÔNG cần JavaScript:
1. llms.txt ở thư mục gốc theo chuẩn llmstxt.org (# tên, > tóm tắt, các mục ## có link .md/.html): tiếng Anh trước, tiếng Việt sau.
2. llms-full.txt: 6 nhóm dịch vụ, 15 sản phẩm (lấy ĐÚNG nội dung database/seed.sql, kèm link chi-tiet.html?id=), quy trình 5 bước,
   câu hỏi thường gặp, chính sách giá "Liên hệ". Chỉ dùng thông tin có trong PRD.md và seed.sql, không bịa.
3. JSON-LD schema.org viết TĨNH trong <head> mọi trang khách: HomeAndConstructionBusiness (tên, logo, địa chỉ, telephone,
   openingHours Mo-Su 08:00-17:00, areaServed Tây Ninh, sameAs Facebook, availableLanguage vi/en/zh);
   trang chủ thêm FAQPage (đúng 8 câu hỏi thường gặp); chi-tiet.html thêm BreadcrumbList.
4. robots.txt (cho phép GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended; Disallow admin.html; dòng Sitemap)
   và sitemap.xml (các trang công khai + 15 link chi tiết + 3 bài viết mẫu). Địa chỉ gốc tạm là https://nhomkinhtieunghia-sys.github.io/xingfa-tieunghia/ – ghi chú đầu file cách đổi.
5. san-pham.html thêm <noscript> danh sách tĩnh 15 sản phẩm.
6. Làm ai.html "Dành cho AI" theo DESIGN.md mục 10 (có nút Hỏi ChatGPT / Perplexity, link xem llms.txt), link ở footer mọi trang.
Kiểm tra: tắt JavaScript trên trình duyệt, mở index.html và ai.html vẫn đọc được nội dung chính;
dán trang chủ vào https://validator.schema.org báo không lỗi.
```

**Kết quả:** (Claude làm)
1. `llms.txt` theo chuẩn llmstxt.org (tiếng Anh trước, tiếng Việt sau) + `llms-full.txt` (6 nhóm dịch vụ, 15 sản phẩm lấy đúng từ `seed.sql` kèm link `chi-tiet.html?id=`, quy trình 5 bước, 8 câu hỏi thường gặp, chính sách giá "Liên hệ", 3 bài viết; có bản English summary).
2. JSON-LD tĩnh trong `<head>` 11 trang khách: `HomeAndConstructionBusiness` (tên, logo, địa chỉ, điện thoại, email, `openingHours Mo-Su 08:00-17:00`, `areaServed Tây Ninh`, Facebook, `availableLanguage vi/en/zh`); trang chủ thêm `FAQPage` đúng 8 câu; `chi-tiet.html` thêm `BreadcrumbList`.
3. `robots.txt` (cho phép GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended; chặn `admin.html`) + `sitemap.xml` (9 trang + 15 sản phẩm + 3 bài viết + llms). Địa chỉ gốc tạm `https://nhomkinhtieunghia-sys.github.io/xingfa-tieunghia/` – ghi chú đầu file cách đổi.
4. `san-pham.html` có `<noscript>` 15 sản phẩm; mọi trang có `<noscript>` hiện các khối có hiệu ứng (không bị ẩn khi tắt JS).
5. `ai.html` "Website này đọc được bởi cả người và AI": 3 thẻ lớp AI, nút Hỏi ChatGPT / Hỏi Perplexity / Xem llms.txt, thông tin công ty, 6 dịch vụ, 15 sản phẩm có link, quy trình, câu hỏi thường gặp, English summary. Link ở footer.

Kiểm tra: **tắt JavaScript** → trang chủ đọc được 2.163 ký tự nội dung, `ai.html` 7.454 ký tự, `san-pham.html` có đủ 15 sản phẩm; `sitemap.xml` đúng XML. (Kiểm tra validator.schema.org cần làm sau khi deploy có link thật.) Trên Live Server: `llms.txt`, `sitemap.xml` mở được (200).

📷 Ảnh: `docs/hinh-chup/p19-danh-cho-ai.png`

---

## NHÓM D – KIỂM TRA & DEPLOY


## Prompt 20 – Kiểm tra toàn bộ, responsive, sửa lỗi

```
Kiểm tra toàn bộ website:
1. Bấm thử TẤT CẢ link trong menu, footer, nút, trợ lý trên mọi trang – không có link hỏng, trang nào cũng về được trang khác.
   Thử ở cả 3 ngôn ngữ: chuyển trang vẫn giữ ngôn ngữ đã chọn.
2. Xem ở khổ 375px, 768px, 1280px – sửa chỗ vỡ giao diện, chữ tràn, thanh cuộn ngang; khung 3D, bản đồ, khung chat dùng tốt trên điện thoại.
3. Logo là cùng 1 file assets/images/logo.jpg ở mọi chỗ, tên thương hiệu đúng "Xingfa Tiếu Nghĩa" (dấu sắc).
4. Mở Console xem lỗi JavaScript, sửa hết. Thử mọi chức năng thêm/sửa/xóa một lượt.
5. Thêm <title>, <meta description>, favicon, thẻ Open Graph (ảnh banner) cho từng trang.
6. Kiểm tra tốc độ: ảnh lazy, thư viện chỉ nạp ở trang cần (Three.js chỉ ở thiet-ke-nha, Leaflet ở cong-trinh/admin, Chart.js ở admin).
Liệt kê những gì đã sửa.
```

**Kết quả:** (Claude làm)
- Kiểm tra tự động 11 trang khách × 3 ngôn ngữ × 2 cỡ màn hình (1366px, 390px): **0 lỗi JavaScript, 0 khóa chữ thô, không tràn ngang**; kiểm tra tay trên Chrome thật các trang 7–19.
- Kiểm tra liên kết nội bộ trong mọi file HTML/JS: không có link hỏng. Sửa 1 ảnh nền sai đường dẫn trong `style.css` (khối số liệu trang chủ).
- Điện thoại: mô hình 3D bị cắt ở màn hình dọc → camera tự lùi xa theo tỉ lệ màn hình; thanh nút 3D tự xuống dòng; bảng quản trị cuộn ngang.
- Tắt JavaScript: trang chủ, Dành cho AI, Sản phẩm vẫn đọc được nội dung chính.
- Trang Quản trị: hiện đúng hộp đăng nhập; phần bên trong cần chị Mai đăng nhập để kiểm tra với dữ liệu thật.

**Prompt phụ:** 20b – lịch đã hủy mà nút "Cập nhật tiến độ" gợi ý sẵn bước "Hoàn thành" → sửa gợi ý "Chờ xác nhận" (mở lại lịch). 20a – sửa ảnh nền sai đường dẫn, camera 3D trên điện thoại → **đạt**.

---

## Prompt 21 – README & chuẩn bị deploy

```
Cập nhật README.md: giới thiệu dự án, điểm khác biệt (có 3 ngôn ngữ và lớp cho AI), link web deploy, danh sách trang, chức năng, công nghệ, cấu trúc thư mục,
cách chạy thử trên máy, cách tạo database (chạy schema.sql rồi seed.sql), danh sách file .md và tác dụng.
Kiểm tra lần cuối mọi đường dẫn là tương đối để chạy được trên https://nhomkinhtieunghia-sys.github.io/xingfa-tieunghia/
Kiểm tra .gitignore đã có sẵn.
```

**Kết quả:** (Claude làm) `README.md` cập nhật: mô tả, điểm khác biệt, 12 trang, chức năng database, cấu trúc thư mục (thêm các file admin tách riêng, `supabase/functions/dich-ai`), bảng file .md, cách chạy thử. `HUONG-DAN.md` thêm việc xóa dữ liệu thử. Mọi đường dẫn đều tương đối nên chạy được trên Github Pages.

**Việc chị Mai làm tiếp:** đăng nhập admin kiểm tra; cài hàm `dich-ai` + khóa Gemini (HUONG-DAN.md Bước 3b); xóa dữ liệu "TEST Claude kiem tra"; push Github, bật Pages.
