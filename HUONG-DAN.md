# HƯỚNG DẪN TỪNG BƯỚC – Từ tạo tài khoản đến nộp bài

> Hạn nộp: **17/10/2026**. Nên xong trước **16/10** để còn thời gian sửa.

| Ngày | Việc |
|---|---|
| 10/10 | Bước 1–3: Supabase, database |
| 11/10 | Prompt 1 → 7 (phần bắt buộc của thầy) → **đưa lên Github + deploy ngay 1 bản** (Bước 5–6) cho chắc điểm |
| 12–13/10 | Prompt 8 → 12 (3D, thử ảnh, công trình, trợ lý) |
| 14/10 | Prompt 13 → 17 (quản trị, thống kê, tin tức, nút Dịch bằng AI) + Bước 3b (khóa Gemini) |
| 15/10 | Prompt 18 → 21 (3 ngôn ngữ, lớp cho AI, kiểm tra), push lại, kiểm tra trên điện thoại |
| 16/10 | Bước 7: điền kết quả prompt, chụp màn hình, hoàn thiện `BAO-CAO.md` |
| 17/10 | Gửi 2 link cho thầy |

---

## Bước 1 – Tài khoản Github
Đã có tài khoản Github mới. Username nằm trong link web: `https://nhomkinhtieunghia-sys.github.io/...`

## Bước 2 – Tạo tài khoản & dự án Supabase
1. Vào https://supabase.com → **Start your project** → đăng nhập bằng tài khoản Github.
2. **New project**: tên `xingfa-tieunghia`, đặt mật khẩu database (ghi lại), Region: **Southeast Asia (Singapore)** → Create.
3. Chờ 1–2 phút cho dự án khởi tạo xong.

## Bước 3 – Tạo database
1. Menu trái → **SQL Editor** → **New query**.
2. Mở `database/schema.sql`, chép toàn bộ, dán vào → **Run**. Thấy "Success" là được.
3. New query → dán toàn bộ `database/storage.sql` → **Run** (tạo kho ảnh `anh-web`).
4. New query → dán toàn bộ `database/seed.sql` → **Run** (**chỉ chạy 1 lần**).
5. **Table Editor** kiểm tra: `san_pham` **15 dòng**, `cong_trinh` **10 dòng**, `danh_gia` **3 dòng**, `bai_viet` **3 dòng**; các bảng `yeu_cau_bao_gia`, `thiet_ke_nha`, `lich_khao_sat`, `tien_do` trống.
6. Tạo tài khoản admin: **Authentication → Users → Add user → Create new user** → email + mật khẩu, tích **Auto Confirm User**.
7. Lấy khóa: **Project Settings → API (Data API / API Keys)**, chép:
   - **Project URL** (dạng `https://abcxyz.supabase.co`)
   - **anon public key** (hoặc **Publishable key** `sb_publishable_...`)
   ⚠️ **Không** dùng khóa `service_role` / `secret`.

## Bước 3b – Lấy khóa Gemini miễn phí & bật nút "Dịch bằng AI" (làm khi tới Prompt 17)
**Lấy khóa:**
1. Vào https://aistudio.google.com → đăng nhập tài khoản Google.
2. Bấm **Get API key** → **Create API key** → chép khóa (dạng `AIza...`). **Không** gửi khóa này cho ai, **không** dán vào code web.
3. **Không gắn thẻ thanh toán** → dùng gói miễn phí, không bao giờ bị trừ tiền (hết lượt thì chỉ báo "thử lại sau").
4. Ghi lại tên model "Flash" mới nhất đang hiện trong AI Studio (vd `gemini-2.5-flash`).

**Cài hàm dịch lên Supabase** (sau khi Antigravity làm xong Prompt 17, có file `supabase/functions/dich-ai/index.ts`):
1. Supabase → menu trái **Edge Functions** → **Deploy a new function** → **Via Editor**.
2. Đặt tên đúng **`dich-ai`** → xóa code mẫu → dán toàn bộ nội dung `index.ts` → **Deploy function**. Giữ **Verify JWT: bật**.
3. **Edge Functions → Secrets** (hoặc Project Settings → Edge Functions) → **Add new secret**:
   - `GEMINI_API_KEY` = khóa vừa lấy
   - `GEMINI_MODEL` = tên model (vd `gemini-2.5-flash`)
