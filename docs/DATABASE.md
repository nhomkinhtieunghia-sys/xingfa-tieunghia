# DATABASE – Cơ sở dữ liệu Supabase

> **File này dùng để làm gì?** Mô tả các bảng dữ liệu, ý nghĩa từng cột, ai được xem/thêm/sửa/xóa, các hàm RPC và cách code JavaScript gọi database. AI agent đọc để viết code truy vấn đúng tên bảng, tên cột.

- Hệ quản trị: **Supabase** (PostgreSQL online, gói miễn phí).
- Tạo bảng: chạy `database/schema.sql` trong Supabase → SQL Editor (chạy lại nhiều lần vẫn an toàn).
- Kho ảnh: chạy `database/storage.sql`.
- Dữ liệu mẫu: chạy tiếp `database/seed.sql` **1 lần** (15 sản phẩm, 10 công trình minh họa, 3 đánh giá thật, 3 bài viết mẫu, bản dịch Anh/Trung).
- Đã chạy thử toàn bộ SQL + các hàm RPC trên PostgreSQL 16: không lỗi.

---

## 1. Sơ đồ (8 bảng + kho ảnh + hàm dịch AI)

```
san_pham ───< (được chọn trong) yeu_cau_bao_gia.danh_sach (JSON)
thiet_ke_nha                     (thiết kế nhà panel 3D khách gửi)
lich_khao_sat (1) ───< tien_do (nhiều bước tiến độ của 1 lịch/công trình)
cong_trinh                       (ghim trên bản đồ)
danh_gia                         (đánh giá của khách, cần duyệt)
bai_viet                         (tin tức / bài viết 3 ngôn ngữ)
Storage: kho ảnh 'anh-web'       (ảnh bài viết, sản phẩm, công trình admin tải lên)
Edge Function: dich-ai           (nút Dịch bằng AI – gọi Gemini)
```

## 2. Bảng `san_pham` – Sản phẩm

| Cột | Kiểu | Ý nghĩa |
|---|---|---|
| `id` | bigint, tự tăng | Mã sản phẩm (dùng trong `chi-tiet.html?id=`) |
| `ten` | text, bắt buộc | Tên mẫu |
| `nhom` | text, bắt buộc | `cua-sat`, `cua-nhom`, `nha-panel`, `tu-bep`, `mai-che`, `bao-tri` |
| `mo_ta_ngan` | text | 1–2 câu hiện trên thẻ |
| `mo_ta_chi_tiet` | text | Mô tả đầy đủ |
| `vat_lieu` | text | Vật liệu chính |
| `uu_diem` | text | Ưu điểm, phân tách bằng `;` |
| `bao_hanh` | text | Ghi chung, không nêu số năm |
| `gia` | text, mặc định `Liên hệ` | |
| `hinh_anh` | text | vd `assets/images/cua-sat.jpg` |
| `noi_bat` | boolean | `true` = hiện ở Trang chủ |
| `thu_tu` | int | Thứ tự sắp xếp |
| `created_at` | timestamptz | |
| `ten_en`, `ten_zh`, `mo_ta_ngan_en/_zh`, `mo_ta_chi_tiet_en/_zh`, `vat_lieu_en/_zh`, `uu_diem_en/_zh`, `bao_hanh_en/_zh` | text | **Bản dịch** tiếng Anh / tiếng Trung giản thể (seed đã dịch sẵn 15 sản phẩm) |

Tên nhóm hiển thị (dùng chung cho `san_pham.nhom`, `cong_trinh.hang_muc`, `danh_gia.dich_vu`, `lich_khao_sat.dich_vu`):

| Mã | Tên hiển thị |
|---|---|
| `cua-sat` | Cửa sắt – Cổng – Lan can |
| `cua-nhom` | Cửa nhôm Xingfa |
| `nha-panel` | Nhà lắp ráp panel |
| `tu-bep` | Tủ bếp & nội thất nhôm |
| `mai-che` | Mái che hiện đại |
| `bao-tri` | Bảo trì & sửa chữa |

## 3. Bảng `yeu_cau_bao_gia` – Yêu cầu báo giá từ giỏ

