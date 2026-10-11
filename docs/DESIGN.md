# DESIGN – Hướng dẫn giao diện Xingfa Tiếu Nghĩa

> **File này dùng để làm gì?** Quy định giao diện: màu sắc, font chữ, logo, hình ảnh, bố cục từng trang, hiệu ứng, cách hiển thị mô hình 3D. AI agent đọc file này để mọi trang trông **đồng nhất một phong cách**, đúng nhận diện thương hiệu thật trên xingfatieunghia.com.

---

## 1. Phong cách chung
- Chuyên nghiệp, đáng tin cậy, hiện đại kiểu **công ty cơ khí – xây dựng công nghệ**: rõ ràng, nhiều khoảng trắng, ảnh công trình lớn.
- Bo góc 10–12px, đổ bóng nhẹ, hover nâng thẻ lên nhẹ.
- Chuyển động mượt, sang (xem mục 9), không lòe loẹt.

## 2. Màu sắc (lấy theo logo + website thật)

Khai báo trong `:root` của `assets/css/style.css`:

```css
:root {
  --mau-chinh: #1A2452;      /* Xanh navy đậm (màu cánh cửa trong logo) – header, footer, tiêu đề */
  --mau-phu: #046BD2;        /* Xanh dương – link, nút phụ, icon */
  --mau-nhan: #E53935;       /* Đỏ (chữ N trong logo) – nút kêu gọi hành động, badge */
  --mau-nen: #FFFFFF;
  --mau-nen-nhat: #F4F6FB;   /* Nền khối xen kẽ */
  --mau-chu: #334155;
  --mau-chu-nhat: #69727D;
  --mau-vien: #E2E8F0;
  --mau-thanh-cong: #16A34A;
  --mau-canh-bao: #F59E0B;
  --bo-goc: 12px;
  --bong: 0 6px 20px rgba(26, 36, 82, 0.08);
  --chuyen-dong: cubic-bezier(.22,.61,.36,1);
}
```

## 3. Font chữ
- Tiêu đề (h1–h4, nút): **Poppins** (600–700).
- Nội dung: **Be Vietnam Pro** (400–500).
- Tiếng Trung: **Noto Sans SC** (400–700) – khi `<html lang="zh-CN">` thì đổi font tiêu đề và nội dung sang Noto Sans SC.
- Cỡ chữ: h1 44px (điện thoại 28px), h2 32px (điện thoại 24px), nội dung 16px.

```html
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&family=Be+Vietnam+Pro:wght@400;500&family=Noto+Sans+SC:wght@400;500;700&display=swap" rel="stylesheet">
```

## 4. Logo
- Logo thật của công ty: hình **cánh cửa 2 cánh màu xanh navy**, ở giữa là **chữ "N" đỏ lồng chữ "T"** (Tiếu – Nghĩa), bên dưới dòng chữ **"TIEU NGHIA – DOOR SOLUTIONS"**. Màu navy + đỏ chính là `--mau-chinh` và `--mau-nhan` của website.
- **Một file duy nhất**: `assets/images/logo.jpg` – dùng ở header (cao 48px), footer (56px), favicon, màn hình chờ, ảnh đại diện trợ lý tư vấn.
- Cạnh logo ở header: chữ **"Xingfa Tiếu Nghĩa"** (Poppins, `--mau-chinh`) + dòng nhỏ "Cơ Khí – Cửa Nhôm – Nhà Panel".
- Không kéo méo, không đổi màu logo.

## 5. Hình ảnh

✅ **Ảnh và logo thật đã có sẵn** trong `assets/images/` (tải từ xingfatieunghia.com, đã nén `.jpg`). **AI không tải thêm, không đổi tên**:

