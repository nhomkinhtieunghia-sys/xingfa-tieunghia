// Nút "🌐 Dịch bằng AI" dùng chung cho form sản phẩm, công trình, bài viết.
// Gom các ô tiếng Việt → gọi Edge Function "dich-ai" (Gemini, khóa API nằm trong Supabase Secrets, không nằm trong web)
// → điền vào tab EN / 中文. Lỗi thì giữ nguyên chữ đang có.
window.AdminDichAI = (() => {
    const GIOI_HAN = 20000; // ký tự mỗi lần gửi

    // khoi: phần tử .ad-da-nn (do Admin.oDaNgonNgu tạo)
    async function dichKhoi(khoi) {
        const nut = khoi.querySelector('[data-dich-ai]');
        const chiTrong = khoi.querySelector('[data-chi-trong]')?.checked;
        const oVi = [...khoi.querySelectorAll('[data-than-nn="vi"] [name]')];

        // Gom các ô tiếng Việt có chữ (bỏ qua ô mà EN và 中文 đều đã có, nếu chọn "Chỉ dịch ô còn trống")
        const vanBan = {};
        oVi.forEach(o => {
            const chu = o.value.trim();
            if (!chu) return;
            const en = khoi.querySelector(`[name="${o.name}_en"]`);
            const zh = khoi.querySelector(`[name="${o.name}_zh"]`);
            if (chiTrong && en && zh && en.value.trim() && zh.value.trim()) return;
            vanBan[o.name] = chu;
        });
        if (!Object.keys(vanBan).length) {
            Admin.toast(chiTrong ? 'Các ô EN / 中文 đã có chữ (bỏ chọn "Chỉ dịch ô còn trống" để dịch lại)' : 'Hãy nhập nội dung tiếng Việt trước', 'loi');
            return;
        }
        const tongKyTu = Object.values(vanBan).join('').length;
        if (tongKyTu > GIOI_HAN) {
            Admin.toast(`Nội dung quá dài (${tongKyTu} ký tự, tối đa ${GIOI_HAN}). Hãy chia nhỏ bài.`, 'loi');
            return;
        }

        const chuNut = nut.innerHTML;
        nut.disabled = true;
        nut.innerHTML = '⏳ AI đang dịch…';
        khoi.classList.add('dang-dich');
        try {
            const { data, error } = await db.functions.invoke('dich-ai', { body: { van_ban: vanBan } });
            if (error) {
                // Lấy câu báo lỗi tiếng Việt từ hàm (nếu có)
                let loi = '';
                try { loi = (await error.context.json()).loi; } catch (e) { /* bỏ qua */ }
                const chuaTrienKhai = /not found|404|Failed to send/i.test(error.message || '') || (error.context && error.context.status === 404);
                throw new Error(loi || (chuaTrienKhai ? 'Chưa cấu hình khóa Gemini / chưa triển khai hàm dich-ai – xem HUONG-DAN.md Bước 3b' : error.message));
            }
            if (!data || !data.en || !data.zh) throw new Error((data && data.loi) || 'AI trả kết quả không hợp lệ');
            ['en', 'zh'].forEach(ng => {
                Object.keys(vanBan).forEach(ten => {
                    const o = khoi.querySelector(`[name="${ten}_${ng}"]`);
                    if (o && typeof data[ng][ten] === 'string' && (!chiTrong || !o.value.trim())) o.value = data[ng][ten];
                });
            });
            Admin.capNhatCham(khoi);
            // chuyển sang tab EN để xem lại
            khoi.querySelector('[data-nn="en"]').click();
            khoi.dispatchEvent(new Event('input', { bubbles: true }));
            Admin.toast('Đã dịch xong – vui lòng xem lại trước khi lưu');
        } catch (err) {
            console.error(err);
            Admin.toast('Dịch lỗi: ' + err.message, 'loi');
        } finally {
            nut.disabled = false;
            nut.innerHTML = chuNut;
            khoi.classList.remove('dang-dich');
        }
    }

    return { dichKhoi };
})();