| Cột | Kiểu | Ý nghĩa |
|---|---|---|
| `id` | bigint | |
| `ho_ten`, `so_dien_thoai` | text, bắt buộc | SĐT 10 số bắt đầu bằng 0 |
| `email`, `dia_chi`, `ghi_chu` | text | |
| `danh_sach` | jsonb, bắt buộc | `[{ "id": 3, "ten": "...", "so_luong": 2, "kich_thuoc": "1m2 x 2m4" }]` |
| `trang_thai` | text | `moi` → `da_lien_he` → `da_bao_gia` → `hoan_tat` |
| `created_at` | timestamptz | |

## 4. Bảng `thiet_ke_nha` – Thiết kế nhà panel 3D gửi báo giá

| Cột | Kiểu | Ý nghĩa |
|---|---|---|
| `id` | bigint | |
| `ma_thiet_ke` | text, duy nhất | vd `TK-04821` (hàm RPC tự sinh) |
| `ho_ten`, `so_dien_thoai` | text, bắt buộc | |
| `dia_chi`, `ghi_chu` | text | |
| `cau_hinh` | jsonb, bắt buộc | Xem mẫu bên dưới |
| `ket_qua` | jsonb | Kết quả tính toán |
| `trang_thai` | text | `moi` / `da_lien_he` / `da_bao_gia` / `hoan_tat` |
| `created_at` | timestamptz | |

```json
// cau_hinh
{ "cong_nang": "nha-o", "dai": 8, "rong": 5, "cao": 3.2,
  "loai_panel": "PU", "do_day": 75, "kieu_mai": "2-mai",
  "mau_vach": "trang-kem", "mau_mai": "do-do",
  "so_cua_di": 2, "loai_cua": "nhom-xingfa", "so_cua_so": 4 }
// ket_qua
{ "dien_tich_san": 40, "dien_tich_vach": 78.6, "dien_tich_mai": 46.9,
  "so_tam_panel": 25, "the_tich": 128 }
```

## 5. Bảng `lich_khao_sat` – Lịch khảo sát & công trình

| Cột | Kiểu | Ý nghĩa |
|---|---|---|
| `id` | bigint | |
| `ma_lich` | text, duy nhất | vd `TN-4821` – khách dùng để tra cứu tiến độ |
| `ho_ten`, `so_dien_thoai`, `dia_chi_cong_trinh` | text, bắt buộc | |
| `dich_vu` | text | Mã nhóm |
| `ngay_hen` | date, bắt buộc | Không ở quá khứ |
| `buoi` | text | `sang` (8h–11h) / `chieu` (13h–17h) |
| `ghi_chu` | text | |
| `trang_thai` | text | **Bước tiến độ hiện tại** (bảng dưới) |
| `created_at`, `updated_at` | timestamptz | |

Các bước tiến độ (dùng chung cho `lich_khao_sat.trang_thai` và `tien_do.buoc`):

| Mã | Tên hiển thị | Khách được đổi/hủy? |
|---|---|---|
| `cho_xac_nhan` | Chờ xác nhận | ✅ |
| `da_xac_nhan` | Đã xác nhận lịch | ✅ |
| `da_khao_sat` | Đã khảo sát đo đạc | ❌ |
| `da_bao_gia` | Đã báo giá | ❌ |
| `dang_gia_cong` | Đang gia công tại xưởng | ❌ |
| `dang_lap_dat` | Đang lắp đặt | ❌ |
| `hoan_thanh` | Hoàn thành – bàn giao | ❌ |
| `da_huy` | Đã hủy | ❌ |

## 6. Bảng `tien_do` – Nhật ký tiến độ

| Cột | Kiểu | Ý nghĩa |
|---|---|---|
| `id` | bigint | |
| `lich_id` | bigint → `lich_khao_sat.id` | Xóa lịch thì xóa luôn tiến độ |
| `buoc` | text | Mã bước (bảng trên) |
| `ghi_chu` | text | vd "Đã đo đạc, khách chọn panel PU 75mm" |
| `created_at` | timestamptz | Thời điểm cập nhật |

> Admin cập nhật tiến độ = **UPDATE** `lich_khao_sat.trang_thai` + **INSERT** 1 dòng `tien_do`.