4. Thử: đăng nhập `admin.html` → tab Bài viết → mở bài mẫu → bấm **🌐 Dịch bằng AI** → ô EN, 中文 tự điền → Lưu → ra trang Tin tức chọn 中文 xem bài.

## Bước 4 – Làm web bằng Antigravity
> Trước khi mở Antigravity: **xóa thư mục trống `xingfa-tieunghia`** và **thư mục `_to_delete`** (ảnh gốc dung lượng lớn, không cần nữa). Ảnh dùng cho web đã có sẵn trong `assets/images/`.

1. Mở thư mục **BAI KIỂM TRA CUỐI KHÓA** trong Antigravity (đây là thư mục dự án).
2. Dán lần lượt **Prompt 1 → 21** trong `docs/PROMPTS.md`. Đến Prompt 4 thì dán URL + khóa ở Bước 3.7.
3. Sau mỗi prompt: mở bằng **Live Server**, kiểm tra, **ghi kết quả vào PROMPTS.md + chụp màn hình** vào `docs/hinh-chup/`.
4. Prompt dài/khó (8, 10, 12) nếu AI làm chưa đúng: gõ prompt phụ mô tả cụ thể chỗ sai, vd *"Mái nhà 2 mái đang bị lệch, sửa lại cho đỉnh mái nằm giữa chiều rộng"*.

## Bước 5 – Đưa code lên Github (chế độ Public)
1. Github → nút **+** → **New repository** → tên `xingfa-tieunghia` → **Public** → Create.
2. Nhờ Antigravity:
   ```
   Hãy khởi tạo git cho dự án này và push toàn bộ code lên https://github.com/nhomkinhtieunghia-sys/xingfa-tieunghia.git nhánh main.
   ```
   Các lần sau chỉ cần: `Hãy commit và push các thay đổi mới lên Github.`
3. Cách thủ công: trang repo → **Add file → Upload files** → kéo thả → **Commit changes**.

## Bước 6 – Deploy lên Github Pages
1. Repo → **Settings → Pages** → **Source: Deploy from a branch** → **main** / **(root)** → **Save**.
2. Chờ 1–3 phút → link `https://nhomkinhtieunghia-sys.github.io/xingfa-tieunghia/`.
3. Mở link, thử hết chức năng (cả trên điện thoại).

## Bước 7 – Kiểm tra trước khi nộp (đối chiếu đề)
- [ ] Đủ Trang chủ, Giới thiệu, Chi tiết (và 6 trang khác) – **bấm menu chuyển qua lại được hết** (thiếu bị -0,5)
- [ ] Logo thật, **giống nhau** ở mọi trang (sai bị -0,5)
- [ ] Sản phẩm hiện 15 mẫu từ Supabase; trang chủ hiện 3 đánh giá
- [ ] Gửi báo giá → thấy dòng mới trong `yeu_cau_bao_gia`
- [ ] Thiết kế 3D: đổi tùy chọn mô hình đổi theo; chụp ảnh; chia sẻ link; gửi thiết kế → có mã TK
- [ ] Thử lên ảnh: tải ảnh, kéo nhà, lưu ảnh ghép được (thử cả trên điện thoại)
- [ ] Đặt lịch → nhận mã; tra cứu thấy dòng thời gian; đổi, hủy được
- [ ] Admin cập nhật tiến độ → tra cứu lại thấy bước mới
- [ ] Gửi đánh giá → admin duyệt → hiện lên web
- [ ] Bản đồ công trình hiện 10 ghim; trợ lý tư vấn trả lời và gợi ý sản phẩm
- [ ] Admin: thêm, sửa, xóa sản phẩm/công trình; tab Tổng quan có biểu đồ
- [ ] Google Maps hiện đúng 12 Ấp An Thuận
- [ ] Nút **Ngôn ngữ** đầu trang: chọn English / 中文 → toàn trang đổi, sản phẩm đổi tên, trợ lý nói đúng tiếng; chuyển trang vẫn giữ ngôn ngữ
- [ ] Trang Tin tức hiện 3 bài; mở chi tiết bài, lượt xem tăng; admin viết bài mới, tải ảnh lên, Lưu nháp / Đăng được
- [ ] Nút **Dịch bằng AI** điền đúng tiếng Anh, tiếng Trung; khách chọn 中文 thấy bài tiếng Trung
- [ ] Khóa Gemini **không** xuất hiện trong code web / Github (tìm thử chữ `AIza` trong repo)
- [ ] Mở `.../llms.txt`, `.../robots.txt`, `.../sitemap.xml`, `ai.html` đều xem được; tắt JavaScript trang chủ vẫn đọc được
- [ ] Repo **Public** (mở bằng trình duyệt ẩn danh vẫn xem được)
- [ ] Đã điền đủ **Kết quả** Prompt 1→21 trong `docs/PROMPTS.md` và `BAO-CAO.md`; địa chỉ web đã điền sẵn theo tài khoản Github `nhomkinhtieunghia-sys`
- [ ] Xóa dữ liệu thử của Claude (tên "TEST Claude kiem tra", SĐT 0900000000) trong trang Quản trị: 1 yêu cầu báo giá, 1 thiết kế TK-49062, lịch TN-3287 (đã hủy)
- [ ] `BAO-CAO.md` có ảnh chụp màn hình (muốn thì xuất thêm `.pdf`)

