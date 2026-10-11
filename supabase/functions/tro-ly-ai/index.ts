// Edge Function "tro-ly-ai" – bong bóng "Cần tư vấn?" trên web hỏi AI
// Thứ tự: Gemini (nhanh, tiếng Việt tốt) → nếu lỗi thì OpenRouter (model miễn phí) → quá 9 giây thì báo lỗi,
// web tự trả lời bằng kịch bản có sẵn (khách không phải chờ lâu).
// Các khóa KHÔNG nằm trong code web: cất trong Supabase → Edge Functions → Secrets
//   GEMINI_API_KEY, GEMINI_MODEL = dùng chung với hàm "dich-ai"
//   OPENROUTER_API_KEY = khóa lấy ở openrouter.ai/keys (dự phòng)
//   OPENROUTER_MODELS  = (không bắt buộc) danh sách model, cách nhau bằng dấu phẩy
// Khách xem web chưa đăng nhập cũng gọi được → khi tạo hàm phải TẮT "Verify JWT".
//
// Đầu vào:  { "tin_nhan": [ { "role": "user"|"assistant", "content": "..." } ], "ngon_ngu": "vi"|"en"|"zh" }
// Đầu ra:   { "tra_loi": "..." }      Lỗi: { "loi": "..." }  → web tự quay về kịch bản trả lời sẵn

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const MODEL_MAC_DINH = [
  "google/gemma-4-26b-a4b-it:free",
  "nvidia/nemotron-3.5-lightning:free",
  "google/gemma-4-31b-it:free",
];
const THOI_HAN_MS = 10000;     // tổng thời gian tối đa cho 1 câu trả lời
const TOI_DA_TIN = 6;        // chỉ gửi 6 tin gần nhất
const TOI_DA_KY_TU = 500;    // mỗi tin tối đa 500 ký tự (chặn gửi văn bản dài phá quota)

const NGON_NGU: Record<string, string> = {
  vi: "tiếng Việt",
  en: "English",
  zh: "简体中文 (tiếng Trung giản thể)",
};

function traVe(duLieu: unknown, maTrangThai = 200): Response {
  return new Response(JSON.stringify(duLieu), {
    status: maTrangThai,
    headers: { ...CORS, "Content-Type": "application/json; charset=utf-8" },
  });
}

// Nhận ra câu "suy nghĩ nháp" mà một số model miễn phí lỡ gửi kèm
function laSuyNghiNhap(chu: string): boolean {
  return /thinking process|analyze (the )?user|^\s*(thinking|reasoning)\b|\*\*(analy[sz]e|check constraints|draft)/i.test(chu.slice(0, 400));
}