## 7. Bảng `cong_trinh` – Công trình trên bản đồ

| Cột | Kiểu | Ý nghĩa |
|---|---|---|
| `id` | bigint | |
| `ten` | text | Tên công trình |
| `hang_muc` | text | Mã nhóm |
| `dia_diem` | text | vd "Khu vực Đức Hòa, Tây Ninh" |
| `vi_do`, `kinh_do` | double | Tọa độ ghim (latitude, longitude) |
| `nam` | int | Năm thi công |
| `mo_ta` | text | |
| `hinh_anh` | text | Đường dẫn ảnh |
| `thu_tu` | int | |
| `ten_en/_zh`, `dia_diem_en/_zh`, `mo_ta_en/_zh` | text | Bản dịch (seed đã dịch sẵn 10 công trình) |

## 8. Bảng `danh_gia` – Đánh giá khách hàng

| Cột | Kiểu | Ý nghĩa |
|---|---|---|
| `id` | bigint | |
| `ho_ten` | text, bắt buộc | |
| `so_sao` | int 1–5 | |
| `noi_dung` | text, ≥ 10 ký tự | |
| `dich_vu` | text | Mã nhóm khách chọn (không bắt buộc) |
| `anh_minh_hoa` | text | Ảnh đại diện AI tạo (không phải ảnh thật) |
| `da_duyet` | boolean, mặc định `false` | Chỉ hiện lên web khi `true` |
| `created_at` | timestamptz | |

> **Cột `ngon_ngu`** (`vi` / `en` / `zh`, mặc định `vi`) có ở 4 bảng `yeu_cau_bao_gia`, `thiet_ke_nha`, `lich_khao_sat`, `danh_gia` – ghi ngôn ngữ khách đang dùng khi gửi, để công ty biết trả lời bằng tiếng gì. Admin hiện cờ 🇻🇳/🇬🇧/🇨🇳.
>
> **Quy tắc đa ngôn ngữ:** cột gốc không hậu tố là tiếng Việt; web lấy cột `_en`/`_zh` theo ngôn ngữ đang chọn, trống thì dùng tiếng Việt (hàm `tuDB`).

## 8b. Bảng `bai_viet` – Tin tức / bài viết

| Cột | Kiểu | Ý nghĩa |
|---|---|---|
| `id` | bigint | |
| `slug` | text, duy nhất | Đường dẫn không dấu: `bai-viet.html?bai=nha-panel-eps-hay-pu` (chỉ chữ thường, số, dấu gạch) |
| `chuyen_muc` | text | `kien-thuc` (Kiến thức) · `tin-cong-ty` (Tin công ty) · `cong-trinh` (Công trình) |
| `tieu_de`, `tieu_de_en`, `tieu_de_zh` | text | Tiêu đề 3 ngôn ngữ (tiếng Việt bắt buộc) |
| `tom_tat`, `tom_tat_en`, `tom_tat_zh` | text | Tóm tắt 1–2 câu |
| `noi_dung`, `noi_dung_en`, `noi_dung_zh` | text | Nội dung **Markdown** (tiếng Việt bắt buộc) |
| `anh_dai_dien` | text | `assets/images/...` hoặc link ảnh Storage |
| `da_dang` | boolean | `false` = nháp (khách không thấy) |
| `noi_bat` | boolean | Hiện to ở đầu trang Tin tức |
| `luot_xem` | int | Tăng qua RPC `tang_luot_xem` |
| `ngay_dang` | date | |
| `created_at`, `updated_at` | timestamptz | |

Seed có 3 bài mẫu **chỉ tiếng Việt** – dùng để trình diễn nút Dịch bằng AI.

## 8c. Kho ảnh Supabase Storage – `anh-web`
- Tạo bằng `database/storage.sql` (chạy sau schema.sql). Kho **công khai xem**, chỉ admin đăng nhập được tải lên/sửa/xóa.
- Đặt tên file: `bai-viet/<slug>-<thời gian>.jpg`, `san-pham/...`, `cong-trinh/...`. Trước khi tải lên, nén ảnh trên trình duyệt (canvas) còn tối đa 1600px, JPEG 0.82.