| File | Dùng ở |
|---|---|
| `logo.jpg` | Logo mọi nơi |
| `banner.jpg` | Banner trang chủ |
| `ve-chung-toi.jpg` | Trang giới thiệu |
| `cua-sat.jpg` | Nhóm Cửa sắt |
| `cua-nhom-xingfa.jpg` | Nhóm Cửa nhôm |
| `cua-nhom-4-canh.jpg` | Sản phẩm cửa nhôm |
| `nha-panel-dan-dung.jpg` | Nhóm Nhà panel |
| `nha-panel-mau-go.jpg` | Sản phẩm nhà panel |
| `tu-bep-nhom.jpg` | Nhóm Tủ bếp |
| `tu-bep-tieu-nghia.jpg` | Sản phẩm tủ bếp |
| `mai-che.jpg` | Nhóm Mái che |
| `bao-tri.jpg` | Nhóm Bảo trì |
| `sp-cua-sat-rao.jpg` | Sản phẩm cửa sắt (Ảnh tạo bằng AI thực tế) |
| `sp-lan-can-cau-thang.jpg` | Sản phẩm cầu thang sắt (Ảnh tạo bằng AI thực tế) |
| `sp-vach-kinh-cuong-luc.jpg` | Sản phẩm vách kính (Ảnh tạo bằng AI thực tế) |
| `sp-nha-panel-pu.jpg` | Sản phẩm nhà panel (Ảnh tạo bằng AI thực tế) |
| `sp-mai-hien-di-dong.jpg` | Sản phẩm mái hiên (Ảnh tạo bằng AI thực tế) |
| `sp-sua-cong-sat.jpg` | Sản phẩm sửa cổng sắt (Ảnh tạo bằng AI thực tế) |

- Đánh giá khách hàng: **không dùng ảnh**, hiện ô tròn chữ cái đầu tên nền `--mau-phu`.
- Thầy cho phép ảnh tạo bằng AI; nếu cần thêm ảnh, đặt tên không dấu theo quy tắc trên.
- Ảnh có `alt` tiếng Việt, `loading="lazy"`, `object-fit: cover`.

## 6. Thành phần giao diện dùng chung

| Thành phần | Mô tả |
|---|---|
| Thanh trên cùng (top bar) | Cao 36px, nền `--mau-chinh`, chữ trắng nhỏ. Trái: 📞 097-622-4875 · ⏰ giờ làm việc (ẩn trên điện thoại). Phải: **"Ngôn ngữ:" + nút chọn ngôn ngữ** (xem mục 11) |
| Header | Nền trắng, sticky, bóng nhẹ; **khi cuộn xuống thì thu nhỏ chiều cao + nền mờ (backdrop-filter)**. Trái: logo + tên. Phải: menu + nút đỏ "Gọi 097-622-4875". Mục "Thiết kế 3D" có nhãn đỏ nhỏ "Mới". Trang đang mở gạch chân `--mau-phu`. Điện thoại: menu ☰ trượt từ phải |
| Footer | Nền `--mau-chinh`, chữ trắng. 3 cột: (1) logo + giới thiệu, (2) link tới tất cả trang + "Quản trị", (3) địa chỉ, hotline, email, giờ làm việc, Facebook. Dòng cuối © 2026 Công Ty TNHH Cơ Khí Tiếu Nghĩa |
| Nút chính | Nền `--mau-nhan`, chữ trắng, bo 8px, hover đậm hơn + bóng |
| Nút phụ | Viền + chữ `--mau-phu`, nền trắng |
| Thẻ sản phẩm | Ảnh 4:3 (hover phóng nhẹ ảnh), chip nhóm, tên, mô tả 2 dòng, "Giá: Liên hệ", nút "Xem chi tiết" |
| Nút nổi phải dưới | Tròn đỏ (gọi) + tròn xanh (Zalo), rung nhẹ; nút "lên đầu trang" hiện khi cuộn |
| Trợ lý tư vấn (trái dưới) | Nút tròn `--mau-chinh` có biểu tượng chat + chấm đỏ nhấp nháy. Mở ra khung chat 360×520 (điện thoại: toàn màn hình). Đầu khung: logo + "Trợ lý Tiếu Nghĩa – thường trả lời ngay". Tin nhắn bot bên trái nền xám nhạt, khách bên phải nền `--mau-phu` chữ trắng; nút trả lời nhanh dạng chip; hiệu ứng "đang gõ…" 3 chấm trước mỗi câu trả lời; thẻ sản phẩm mini (ảnh nhỏ + tên + nút) |
| Toast | Góc phải trên, tự tắt sau 3 giây |
| Modal | Nền mờ tối, hộp trắng bo góc, hiệu ứng phóng nhẹ khi mở; dùng cho xác nhận xóa/hủy, form admin |
| Ngôi sao | ★ màu `--mau-canh-bao`; khi chọn sao trong form: hover tô sáng dần |

## 7. Bố cục từng trang

