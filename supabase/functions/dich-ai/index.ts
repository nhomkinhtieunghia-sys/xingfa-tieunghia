// Edge Function "dich-ai" – nút "🌐 Dịch bằng AI" trong trang Quản trị
// Nhận chữ tiếng Việt → nhờ Gemini dịch sang tiếng Anh + tiếng Trung giản thể → trả về JSON cùng khóa.
//
// Khóa Gemini KHÔNG nằm trong code web: nó được cất trong Supabase → Edge Functions → Secrets
//   GEMINI_API_KEY = khóa lấy ở aistudio.google.com
//   GEMINI_MODEL   = tên model "flash" đang có trong AI Studio (vd gemini-2.5-flash)
// Hàm giữ "Verify JWT" = bật → chỉ admin đã đăng nhập mới gọi được (khách gọi sẽ bị 401).
//
// Đầu vào:  { "van_ban": { "tieu_de": "...", "tom_tat": "...", "noi_dung": "..." } }   (tên khóa tùy form)
// Đầu ra:   { "en": { cùng khóa }, "zh": { cùng khóa } }      Lỗi: { "loi": "câu báo lỗi tiếng Việt" }

// Bước 0: header CORS để trình duyệt (trang admin) được phép gọi hàm
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const GIOI_HAN_KY_TU = 20000;

// Trả JSON kèm CORS
function traVe(duLieu: unknown, maTrangThai = 200): Response {
  return new Response(JSON.stringify(duLieu), {
    status: maTrangThai,
    headers: { ...CORS, "Content-Type": "application/json; charset=utf-8" },
  });
}

// Hướng dẫn cho Gemini: văn phong, bảng thuật ngữ, giữ Markdown, chỉ trả JSON
const HUONG_DAN = `Bạn là biên dịch viên cho Công ty TNHH Cơ Khí Tiếu Nghĩa (thương hiệu "Xingfa Tiếu Nghĩa") – gia công cửa sắt, cửa nhôm Xingfa, nhà lắp ráp panel, mái che, tủ bếp nhôm tại Tây Ninh, Việt Nam.
Nhiệm vụ: dịch MỖI giá trị trong đối tượng JSON tiếng Việt được gửi sang:
- "en": tiếng Anh
- "zh": tiếng Trung GIẢN THỂ
Quy tắc:
1. Văn phong doanh nghiệp xây dựng – nội thất, tự nhiên, dễ hiểu, không quảng cáo quá đà.
2. GIỮ NGUYÊN định dạng Markdown (##, **, -, link, ảnh), xuống dòng, dấu ";" ngăn cách các ý.
3. GIỮ NGUYÊN tên riêng "Xingfa Tiếu Nghĩa", "Tiếu Nghĩa", số điện thoại, địa chỉ, đường link, con số, đơn vị.
4. KHÔNG thêm, bớt hay bịa thông tin; không thêm lời giải thích.
5. Bảng thuật ngữ bắt buộc:
   - nhôm Xingfa → Xingfa aluminium / 兴发铝合金
   - panel EPS / panel PU → EPS sandwich panel / PU sandwich panel ; EPS夹芯板 / PU夹芯板
   - nhà lắp ráp, nhà lắp ghép → prefab house / 装配式房屋
   - cửa kính cường lực → tempered glass door / 钢化玻璃门
   - "Liên hệ" (giá) → "Contact for quote" / "欢迎咨询报价"
6. Trả về DUY NHẤT một JSON đúng dạng {"en": {...}, "zh": {...}}, mỗi bên có ĐÚNG các khóa như đầu vào.`;

