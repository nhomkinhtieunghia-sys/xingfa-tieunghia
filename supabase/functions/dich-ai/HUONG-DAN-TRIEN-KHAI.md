# Triển khai hàm `dich-ai` (nút "🌐 Dịch bằng AI")

Hàm này chạy trên máy chủ Supabase, giữ khóa Gemini bí mật. Trang web **không** chứa khóa.

## 1. Lấy khóa Gemini (miễn phí)
1. Vào https://aistudio.google.com → đăng nhập Google → **Get API key** → **Create API key** → chép khóa (dạng `AIza...`).
2. **Không gắn thẻ thanh toán** → dùng gói miễn phí, không bao giờ bị trừ tiền (hết lượt thì báo "thử lại sau").
3. Ghi lại tên model "Flash" đang hiện trong AI Studio, ví dụ `gemini-2.5-flash`.

## 2. Dán code lên Supabase
1. Supabase Dashboard → dự án `xingfa-tieunghia` → menu trái **Edge Functions**.
2. **Deploy a new function** → **Via Editor**.
3. Đặt tên đúng **`dich-ai`** (gõ thường, có gạch ngang).
4. Xóa code mẫu → mở file `supabase/functions/dich-ai/index.ts` trong dự án → chép toàn bộ → dán vào → **Deploy function**.
5. Giữ **Verify JWT** = bật (chỉ admin đã đăng nhập mới gọi được).

## 3. Thêm 2 Secrets
**Edge Functions → Secrets** (hoặc Project Settings → Edge Functions → Secrets) → **Add new secret**:

| Name | Value |
|---|---|
| `GEMINI_API_KEY` | khóa vừa lấy ở bước 1 |
| `GEMINI_MODEL` | tên model, vd `gemini-2.5-flash` |

Bấm **Save**. Không cần deploy lại hàm.

## 4. Thử
1. Mở `admin.html` → đăng nhập → tab **Bài viết** → **Sửa** bài mẫu.
2. Bấm **✨ 🌐 Dịch bằng AI** → chờ vài giây → tab 🇬🇧 EN và 🇨🇳 中文 tự có chữ → đọc lại → **Đăng bài**.
3. Ra trang **Tin tức**, chọn ngôn ngữ 中文 → bài hiện tiếng Trung.

## Lỗi thường gặp
| Thông báo | Cách xử lý |
|---|---|
| "Chưa cấu hình khóa Gemini / chưa triển khai hàm dich-ai" | Chưa deploy hàm tên `dich-ai` hoặc chưa thêm Secret `GEMINI_API_KEY` |
| "Khóa Gemini không hợp lệ" | Chép lại khóa ở AI Studio, sửa Secret |
| "Gemini báo lỗi (404)" | Tên model sai → sửa Secret `GEMINI_MODEL` theo tên đang có trong AI Studio |
| "Hết lượt dịch miễn phí" | Đợi vài phút rồi bấm lại |
| "Bạn cần đăng nhập" | Đăng nhập lại trang Quản trị |

> ⚠️ Không dán khóa `AIza...` vào bất kỳ file nào trong dự án / Github.