**Trang chủ (`index.html`)**
1. Banner toàn màn hình: ảnh `banner.jpg` (hiệu ứng Ken Burns), lớp phủ gradient navy, tiêu đề "Chuyên Gia Công Cửa Sắt, Cửa Nhôm Xingfa & Nhà Lắp Ráp Panel Tại Tây Ninh", dòng chữ gõ tự động xoay vòng "Cửa nhôm Xingfa | Nhà lắp ráp panel | Cổng sắt mỹ thuật | Tủ bếp nhôm", mô tả "Hơn 10 năm kinh nghiệm…", 2 nút "Nhận báo giá" + "Thiết kế nhà 3D", mũi tên cuộn xuống nhấp nháy.
2. Dịch vụ: 6 thẻ (3 cột / 1 cột), bấm sang `san-pham.html?nhom=…`.
3. **Khối "Tự thiết kế nhà panel 3D"**: nền `--mau-chinh`, 2 cột: trái chữ giới thiệu 3 lợi ích (Xem trước 3D – Tính diện tích tức thì – Thử lên ảnh đất nhà bạn) + nút đỏ "Thử ngay"; phải là ảnh `nha-panel-mau-go.jpg` có hiệu ứng nổi lơ lửng.
4. Sản phẩm nổi bật: 6 thẻ từ database.
5. Vì sao chọn chúng tôi: 4 ô icon (Kinh nghiệm lâu năm, Chất lượng đảm bảo, Giá cả hợp lý, Bảo hành dài hạn).
6. Con số: 10+ năm kinh nghiệm · 8 thành viên · 6 nhóm dịch vụ · N mẫu sản phẩm (đếm từ database) – đếm tăng khi cuộn tới.
7. Quy trình 5 bước: Tiếp nhận → Khảo sát đo đạc → Báo giá → Gia công & lắp đặt → Bàn giao & bảo hành (đường nối chạy dần khi cuộn).
8. Đánh giá khách hàng: điểm trung bình + 3 đánh giá mới nhất đã duyệt (thẻ trượt ngang trên điện thoại), link "Xem tất cả & gửi đánh giá" → `cong-trinh.html#danh-gia`.
8b. **Bài viết mới nhất**: 3 thẻ bài viết (ảnh, chuyên mục, ngày, tiêu đề, tóm tắt 2 dòng, "Xem chi tiết →") + nút "Xem tất cả bài viết" → `tin-tuc.html`.
9. **Câu hỏi thường gặp**: 8 câu dạng mở/đóng (accordion) – viết tĩnh trong HTML (tiếng Việt) kèm JSON-LD `FAQPage`; chữ đổi theo ngôn ngữ qua `data-i18n`. Nội dung: khu vực thi công, có khảo sát miễn phí không, báo giá thế nào, nhôm Xingfa nhập khẩu và Việt Nam khác gì, panel EPS và PU khác gì, thời gian thi công nhà panel, bảo hành, cách theo dõi tiến độ. Không bịa con số (thời gian ghi "tùy quy mô, báo cụ thể sau khảo sát"; bảo hành ghi chung theo chính sách công ty).
10. Khối kêu gọi: "Sẵn sàng cho công trình của bạn?" + nút "Đặt lịch khảo sát miễn phí".

**Giới thiệu (`gioi-thieu.html`)**: tiêu đề trang → 2 cột (ảnh `ve-chung-toi.jpg` + giới thiệu/sứ mệnh) → 3 con số → 4 giá trị cốt lõi (Chất lượng – Uy tín – Đúng hẹn – Tận tâm) → **Google Maps rộng 100%, cao 400px** + khung liên hệ bên cạnh.

**Sản phẩm (`san-pham.html`)**: tiêu đề → chip lọc (Tất cả + 6 nhóm) + ô tìm kiếm → lưới thẻ (3/2/1 cột), thẻ hiện dần lần lượt.

**Chi tiết (`chi-tiet.html`)**: breadcrumb → 2 cột: ảnh lớn (bấm phóng to) | thông tin + số lượng + nút giỏ (+ nút "Tự thiết kế 3D" nếu nhóm `nha-panel`) → bảng thông số → sản phẩm cùng nhóm.

**Thiết kế 3D (`thiet-ke-nha.html`)**: xem mục 8.

