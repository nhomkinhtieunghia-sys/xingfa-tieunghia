// QUẢN TRỊ – tab "Bài viết": danh sách + soạn bài Markdown toàn màn hình (3 ngôn ngữ, xem trước, Dịch bằng AI,
// ảnh đại diện có sẵn / tải lên kho ảnh), Lưu nháp / Đăng bài (INSERT / UPDATE), Xóa (DELETE).
(() => {
    const m = Admin.m;
    const CHUYEN_MUC = { 'kien-thuc': 'Kiến thức', 'tin-cong-ty': 'Tin công ty', 'cong-trinh': 'Công trình' };
    let dsBai = [];

    // "Nhà panel EPS hay PU?" → "nha-panel-eps-hay-pu"
    const taoSlug = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd')
        .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);

    const xemTruoc = md => (typeof DOMPurify !== 'undefined' && typeof marked !== 'undefined') ? DOMPurify.sanitize(marked.parse(md || '')) : m(md);

    function oNgonNgu(ng, bv) {
        const h = ng === 'vi' ? '' : '_' + ng;
        const bb = ng === 'vi' ? ' *' : '';
        return `<div class="ad-nn-than${ng === 'vi' ? ' active' : ''}" data-than-nn="${ng}">
            <label class="dl-o"><span>Tiêu đề${bb}</span><input type="text" name="tieu_de${h}" value="${m(bv['tieu_de' + h] || '')}" maxlength="200"></label>
            <label class="dl-o"><span>Tóm tắt (1–2 câu, hiện trên thẻ bài)</span><textarea name="tom_tat${h}" rows="2" maxlength="400">${m(bv['tom_tat' + h] || '')}</textarea></label>
            <div class="ad-soan">
                <div class="ad-soan-trai">
                    <div class="ad-cong-cu" data-cho="noi_dung${h}">
                        <button type="button" data-md="**|**" title="In đậm"><b>B</b></button>
                        <button type="button" data-md="*|*" title="In nghiêng"><i>I</i></button>
                        <button type="button" data-md="\n## |" title="Tiêu đề mục">##</button>
                        <button type="button" data-md="\n- |" title="Danh sách">• Danh sách</button>
                        <button type="button" data-md="[|](https://)" title="Chèn link">🔗 Link</button>
                        <label title="Chèn ảnh vào bài">🖼 Ảnh<input type="file" accept="image/*" data-anh-trong-bai hidden></label>
                    </div>
                    <textarea name="noi_dung${h}" class="ad-o-md" spellcheck="false" placeholder="Viết nội dung bằng Markdown...">${m(bv['noi_dung' + h] || '')}</textarea>
                </div>
                <div class="ad-soan-phai"><div class="ad-nhan-xem">Xem trước</div><div class="bv-noi-dung ad-xem-truoc" data-xem="noi_dung${h}">${xemTruoc(bv['noi_dung' + h])}</div></div>
            </div>
        </div>`;
    }

    function moSoanBai(bv) {
        const b = bv || { chuyen_muc: 'kien-thuc', ngay_dang: new Date().toISOString().slice(0, 10) };
        const coChu = ng => !!(b['tieu_de_' + ng] || b['noi_dung_' + ng]);
        const than = Admin.moModal({
            tieuDe: bv ? 'Sửa bài viết' : 'Viết bài mới',
            toanManHinh: true,
            chanTrang: `<span class="ad-trang-thai-bai">${bv ? (bv.da_dang ? '🟢 Đang đăng' : '⚪ Bản nháp') : '⚪ Bài mới'}</span>
                <span class="ad-gian"></span>
                <button type="button" class="btn-phu" data-dong-modal>Hủy</button>
                <button type="button" class="btn-phu" id="bv-luu-nhap">💾 Lưu nháp</button>
                <button type="button" class="btn-chinh" id="bv-dang">🚀 Đăng bài</button>`,
            noiDung: `<form class="ad-form" id="form-bv" autocomplete="off">
                <div class="ad-da-nn" data-nhom-nn="bv">
                    <div class="ad-nn-tabs">
                        <button type="button" class="active" data-nn="vi">🇻🇳 VI</button>
                        <button type="button" data-nn="en">🇬🇧 EN <i class="ad-cham ${coChu('en') ? 'co' : ''}"></i></button>
                        <button type="button" data-nn="zh">🇨🇳 中文 <i class="ad-cham ${coChu('zh') ? 'co' : ''}"></i></button>
                        <span class="ad-nn-gian"></span>
                        <label class="ad-chi-o-trong"><input type="checkbox" data-chi-trong checked> Chỉ dịch ô còn trống</label>
                        <button type="button" class="ad-nut-dich-ai" data-dich-ai>✨ 🌐 Dịch bằng AI</button>
                    </div>
                    ${['vi', 'en', 'zh'].map(ng => oNgonNgu(ng, b)).join('')}
                </div>
                <div class="ad-luoi-2 ad-bv-thuoc-tinh">
                    <label class="dl-o"><span>Chuyên mục</span><select name="chuyen_muc">${Object.entries(CHUYEN_MUC).map(([k, v]) => `<option value="${k}" ${b.chuyen_muc === k ? 'selected' : ''}>${v}</option>`).join('')}</select></label>
                    <label class="dl-o"><span>Đường dẫn (slug) *</span><input type="text" name="slug" id="bv-slug" value="${m(b.slug || '')}" placeholder="tu-tao-tu-tieu-de" ${bv ? 'data-da-sua="1"' : ''}></label>
                    <label class="dl-o"><span>Ngày đăng</span><input type="date" name="ngay_dang" value="${m(b.ngay_dang || '')}"></label>
                    <label class="ad-hop-chon"><input type="checkbox" name="noi_bat" ${b.noi_bat ? 'checked' : ''}> Nổi bật (hiện to ở đầu trang Tin tức)</label>
                </div>
                ${Admin.oChonAnh('anh_dai_dien', b.anh_dai_dien, 'bai-viet')}
            </form>`
        });

        const form = document.getElementById('form-bv');
        const oSlug = document.getElementById('bv-slug');
        // slug tự tạo theo tiêu đề tiếng Việt (tới khi admin tự sửa slug)
        form.querySelector('[name="tieu_de"]').addEventListener('input', e => { if (!oSlug.dataset.daSua) oSlug.value = taoSlug(e.target.value); });
        oSlug.addEventListener('input', () => { oSlug.dataset.daSua = '1'; });
        oSlug.addEventListener('change', () => { oSlug.value = taoSlug(oSlug.value); });

        // xem trước trực tiếp
        than.addEventListener('input', e => {
            if (e.target.classList.contains('ad-o-md')) {
                const xem = than.querySelector(`[data-xem="${e.target.name}"]`);
                if (xem) xem.innerHTML = xemTruoc(e.target.value);
            }
        });
        // Sau khi AI dịch, cập nhật lại xem trước
        than.querySelector('.ad-da-nn').addEventListener('input', () => {
            than.querySelectorAll('.ad-o-md').forEach(o => { const x = than.querySelector(`[data-xem="${o.name}"]`); if (x) x.innerHTML = xemTruoc(o.value); });
        });

        // thanh công cụ Markdown
        than.addEventListener('click', e => {
            const nut = e.target.closest('[data-md]');
            if (!nut) return;
            const o = form.querySelector(`[name="${nut.parentElement.dataset.cho}"]`);
            const [truoc, sau] = nut.dataset.md.replace(/\\n/g, '\n').split('|');
            const a = o.selectionStart, z = o.selectionEnd;
            const chon = o.value.slice(a, z);
            o.value = o.value.slice(0, a) + truoc + chon + sau + o.value.slice(z);
            o.focus();
            o.selectionStart = a + truoc.length;
            o.selectionEnd = a + truoc.length + chon.length;
            o.dispatchEvent(new Event('input', { bubbles: true }));
        });
        // chèn ảnh vào giữa bài: tải lên kho ảnh rồi chèn ![mô tả](link)
        than.addEventListener('change', async e => {
            if (!e.target.matches('[data-anh-trong-bai]') || !e.target.files[0]) return;
            const o = form.querySelector(`[name="${e.target.closest('.ad-cong-cu').dataset.cho}"]`);
            try {
                const url = await Admin.taiAnhLen(e.target.files[0], 'bai-viet', taoSlug(form.querySelector('[name="tieu_de"]').value) || 'anh');
                const chen = `\n\n![Hình minh họa](${url})\n\n`;
                const a = o.selectionStart;
                o.value = o.value.slice(0, a) + chen + o.value.slice(a);
                o.dispatchEvent(new Event('input', { bubbles: true }));
                Admin.toast('Đã chèn ảnh vào bài');
            } catch (err) {
                Admin.baoLoi(err, 'Tải ảnh lỗi');
            }
            e.target.value = '';
        });

        const luu = async dang => {
            const d = Admin.docForm(form);
            d.slug = taoSlug(d.slug || d.tieu_de);
            if (!d.tieu_de || !d.noi_dung) { Admin.toast('Cần có tiêu đề và nội dung tiếng Việt', 'loi'); return; }
            if (!d.slug) { Admin.toast('Đường dẫn (slug) không hợp lệ', 'loi'); return; }
            d.da_dang = dang;
            d.updated_at = new Date().toISOString();
            if (!d.ngay_dang) delete d.ngay_dang;
            const nutA = document.getElementById('bv-luu-nhap'), nutB = document.getElementById('bv-dang');
            nutA.disabled = nutB.disabled = true;
            const { error } = bv ? await db.from('bai_viet').update(d).eq('id', bv.id) : await db.from('bai_viet').insert(d);
            nutA.disabled = nutB.disabled = false;
            if (error) {
                if (error.code === '23505') Admin.toast('Đường dẫn (slug) đã có bài khác dùng – hãy đổi slug', 'loi');
                else Admin.baoLoi(error, 'Lưu bài lỗi');
                return;
            }
            Admin.toast(dang ? 'Đã đăng bài' : 'Đã lưu nháp');
            Admin.dongModal();
            Admin.veLai();
        };
        document.getElementById('bv-luu-nhap').addEventListener('click', () => luu(false));
        document.getElementById('bv-dang').addEventListener('click', () => luu(true));
    }

    Admin.dangKyTab({
        id: 'bai-viet', ten: 'Bài viết', icon: '📰', thuTu: 3, demTong: true,
        dem: async () => (await db.from('bai_viet').select('id', { count: 'exact', head: true })).count,
        ve: async (khung, dau) => {
            dau.innerHTML = '<button type="button" class="btn-chinh" id="them-bv">✏️ Viết bài mới</button>';
            const { data, error } = await db.from('bai_viet').select('*').order('ngay_dang', { ascending: false }).order('created_at', { ascending: false });
            if (error) throw error;
            dsBai = data;
            khung.innerHTML = dsBai.length ? `<div class="ad-bang-khung"><table class="ad-bang">
                <thead><tr><th>Ảnh</th><th>Tiêu đề</th><th>Chuyên mục</th><th>Trạng thái</th><th>Bản dịch</th><th>Lượt xem</th><th>Ngày</th><th></th></tr></thead>
                <tbody>${dsBai.map(b => `<tr>
                    <td><img class="ad-anh-nho" src="${m(TieuNghia.anhAnToan(b.anh_dai_dien))}" alt=""></td>
                    <td><strong>${m(b.tieu_de)}</strong>${b.noi_bat ? ' ⭐' : ''}<br><small>${m(b.slug)}</small></td>
                    <td>${m(CHUYEN_MUC[b.chuyen_muc] || b.chuyen_muc)}</td>
                    <td>${b.da_dang ? '<span class="ad-buoc b-hoan_thanh">Đã đăng</span>' : '<span class="ad-buoc b-cho_xac_nhan">Nháp</span>'}</td>
                    <td>${b.noi_dung_en ? '🇬🇧' : '<span class="ad-mo">🇬🇧</span>'} ${b.noi_dung_zh ? '🇨🇳' : '<span class="ad-mo">🇨🇳</span>'}</td>
                    <td>${Admin.so(b.luot_xem)}</td><td>${Admin.ngay(b.ngay_dang)}</td>
                    <td class="ad-hanh-dong"><button type="button" class="ad-nut" data-sua-bv="${b.id}">Sửa</button>
                        ${b.da_dang ? `<a class="ad-nut" href="bai-viet.html?bai=${encodeURIComponent(b.slug)}" target="_blank">Xem</a>` : ''}
                        <button type="button" class="ad-nut ad-nut-xoa" data-xoa-bv="${b.id}">Xóa</button></td>
                </tr>`).join('')}</tbody></table></div>` : '<div class="ad-dang-tai">Chưa có bài viết.</div>';
            document.getElementById('them-bv').addEventListener('click', () => moSoanBai(null));
            khung.onclick = async e => {
                const s = e.target.closest('[data-sua-bv]');
                if (s) moSoanBai(dsBai.find(b => b.id === Number(s.dataset.suaBv)));
                const x = e.target.closest('[data-xoa-bv]');
                if (x) {
                    const b = dsBai.find(v => v.id === Number(x.dataset.xoaBv));
                    if (!(await Admin.xacNhan(`Xóa bài "${b.tieu_de}"? Không thể hoàn tác.`))) return;
                    const { error: loi } = await db.from('bai_viet').delete().eq('id', b.id);
                    if (loi) return Admin.baoLoi(loi);
                    Admin.toast('Đã xóa bài viết');
                    Admin.veLai();
                }
            };
        }
    });
})();