```js
const duongDan = `bai-viet/${slug}-${Date.now()}.jpg`;
await db.storage.from("anh-web").upload(duongDan, file, { contentType: "image/jpeg" });
const { data } = db.storage.from("anh-web").getPublicUrl(duongDan);   // data.publicUrl → lưu vào anh_dai_dien
```

## 8d. Edge Function `dich-ai` – nút "Dịch bằng AI"

| Mục | Nội dung |
|---|---|
| File trong repo | `supabase/functions/dich-ai/index.ts` (Deno, TypeScript) – lưu trong repo để thầy xem; triển khai bằng cách dán vào Supabase Dashboard → Edge Functions |
| Ai được gọi | Chỉ admin đã đăng nhập (giữ mặc định **Verify JWT = bật**) |
| Secrets (Supabase → Edge Functions → Secrets) | `GEMINI_API_KEY` (khóa lấy ở aistudio.google.com) · `GEMINI_MODEL` (tên model Gemini "flash" mới nhất đang hiện trong AI Studio, vd `gemini-2.5-flash`) |
| Đầu vào | `{ "van_ban": { "tieu_de": "...", "tom_tat": "...", "noi_dung": "..." } }` – tên khóa tùy form (sản phẩm: `ten`, `mo_ta_ngan`, `mo_ta_chi_tiet`, `vat_lieu`, `uu_diem`...) |
| Đầu ra | `{ "en": { cùng khóa }, "zh": { cùng khóa } }` |
| Gọi Gemini | `POST https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`, header `x-goog-api-key`, `generationConfig: { responseMimeType: "application/json", temperature: 0.2 }` |
| Hướng dẫn cho Gemini | Dịch tiếng Việt → tiếng Anh và tiếng Trung **giản thể**; văn phong doanh nghiệp xây dựng; **giữ nguyên Markdown**, tên riêng "Xingfa Tiếu Nghĩa", số điện thoại, địa chỉ; bảng thuật ngữ: nhôm Xingfa → Xingfa aluminium / 兴发铝合金, panel EPS/PU → EPS/PU sandwich panel / EPS/PU夹芯板, nhà lắp ráp → prefab house / 装配式房屋, cửa kính cường lực → tempered glass door / 钢化玻璃门, "Liên hệ" → Contact for quote / 欢迎咨询报价; **không thêm thông tin**; giữ dấu `;` ngăn cách ưu điểm; chỉ trả về JSON |
| CORS | Trả header `Access-Control-Allow-Origin: *`, xử lý request `OPTIONS` |
| Lỗi | 401 chưa đăng nhập · 429 hết lượt miễn phí ("Hết lượt dịch miễn phí, vui lòng thử lại sau ít phút") · 500 lỗi khác – trả `{ "loi": "..." }` tiếng Việt |
| Giới hạn | Mỗi lần gửi tối đa ~20.000 ký tự; bài dài hơn thì báo chia nhỏ |

```js
// admin.js – gọi hàm dịch (thư viện tự gửi kèm token đăng nhập)
const { data, error } = await db.functions.invoke("dich-ai", { body: { van_ban: { tieu_de, tom_tat, noi_dung } } });
// data.en.tieu_de, data.zh.noi_dung ...
```

## 9. Phân quyền (Row Level Security)

| Bảng | Khách (anon) | Admin (authenticated) |
|---|---|---|
| `san_pham` | Xem | Toàn quyền |
| `yeu_cau_bao_gia` | Chỉ thêm | Toàn quyền |
| `thiet_ke_nha` | Chỉ qua RPC `gui_thiet_ke_nha` | Toàn quyền |
| `lich_khao_sat`, `tien_do` | Chỉ qua 4 RPC lịch | Toàn quyền |
| `cong_trinh` | Xem | Toàn quyền |
| `danh_gia` | Xem **đánh giá đã duyệt**; thêm mới (bắt buộc `da_duyet = false`) | Toàn quyền |
| `bai_viet` | Xem **bài đã đăng**; tăng lượt xem qua RPC | Toàn quyền (kể cả nháp) |
| Storage `anh-web` | Xem ảnh | Tải lên, sửa, xóa |