**Công trình (`cong-trinh.html`)**: tiêu đề → chip lọc hạng mục → 2 cột (máy tính): **bản đồ cao 520px** | danh sách thẻ công trình cuộn được; bấm thẻ thì bản đồ bay tới ghim và mở popup (ảnh + tên + hạng mục + địa điểm + năm). Điện thoại: bản đồ trên, danh sách dưới. Dòng chú thích nhỏ về dữ liệu minh họa. → Khối `#danh-gia`: điểm trung bình lớn + thanh phân bố 5→1 sao, danh sách đánh giá đã duyệt, form gửi đánh giá (họ tên, chọn sao, nội dung, chọn công trình/dịch vụ – không bắt buộc). Gửi xong: "Cảm ơn! Đánh giá sẽ hiển thị sau khi được duyệt."

**Tin tức (`tin-tuc.html`)**: tiêu đề trang → chip chuyên mục (Tất cả · Kiến thức · Tin công ty · Công trình) + ô tìm kiếm → bài nổi bật dạng thẻ ngang lớn (ảnh trái, chữ phải) → lưới thẻ 3/2/1 cột → nút phân trang.

**Chi tiết bài viết (`bai-viet.html?bai=<slug>`)**: ảnh đại diện rộng toàn khung (cao 420px, lớp phủ gradient, tiêu đề trắng nằm trên ảnh) → dòng thông tin (chuyên mục · ngày · 👁 lượt xem · thời gian đọc ước tính) → nội dung rộng tối đa 760px, chữ 17px, giãn dòng 1.8, tiêu đề ## màu `--mau-chinh`, ảnh trong bài bo góc → thanh chia sẻ (Facebook, Zalo, Sao chép link) → khối liên hệ nền `--mau-nen-nhat` → "Bài viết liên quan" 3 thẻ. Cập nhật `<title>` và `<meta description>` theo bài.

**Giỏ báo giá (`bao-gia.html`)**: 2 cột: bảng giỏ | form khách hàng. Giỏ trống: hình minh họa + nút "Xem sản phẩm".

**Đặt lịch & Tiến độ (`dat-lich.html`)**: 2 tab.
- "Đặt lịch khảo sát": form; thành công hiện hộp lớn có **mã lịch** + nút sao chép mã.
- "Tra cứu & tiến độ": nhập mã + SĐT → thẻ thông tin lịch + **dòng thời gian dọc** 7 bước: Chờ xác nhận → Đã xác nhận → Đã khảo sát → Đã báo giá → Đang gia công → Đang lắp đặt → Hoàn thành. Bước đã qua: chấm xanh lá + ngày giờ + ghi chú; bước hiện tại: chấm `--mau-nhan` nhấp nháy; bước chưa tới: xám. Đã hủy: dải đỏ "Lịch đã hủy". Nút "Đổi lịch", "Hủy lịch" chỉ hiện khi còn ở Chờ xác nhận / Đã xác nhận.