Deno.serve(async (req: Request) => {
  // Bước 1: trình duyệt hỏi trước bằng OPTIONS → trả lời ngay
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return traVe({ loi: "Chỉ hỗ trợ phương thức POST" }, 405);

  // Bước 2: kiểm tra đã đăng nhập (Supabase đã chặn khi Verify JWT bật; đây là lớp kiểm tra thêm)
  if (!req.headers.get("Authorization")) {
    return traVe({ loi: "Bạn cần đăng nhập trang Quản trị để dùng chức năng dịch" }, 401);
  }

  // Bước 3: đọc khóa Gemini từ Secrets
  const khoa = Deno.env.get("GEMINI_API_KEY");
  const model = Deno.env.get("GEMINI_MODEL") || "gemini-2.5-flash";
  if (!khoa) {
    return traVe({ loi: "Chưa cấu hình khóa Gemini – xem HUONG-DAN.md Bước 3b (thêm Secret GEMINI_API_KEY)" }, 500);
  }

  // Bước 4: đọc và kiểm tra dữ liệu gửi lên
  let vanBan: Record<string, string>;
  try {
    const than = await req.json();
    vanBan = than?.van_ban;
    if (!vanBan || typeof vanBan !== "object" || Array.isArray(vanBan)) throw new Error();
    // chỉ giữ các ô là chữ và có nội dung
    vanBan = Object.fromEntries(
      Object.entries(vanBan).filter(([, v]) => typeof v === "string" && v.trim() !== ""),
    ) as Record<string, string>;
  } catch {
    return traVe({ loi: "Dữ liệu gửi lên không đúng dạng { van_ban: {...} }" }, 400);
  }
  const cacKhoa = Object.keys(vanBan);
  if (!cacKhoa.length) return traVe({ loi: "Không có nội dung tiếng Việt để dịch" }, 400);
  const tongKyTu = Object.values(vanBan).join("").length;
  if (tongKyTu > GIOI_HAN_KY_TU) {
    return traVe({ loi: `Nội dung quá dài (${tongKyTu} ký tự). Vui lòng chia nhỏ bài, tối đa ${GIOI_HAN_KY_TU} ký tự mỗi lần.` }, 400);
  }

  // Bước 5: gọi Gemini generateContent, yêu cầu trả JSON
  let phanHoi: Response;
  try {
    phanHoi = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": khoa },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: HUONG_DAN }] },
          contents: [{ role: "user", parts: [{ text: JSON.stringify(vanBan) }] }],
          generationConfig: { responseMimeType: "application/json", temperature: 0.2 },
        }),
      },
    );
  } catch (e) {
    console.error("Không gọi được Gemini:", e);
    return traVe({ loi: "Không kết nối được tới Gemini, vui lòng thử lại" }, 500);
  }

  // Bước 6: xử lý lỗi từ Gemini (hết lượt miễn phí, khóa sai...)
  if (phanHoi.status === 429) {
    return traVe({ loi: "Hết lượt dịch miễn phí, vui lòng thử lại sau ít phút" }, 429);
  }
  if (!phanHoi.ok) {
    const chiTiet = await phanHoi.text();
    console.error("Gemini lỗi", phanHoi.status, chiTiet);
    const saiKhoa = phanHoi.status === 400 && /API key/i.test(chiTiet);
    return traVe({ loi: saiKhoa ? "Khóa Gemini không hợp lệ – kiểm tra lại Secret GEMINI_API_KEY" : `Gemini báo lỗi (${phanHoi.status}). Kiểm tra tên model GEMINI_MODEL.` }, 500);
  }

  // Bước 7: lấy JSON Gemini trả về và kiểm tra đủ khóa
  try {
    const kq = await phanHoi.json();
    const chu: string = kq?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text || "").join("") || "";
    const banDich = JSON.parse(chu.replace(/^```(?:json)?\s*|\s*```$/g, ""));
    const ketQua: { en: Record<string, string>; zh: Record<string, string> } = { en: {}, zh: {} };
    for (const ng of ["en", "zh"] as const) {
      for (const k of cacKhoa) {
        const gt = banDich?.[ng]?.[k];
        if (typeof gt === "string") ketQua[ng][k] = gt;
      }
    }
    if (!Object.keys(ketQua.en).length || !Object.keys(ketQua.zh).length) throw new Error("thiếu khóa");
    return traVe(ketQua);
  } catch (e) {
    console.error("Không đọc được kết quả Gemini:", e);
    return traVe({ loi: "AI trả kết quả không đúng định dạng, vui lòng bấm dịch lại" }, 500);
  }
});