**Vì sao dùng hàm RPC?** Để khách chỉ xem/sửa/hủy được **lịch của chính mình** (đúng cả mã + SĐT), không xem được dữ liệu người khác; và để database tự sinh mã TN-/TK-.

| Hàm RPC | Tham số | Kết quả |
|---|---|---|
| `dat_lich_khao_sat` | `p_ho_ten, p_so_dien_thoai, p_dia_chi, p_dich_vu, p_ngay_hen, p_buoi, p_ghi_chu, p_ngon_ngu` | `ma_lich` (INSERT lịch + bước tiến độ đầu) |
| `tra_cuu_lich` | `p_ma_lich, p_so_dien_thoai` | JSON `{ lich: {...}, tien_do: [{buoc, ghi_chu, thoi_gian}] }`, sai mã/SĐT → `null` |
| `doi_lich` | `p_ma_lich, p_so_dien_thoai, p_ngay_hen, p_buoi, p_ghi_chu` | `true`/`false` (UPDATE + ghi tiến độ) |
| `huy_lich` | `p_ma_lich, p_so_dien_thoai` | `true`/`false` (UPDATE trạng thái `da_huy`) |
| `gui_thiet_ke_nha` | `p_ho_ten, p_so_dien_thoai, p_dia_chi, p_ghi_chu, p_cau_hinh, p_ket_qua, p_ngon_ngu` | `ma_thiet_ke` (INSERT) |
| `tang_luot_xem` | `p_slug` | Tăng 1 lượt xem bài đã đăng (UPDATE) |

## 10. Mẫu code JavaScript

```js
// assets/js/config.js
const SUPABASE_URL = "https://xxxx.supabase.co";
const SUPABASE_ANON_KEY = "eyJ...";   // khóa anon / publishable, được phép để trên web
const db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Đọc sản phẩm theo nhóm
const { data, error } = await db.from("san_pham").select("*").eq("nhom", "cua-nhom").order("thu_tu");
// Hiển thị theo ngôn ngữ đang chọn (ngon-ngu.js)
the.textContent = tuDB(sp, "ten");   // sp.ten_en / sp.ten_zh / sp.ten
const ngonNgu = layNgonNgu();          // 'vi' | 'en' | 'zh' – gửi kèm mọi INSERT/RPC

// Gửi yêu cầu báo giá (INSERT) – không gọi .select() vì khách không có quyền đọc lại
await db.from("yeu_cau_bao_gia").insert({ ho_ten, so_dien_thoai, email, dia_chi, ghi_chu, danh_sach: gio, ngon_ngu: ngonNgu });

// Gửi đánh giá (INSERT)
await db.from("danh_gia").insert({ ho_ten, so_sao, noi_dung, dich_vu, ngon_ngu: ngonNgu });

// Đánh giá đã duyệt
await db.from("danh_gia").select("*").order("created_at", { ascending: false });

// Đặt lịch / tra cứu tiến độ (RPC)
const { data: ma } = await db.rpc("dat_lich_khao_sat", { p_ho_ten, p_so_dien_thoai, p_dia_chi, p_dich_vu, p_ngay_hen, p_buoi, p_ghi_chu, p_ngon_ngu: ngonNgu });
const { data: kq } = await db.rpc("tra_cuu_lich", { p_ma_lich, p_so_dien_thoai }); // kq.lich, kq.tien_do

// Gửi thiết kế 3D (RPC)
const { data: maTK } = await db.rpc("gui_thiet_ke_nha", { p_ho_ten, p_so_dien_thoai, p_dia_chi, p_ghi_chu, p_cau_hinh: cauHinh, p_ket_qua: ketQua, p_ngon_ngu: ngonNgu });

// Admin cập nhật tiến độ
await db.from("lich_khao_sat").update({ trang_thai: buoc, updated_at: new Date().toISOString() }).eq("id", lichId);
await db.from("tien_do").insert({ lich_id: lichId, buoc, ghi_chu });

// Admin đăng nhập
await db.auth.signInWithPassword({ email, password });
```

> **Lưu ý bảo mật:** chỉ dùng khóa **anon / publishable** trên web. Tuyệt đối **không** đưa khóa `service_role` / `secret` vào code hay lên Github.