## Bước 8 – Nộp bài (Giai đoạn 3)
Gửi đúng **2 link** cho thầy:
```
Trương Thị Mai – Đồ án cuối khóa: Website Xingfa Tiếu Nghĩa
1. Github: https://github.com/nhomkinhtieunghia-sys/xingfa-tieunghia
2. Deploy: https://nhomkinhtieunghia-sys.github.io/xingfa-tieunghia/
```


---

## Giai đoạn 4 – Đưa lên xingfatieunghia.com để chạy thật (sau khi nộp bài)

> Github Pages là bản **nộp thầy**. Bản **chạy thật** đặt trên hosting của công ty. Cùng 1 bộ code, không phải viết lại.

1. **Thư mục:** đặt website mới vào **thư mục con**, ví dụ `public_html/thiet-ke-nha/` → địa chỉ `https://xingfatieunghia.com/thiet-ke-nha/` (giống cách đã làm app nhắc học). **Không thay trang chủ WordPress** để giữ thứ hạng Google của các trang cũ.
2. **Tải code lên:** hosting → Quản lý file (File Manager) hoặc FTP → tải toàn bộ file trong repo (trừ thư mục `.git`) vào thư mục trên.
3. **Đổi địa chỉ web** (1 chỗ trong `assets/js/config.js` → `DIA_CHI_WEB`) và trong `sitemap.xml`, `llms.txt`, `llms-full.txt`, `robots.txt` thành `https://xingfatieunghia.com/thiet-ke-nha/`. Có thể nhờ Antigravity: *"Đổi toàn bộ địa chỉ web gốc từ Github Pages sang https://xingfatieunghia.com/thiet-ke-nha/"*.
4. **Lớp cho AI phải nằm ở gốc tên miền** mới có tác dụng: đặt `llms.txt` ở `https://xingfatieunghia.com/llms.txt` (mô tả cả các trang WordPress lẫn trang mới); bổ sung vào `robots.txt` gốc của WordPress dòng cho phép bot AI và dòng `Sitemap:` của web mới (hoặc dùng plugin SEO). Phần này nhờ Claude soạn bản riêng khi làm.
5. **Dữ liệu thật:** đăng bài viết mới ở tab Bài viết (viết tiếng Việt → Dịch bằng AI → xem lại → Đăng); vào trang Quản trị, thay 10 công trình minh họa bằng công trình thật (ảnh thật, vị trí thật), xóa dữ liệu thử (yêu cầu, lịch, thiết kế, đánh giá test); khi đã có công trình thật thì bỏ dòng chú thích "đang cập nhật".
6. **Liên kết từ WordPress:** thêm mục menu "Thiết kế nhà 3D" và nút trên trang chủ WordPress trỏ tới web mới.
7. **Supabase gói miễn phí** tạm dừng nếu 7 ngày không có truy cập → web có khách vào thường xuyên thì không sao; nếu bị dừng vào supabase.com bấm **Restore**. Kinh doanh lâu dài cân nhắc gói trả phí.
8. **Bảo mật:** đổi mật khẩu admin mạnh; chỉ dùng khóa anon/publishable trên web.
9. Khai báo `sitemap.xml` với **Google Search Console** để Google (và AI dựa trên Google) tìm thấy nhanh hơn.