**Quản trị – soạn bài viết**: modal toàn màn hình, 2 cột: trái là ô soạn Markdown (thanh công cụ nhỏ: **B**, *I*, ##, danh sách, chèn ảnh, chèn link) | phải là **xem trước** trực tiếp. Phía trên: 3 tab `🇻🇳 VI` · `🇬🇧 EN` · `🇨🇳 中文` (tab chưa có nội dung hiện chấm xám, đã có hiện chấm xanh) và nút **`🌐 Dịch bằng AI`** (nền gradient tím–xanh, biểu tượng lấp lánh) + ô chọn "Chỉ dịch ô còn trống". Phía dưới: chuyên mục, ảnh đại diện (chọn có sẵn / tải lên – xem trước ảnh), slug, nổi bật, nút "Lưu nháp" (nút phụ) và "Đăng bài" (nút chính).

**Nút Dịch bằng AI** (dùng chung cho form sản phẩm, công trình, bài viết): bấm → nút đổi thành "⏳ AI đang dịch…" + các ô EN/中文 hiện hiệu ứng nhấp nháy (shimmer) → xong tự chuyển sang tab EN, toast "Đã dịch xong – vui lòng xem lại trước khi lưu". Lỗi → toast đỏ, giữ nguyên chữ.

**Quản trị (`admin.html`)**: chưa đăng nhập → hộp đăng nhập giữa màn hình. Đã đăng nhập → thanh bên trái (điện thoại: thanh tab trên) gồm 8 mục có số đếm; nội dung là bảng + nút Thêm; thêm/sửa bằng modal. Tab "Tổng quan": hàng 5 thẻ số liệu → lưới 2 cột biểu đồ → bảng lịch 7 ngày tới. Màu biểu đồ dùng `--mau-chinh`, `--mau-phu`, `--mau-nhan`, `--mau-canh-bao`, `--mau-thanh-cong`.

## 8. Trang Thiết kế nhà panel 3D (`thiet-ke-nha.html`)

**Bố cục máy tính**: thanh tab trên cùng (Thiết kế 3D · Thử lên ảnh đất · Gửi báo giá). Tab 1: cột trái 340px **bảng tùy chọn** (chia nhóm có thể thu gọn) | giữa là **khung 3D** (cao 70vh, nền gradient trời xanh nhạt → trắng) với thanh nút nổi dưới khung (Trước · Bên · Trên · Tự xoay · Chụp ảnh · Chia sẻ) | dưới khung 3D là **bảng kết quả** dạng 6 ô số liệu. Điện thoại: khung 3D trên (cao 55vh), tùy chọn và kết quả bên dưới.

**Tùy chọn & giới hạn** (đặt trong 1 object `TUY_CHON` ở đầu `thiet-ke-nha.js` để dễ sửa):

| Nhóm | Tùy chọn |
|---|---|
| Công năng (chọn sẽ tự điền gợi ý) | Nhà ở (8×5×3,2 m, 2 mái, PU 75, 2 cửa đi, 4 cửa sổ) · Nhà trọ (12×4×3 m, 1 mái, EPS 50, 4 cửa đi, 4 cửa sổ) · Kho – xưởng (20×10×5 m, 2 mái, PU 100, 2 cửa đi, 2 cửa sổ) · Văn phòng (10×6×3,2 m, 1 mái, EPS 75, 1 cửa đi, 6 cửa sổ) · Homestay (6×4×3 m, 2 mái, vân gỗ 75, 1 cửa đi, 3 cửa sổ) |
| Kích thước | Dài 3–30 m, rộng 3–15 m (bước 0,5), cao tường 2,8–6 m (bước 0,1) – thanh trượt + ô nhập số |
| Panel | Loại: EPS / PU / Vân gỗ · Độ dày: 50 / 75 / 100 mm (kèm mô tả ngắn: EPS tiết kiệm, PU cách nhiệt cao, vân gỗ thẩm mỹ) |
| Mái | Kiểu: 1 mái lệch (dốc 10°) / 2 mái (dốc 15°), mái đua ra 0,3 m |
| Màu | Vách: Trắng kem `#F2EFE6`, Xám ghi `#9AA3AD`, Xanh ngọc `#2C7A7B`, Vân gỗ (tự sinh vân gỗ bằng canvas). Mái: Đỏ đô `#8B1E1E`, Xanh dương `#1F4E8C`, Xám ghi `#6B7280`, Trắng `#E5E7EB` – dạng ô màu tròn |
| Cửa | Cửa đi 1–4 (cửa nhôm Xingfa 0,9×2,2 m khung xám kính xanh nhạt / cửa panel cùng màu vách); cửa sổ 0–10 (1,2×1,2 m nhôm kính) |

**Mô hình 3D** (`assets/js/nha-3d.js`, Three.js 0.160.0 + OrbitControls):
- Đơn vị 1 = 1 mét. Nền đất hình tròn màu cỏ nhạt `#cfe3c0` nhận bóng; móng/sàn bê tông xám cao 0,15 m.
- Vách: 4 khối hộp có độ dày theo panel, **đường ron dọc mỗi 1 m** (khổ panel) vẽ bằng đường mảnh tối hơn màu vách; đầu hồi tam giác cho mái.
- Mái: tấm tôn dạng sóng (vân sóng bằng texture canvas) theo màu mái, có viền diềm.
- Cửa đi đặt đều ở mặt trước; cửa sổ chia đều mặt trước và 2 mặt bên, có khung + kính bán trong suốt.
- Ánh sáng: HemisphereLight + DirectionalLight có bóng đổ mềm. Camera tự canh khung theo kích thước nhà.
- Đổi tùy chọn → dựng lại mô hình mượt (không tải lại trang). Có nút Tự xoay (autoRotate).
- Renderer `alpha: true`, `preserveDrawingBuffer: true` để chụp ảnh nền trong suốt.
- Xuất các hàm: `khoiTao(khung)`, `capNhat(cauHinh)`, `datGocNhin('truoc'|'ben'|'tren')`, `batTuXoay(bool)`, `chupAnh({nenTrongSuot})` → dataURL PNG.

**Bảng kết quả** (công thức trong `thiet-ke-nha.js`, hằng số `KHO_PANEL = 1.0` m):
- Diện tích sàn = Dài × Rộng
- Diện tích cửa = số cửa đi × 0,9 × 2,2 + số cửa sổ × 1,2 × 1,2
- Đầu hồi: 2 mái = Rộng² × tan15° / 2; 1 mái = Rộng² × tan10° (2 mặt bên hình thang)
- Diện tích vách panel = 2 × (Dài + Rộng) × Cao + đầu hồi − diện tích cửa
- Diện tích mái = (Dài + 0,6) × (Rộng + 0,6) / cos(độ dốc)
- Số tấm panel ≈ làm tròn lên (Diện tích vách / (KHO_PANEL × Cao)) – ghi chú "ước tính"
- Thể tích ≈ Dài × Rộng × Cao
- Ô cuối: **Giá: Liên hệ** + nút "Gửi thiết kế để báo giá".
- Số hiển thị kiểu Việt Nam: `48,5 m²` (dấu phẩy thập phân); số thay đổi có hiệu ứng đếm.

**Chia sẻ thiết kế**: cấu hình là 1 object JSON → mã hóa base64 (an toàn tiếng Việt) → `thiet-ke-nha.html?tk=<mã>`. Mở trang có `?tk=` thì nạp đúng cấu hình. Admin dùng chính link này để "Xem 3D".

**Tab "Thử lên ảnh đất nhà bạn"** (`assets/js/thu-anh.js`): vùng kéo thả/nút "Chọn ảnh" (jpg/png) → ảnh hiện trong khung; ảnh chụp ngôi nhà 3D hiện tại (nền trong suốt, góc nhìn hiện tại) đặt lên giữa ảnh → kéo thả bằng chuột/ngón tay (pointer events); thanh trượt **Kích thước** và nút **Lật ngang**, **Chụp lại góc nhìn** (quay về tab 3D chỉnh góc rồi chụp lại); nút **Lưu ảnh ghép** (vẽ cả 2 lớp lên canvas, tải file `thiet-ke-tieu-nghia.jpg`). Ghi chú nhỏ: "Ảnh chỉ xử lý trên máy của bạn, không tải lên mạng".

**Tab "Gửi thiết kế để báo giá"**: tóm tắt cấu hình + ảnh chụp nhỏ + bảng kết quả (chỉ đọc) | form họ tên*, SĐT*, địa chỉ công trình, ghi chú → RPC `gui_thiet_ke_nha` → hộp thành công hiện **mã TK-xxxxx** + hotline.

## 9. Hiệu ứng chuyển động (`assets/js/hieu-ung.js` + CSS)

| Hiệu ứng | Mô tả |
|---|---|
| Màn hình chờ | Logo ở giữa phóng nhẹ + vòng tròn xoay; chỉ hiện **lần đầu vào web trong phiên** (sessionStorage), tối đa 1 giây, mờ dần |
| Banner | Ảnh phóng chậm (Ken Burns 20s), tiêu đề hiện từng dòng trượt lên, dòng chữ gõ tự động |
| Hiện dần khi cuộn | Phần tử có `data-hieu-ung="len|trai|phai|phong"` hiện dần khi vào màn hình (IntersectionObserver), các thẻ trong lưới hiện lần lượt cách nhau 80ms |
| Số đếm tăng | Phần tử `data-dem="10"` đếm từ 0 lên khi cuộn tới (1,5 giây) |
| Header | Thu nhỏ + nền mờ khi cuộn > 60px |
| Thẻ | Hover: nâng lên 6px, ảnh phóng 1.05 |
| Quy trình | Đường nối các bước chạy dần từ trái sang phải |
| Chuyển trang | Nội dung trang mờ dần vào khi tải |
| Giảm chuyển động | `@media (prefers-reduced-motion: reduce)` tắt toàn bộ |

## 10. Trang "Dành cho AI" (`ai.html`)
- **HTML tĩnh hoàn toàn**, không cần JavaScript để đọc nội dung (vẫn có header/footer chung).
- Phần đầu: tiêu đề "Website này đọc được bởi cả người và AI" + giải thích ngắn 3 lớp: `llms.txt`, dữ liệu schema.org, `sitemap.xml` – mỗi lớp 1 thẻ có biểu tượng.
- 3 nút: **"Hỏi ChatGPT về Tiếu Nghĩa"** (`https://chatgpt.com/?q=` + câu hỏi mã hóa URL), **"Hỏi Perplexity"** (`https://www.perplexity.ai/search?q=`), **"Xem llms.txt"**. Câu hỏi mẫu: "Đơn vị làm nhà lắp ráp panel và cửa nhôm Xingfa uy tín ở Tây Ninh?".
- Phần thân: "Thông tin công ty" dạng bảng định nghĩa · 6 nhóm dịch vụ · danh sách 15 sản phẩm có link · quy trình · câu hỏi thường gặp · liên hệ – tiếng Việt trước, tiếng Anh sau (tiêu đề "English summary").
- Kiểu chữ tài liệu, nền trắng, dễ đọc; không hiệu ứng.

## 11. Đa ngôn ngữ (Việt – Anh – Trung)

**Nút chọn ngôn ngữ** (trên thanh top bar, mọi trang khách):
- Dạng: chữ `Ngôn ngữ:` + nút `🇻🇳 Tiếng Việt ▾`. Bấm nút → danh sách xổ xuống mượt (fade + trượt 8px), 3 dòng: `🇻🇳 Tiếng Việt` · `🇬🇧 English` · `🇨🇳 中文`, dòng đang chọn có dấu ✓ và nền nhạt. Bấm ra ngoài hoặc phím Esc thì đóng. Dùng được bằng bàn phím (mũi tên lên/xuống, Enter) – có `aria-expanded`, `role="listbox"`.
- Chữ "Ngôn ngữ:" đổi theo ngôn ngữ: `Ngôn ngữ:` / `Language:` / `语言：`.
- Điện thoại: top bar vẫn hiện nút ngôn ngữ (chỉ cờ + mã: `🇻🇳 VI ▾`), menu ☰ có thêm mục chọn ngôn ngữ ở cuối.
- Đổi ngôn ngữ: nội dung mờ nhẹ 150ms rồi hiện chữ mới (không tải lại trang).

**Cách làm kỹ thuật** (`assets/js/ngon-ngu.js` + `assets/lang/`):
- `assets/lang/vi.js`, `en.js`, `zh.js`: mỗi file 1 object khóa → chữ, nhóm theo trang (`chung.*`, `menu.*`, `trangChu.*`, `thietKe.*`, `troLy.*`, `loi.*`…). Ví dụ `"menu.sanPham": "Sản phẩm"` / `"Products"` / `"产品"`.
- Thứ tự chọn ngôn ngữ: `?lang=` trên URL → localStorage `ngon_ngu` → ngôn ngữ trình duyệt (en*, zh*) → mặc định `vi`.
- Hàm dùng chung: `t(khoa, thamSo)` lấy chữ (thiếu khóa thì dùng tiếng Việt); `apDungNgonNgu()` quét `data-i18n`, `data-i18n-placeholder`, `data-i18n-title`, `data-i18n-alt`; `tuDB(dong, 'ten')` trả `dong.ten_en`/`dong.ten_zh` theo ngôn ngữ, trống thì `dong.ten`; `dinhDangSo()`, `dinhDangNgay()` theo locale.
- Đổi ngôn ngữ phát sự kiện `doi-ngon-ngu` → mỗi trang lắng nghe để vẽ lại phần lấy từ database, trợ lý, nhãn mô hình 3D, biểu đồ.
- Đổi `<html lang="vi|en|zh-CN">` và `document.title`.
- Giá "Liên hệ" → `Contact for quote` / `欢迎咨询报价`. Bảo hành dùng cột `bao_hanh_en/zh`.

## 12. Responsive
- Điểm ngắt: 1024px, 768px, 480px.
- Không có thanh cuộn ngang trên điện thoại; bảng dài cuộn ngang trong khung riêng.
- Khung 3D và bản đồ hỗ trợ vuốt/chụm 2 ngón trên điện thoại.