// Thông tin công ty để AI trả lời đúng (sửa ở đây khi công ty đổi thông tin)
function huongDan(ngonNgu: string): string {
  return `Bạn là trợ lý tư vấn trên website của Công ty TNHH Cơ Khí Tiếu Nghĩa (thương hiệu "Xingfa Tiếu Nghĩa"), Tây Ninh, Việt Nam.
Thông tin công ty:
- Sản phẩm, dịch vụ: cửa sắt – cổng – lan can – cầu thang; cửa nhôm Xingfa (nhôm Xingfa nhập khẩu và Xingfa Việt Nam); cửa kính cường lực; nhà lắp ráp panel EPS và PU; mái che; tủ bếp và nội thất nhôm; bảo trì, sửa chữa.
- Đội thợ hơn 10 năm kinh nghiệm.
- Địa chỉ: 12 Ấp An Thuận, xã An Ninh, tỉnh Tây Ninh. Hotline/Zalo: 097-622-4875. Giờ làm việc 8:00–17:00, thứ Hai – Chủ nhật.
- Khảo sát, đo đạc tận nơi miễn phí tại Tây Ninh và khu vực lân cận. Có bảo hành.
- Giá: KHÔNG báo giá con số cụ thể; giá báo sau khi khảo sát ("Liên hệ").
- Trên web khách có thể: tự thiết kế nhà panel 3D (mục "Thiết kế 3D"), thêm sản phẩm vào giỏ để yêu cầu báo giá, đặt lịch khảo sát và tra cứu tiến độ bằng mã lịch.
Quy tắc:
- Trả lời bằng ${NGON_NGU[ngonNgu] ?? NGON_NGU.vi}, ngắn gọn (dưới 100 từ), lịch sự, thân thiện.
- Không bịa thông tin ngoài danh sách trên (số năm bảo hành, giá, chương trình khuyến mãi…). Không chắc thì mời khách gọi 097-622-4875.
- Chỉ tư vấn về sản phẩm, dịch vụ của công ty; câu hỏi không liên quan thì lịch sự từ chối.`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return traVe({ loi: "Chỉ nhận POST" }, 405);

  let dau: { tin_nhan?: unknown; ngon_ngu?: unknown };
  try {
    dau = await req.json();
  } catch {
    return traVe({ loi: "Dữ liệu gửi lên không phải JSON" }, 400);
  }

  // Lọc tin nhắn: chỉ nhận role user/assistant, cắt độ dài
  const ds = Array.isArray(dau.tin_nhan) ? dau.tin_nhan : [];
  const tinNhan = ds
    .filter((m: any) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
    .slice(-TOI_DA_TIN)
    .map((m: any) => ({ role: m.role, content: m.content.slice(0, TOI_DA_KY_TU) }));
  if (!tinNhan.length || tinNhan[tinNhan.length - 1].role !== "user") {
    return traVe({ loi: "Thiếu câu hỏi" }, 400);
  }

  const ngonNgu = typeof dau.ngon_ngu === "string" ? dau.ngon_ngu : "vi";
  const heThong = huongDan(ngonNgu);
  const hetGio = Date.now() + THOI_HAN_MS;
  const conLai = () => Math.max(0, hetGio - Date.now());
  const loi: string[] = [];

  // 1) Gemini
  const khoaGemini = Deno.env.get("GEMINI_API_KEY");
  if (khoaGemini) {
    const model = Deno.env.get("GEMINI_MODEL") || "gemini-2.5-flash";
    const goiGemini = async (giamSuyNghi: boolean) => {
      const genConfig: Record<string, unknown> = { temperature: 0.4, maxOutputTokens: 1024 };
      if (giamSuyNghi) {
        genConfig.thinkingConfig = { thinkingBudget: 0 };
      }
      return await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-goog-api-key": khoaGemini },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: heThong }] },
            contents: tinNhan.slice(tinNhan.findIndex((m) => m.role === "user")).map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] })),
            generationConfig: genConfig,
          }),
          signal: AbortSignal.timeout(Math.min(8500, conLai())),
        },
      );
    };

    try {
      let phanHoi = await goiGemini(true);
      if (!phanHoi.ok && phanHoi.status === 400) {
        // Nếu model không hỗ trợ thinkingConfig (lỗi 400), tự gọi lại không có cấu hình đó
        phanHoi = await goiGemini(false);
      }
      if (phanHoi.ok) {
        const kq = await phanHoi.json();
        const traLoi = (kq?.candidates?.[0]?.content?.parts ?? [])
          .filter((p: { text?: string; thought?: boolean }) => p.text && !p.thought)
          .map((p: { text: string }) => p.text).join("").trim();
        if (traLoi) return traVe({ tra_loi: traLoi, model });
        loi.push("Gemini trả lời rỗng");
      } else {
        loi.push(`Gemini lỗi ${phanHoi.status} ${(await phanHoi.text()).slice(0, 200)}`);
      }
    } catch (e) {
      loi.push(`Gemini: ${String(e)}`);
    }
  }

  if (!khoaGemini) loi.push("Chưa có Secret GEMINI_API_KEY");

  // 2) OpenRouter (dự phòng, chỉ khi còn thời gian)
  const khoa = Deno.env.get("OPENROUTER_API_KEY");
  const models = (Deno.env.get("OPENROUTER_MODELS") || "").split(",").map((s) => s.trim()).filter(Boolean);
  const danhSach = khoa ? (models.length ? models : MODEL_MAC_DINH) : [];
  for (const model of danhSach) {
    if (conLai() < 1500) break;
    try {
      const phanHoi = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${khoa}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://nhomkinhtieunghia-sys.github.io/xingfa-tieunghia/",
          "X-Title": "Xingfa Tieu Nghia",
        },
        body: JSON.stringify({
          model,
          messages: [{ role: "system", content: heThong }, ...tinNhan],
          reasoning: { exclude: true },
          max_tokens: 800,
        }),
        signal: AbortSignal.timeout(conLai()),
      });
      if (!phanHoi.ok) {
        loi.push(`${model}: lỗi ${phanHoi.status}`);
        continue;
      }
      const kq = await phanHoi.json();
      let traLoi = String(kq?.choices?.[0]?.message?.content ?? "");
      traLoi = traLoi.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
      if (!traLoi || laSuyNghiNhap(traLoi)) {
        loi.push(`${model}: trả về suy nghĩ nháp`);
        continue;
      }
      return traVe({ tra_loi: traLoi, model });
    } catch (e) {
      loi.push(`${model}: ${String(e)}`);
    }
  }
  return traVe({ loi: "AI không trả lời được", chi_tiet: loi.join(" | ") }, 502);
});
