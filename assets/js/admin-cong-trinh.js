// QUẢN TRỊ – tab "Công trình" (thêm / sửa / xóa, chọn vị trí trên bản đồ) và tab "Đánh giá" (duyệt / ẩn / xóa)
(() => {
    const m = Admin.m;
    const TRUONG_CT = [
        { ten: 'ten', nhan: 'Tên công trình', batBuoc: true },
        { ten: 'dia_diem', nhan: 'Địa điểm (vd: Khu vực Hậu Nghĩa, Tây Ninh)', batBuoc: true },
        { ten: 'mo_ta', nhan: 'Mô tả', loai: 'textarea', dong: 3 }
    ];
    let dsCT = [];

    function moFormCongTrinh(ct) {
        const c = ct || { vi_do: 10.95, kinh_do: 106.35, nam: new Date().getFullYear() };
        Admin.moModal({
            tieuDe: ct ? `Sửa công trình #${ct.id}` : 'Thêm công trình',
            nutLuu: ct ? 'Lưu thay đổi' : 'Thêm công trình',
            noiDung: `<form class="ad-form" id="form-ct">
                ${Admin.oDaNgonNgu(TRUONG_CT, c, { id: 'ct' })}
                <div class="ad-luoi-2">
                    <label class="dl-o"><span>Hạng mục *</span><select name="hang_muc">${Object.entries(Admin.NHOM).map(([k, v]) => `<option value="${k}" ${c.hang_muc === k ? 'selected' : ''}>${v}</option>`).join('')}</select></label>
                    <label class="dl-o"><span>Năm thi công</span><input type="number" name="nam" min="2000" max="2100" value="${m(c.nam ?? '')}"></label>
                    <label class="dl-o"><span>Vĩ độ (latitude) *</span><input type="number" step="any" name="vi_do" id="ct-vi-do" value="${m(c.vi_do)}"></label>
                    <label class="dl-o"><span>Kinh độ (longitude) *</span><input type="number" step="any" name="kinh_do" id="ct-kinh-do" value="${m(c.kinh_do)}"></label>
                    <label class="dl-o"><span>Thứ tự</span><input type="number" name="thu_tu" value="${m(c.thu_tu ?? 0)}"></label>
                </div>
                <p class="ad-goi-y">📍 Bấm lên bản đồ để chọn vị trí công trình (tự điền vĩ độ, kinh độ).</p>
                <div id="ct-ban-do-nho" class="ad-ban-do-nho"></div>
                ${Admin.oChonAnh('hinh_anh', c.hinh_anh, 'cong-trinh')}
            </form>`,
            khiLuu: async () => {
                const d = Admin.docForm(document.getElementById('form-ct'));
                if (!d.ten || !d.dia_diem || d.vi_do == null || d.kinh_do == null) { Admin.toast('Nhập đủ tên, địa điểm và vị trí trên bản đồ', 'loi'); return false; }
                d.thu_tu = d.thu_tu || 0;
                const { error } = ct ? await db.from('cong_trinh').update(d).eq('id', ct.id) : await db.from('cong_trinh').insert(d);
                if (error) { Admin.baoLoi(error, 'Lưu công trình lỗi'); return false; }
                Admin.toast(ct ? 'Đã cập nhật công trình' : 'Đã thêm công trình');
                Admin.veLai();
            }
        });
        // Bản đồ nhỏ chọn vị trí
        if (typeof L === 'undefined') return;
        setTimeout(() => {
            const banDo = L.map('ct-ban-do-nho').setView([c.vi_do, c.kinh_do], 11);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '&copy; OpenStreetMap' }).addTo(banDo);
            const ghim = L.marker([c.vi_do, c.kinh_do], { draggable: true }).addTo(banDo);
            const dien = ll => {
                document.getElementById('ct-vi-do').value = ll.lat.toFixed(6);
                document.getElementById('ct-kinh-do').value = ll.lng.toFixed(6);
            };
            banDo.on('click', e => { ghim.setLatLng(e.latlng); dien(e.latlng); });
            ghim.on('dragend', () => dien(ghim.getLatLng()));
        }, 50);
    }

    Admin.dangKyTab({
        id: 'cong-trinh', ten: 'Công trình', icon: '📍', thuTu: 7, demTong: true,
        dem: async () => (await db.from('cong_trinh').select('id', { count: 'exact', head: true })).count,
        ve: async (khung, dau) => {
            dau.innerHTML = '<button type="button" class="btn-chinh" id="them-ct">+ Thêm công trình</button>';
            const { data, error } = await db.from('cong_trinh').select('*').order('thu_tu');
            if (error) throw error;
            dsCT = data;
            khung.innerHTML = `<div class="ad-bang-khung"><table class="ad-bang">
                <thead><tr><th>Ảnh</th><th>Tên</th><th>Hạng mục</th><th>Địa điểm</th><th>Năm</th><th>Bản dịch</th><th></th></tr></thead>
                <tbody>${dsCT.map(c => `<tr>
                    <td><img class="ad-anh-nho" src="${m(TieuNghia.anhAnToan(c.hinh_anh))}" alt=""></td>
                    <td><strong>${m(c.ten)}</strong></td><td>${m(Admin.NHOM[c.hang_muc] || c.hang_muc)}</td>
                    <td>${m(c.dia_diem)}<br><small>${Number(c.vi_do).toFixed(4)}, ${Number(c.kinh_do).toFixed(4)}</small></td>
                    <td>${m(c.nam ?? '')}</td>
                    <td>${c.ten_en ? '🇬🇧' : '<span class="ad-mo">🇬🇧</span>'} ${c.ten_zh ? '🇨🇳' : '<span class="ad-mo">🇨🇳</span>'}</td>
                    <td class="ad-hanh-dong"><button type="button" class="ad-nut" data-sua-ct="${c.id}">Sửa</button><button type="button" class="ad-nut ad-nut-xoa" data-xoa-ct="${c.id}">Xóa</button></td>
                </tr>`).join('') || '<tr><td colspan="7">Chưa có công trình</td></tr>'}</tbody></table></div>`;
            document.getElementById('them-ct').addEventListener('click', () => moFormCongTrinh(null));
            khung.onclick = async e => {
                const s = e.target.closest('[data-sua-ct]');
                if (s) moFormCongTrinh(dsCT.find(c => c.id === Number(s.dataset.suaCt)));
                const x = e.target.closest('[data-xoa-ct]');
                if (x) {
                    const c = dsCT.find(v => v.id === Number(x.dataset.xoaCt));
                    if (!(await Admin.xacNhan(`Xóa công trình "${c.ten}"?`))) return;
                    const { error: loi } = await db.from('cong_trinh').delete().eq('id', c.id);
                    if (loi) return Admin.baoLoi(loi);
                    Admin.toast('Đã xóa công trình');
                    Admin.veLai();
                }
            };
        }
    });

    // ================= ĐÁNH GIÁ =================
    let locDG = 'cho';
    Admin.dangKyTab({
        id: 'danh-gia', ten: 'Đánh giá', icon: '⭐', thuTu: 8,
        dem: async () => (await db.from('danh_gia').select('id', { count: 'exact', head: true }).eq('da_duyet', false)).count,
        ve: async (khung, dau) => {
            dau.innerHTML = `<div class="ad-loc-nut">
                <button type="button" data-loc-dg="cho" class="${locDG === 'cho' ? 'active' : ''}">Chờ duyệt</button>
                <button type="button" data-loc-dg="da" class="${locDG === 'da' ? 'active' : ''}">Đã duyệt</button></div>`;
            dau.onclick = e => { const b = e.target.closest('[data-loc-dg]'); if (b) { locDG = b.dataset.locDg; Admin.moTab('danh-gia'); } };
            const { data, error } = await db.from('danh_gia').select('*').eq('da_duyet', locDG === 'da').order('created_at', { ascending: false });
            if (error) throw error;
            khung.innerHTML = data.length ? `<div class="ad-the-luoi">${data.map(d => `
                <article class="ad-the-yc">
                    <header>${Admin.co(d.ngon_ngu)} <strong>${m(d.ho_ten)}</strong> <span class="dg-sao">${'★'.repeat(d.so_sao)}${'☆'.repeat(5 - d.so_sao)}</span><span class="ad-gian"></span><small>${Admin.ngayGio(d.created_at)}</small></header>
                    <p>${m(d.noi_dung)}</p>
                    ${d.dich_vu ? `<small>Dịch vụ: ${m(Admin.NHOM[d.dich_vu] || d.dich_vu)}</small>` : ''}
                    <footer>${d.da_duyet
                        ? `<button type="button" class="ad-nut" data-duyet="${d.id}" data-gia-tri="0">Ẩn khỏi web</button>`
                        : `<button type="button" class="ad-nut ad-nut-duyet" data-duyet="${d.id}" data-gia-tri="1">✓ Duyệt hiện lên web</button>`}
                        <button type="button" class="ad-nut ad-nut-xoa" data-xoa-dg="${d.id}">Xóa</button></footer>
                </article>`).join('')}</div>` : `<div class="ad-dang-tai">${locDG === 'cho' ? 'Không có đánh giá chờ duyệt.' : 'Chưa có đánh giá đã duyệt.'}</div>`;
            khung.onclick = async e => {
                const dy = e.target.closest('[data-duyet]');
                if (dy) {
                    const { error: loi } = await db.from('danh_gia').update({ da_duyet: dy.dataset.giaTri === '1' }).eq('id', dy.dataset.duyet);
                    if (loi) return Admin.baoLoi(loi);
                    Admin.toast(dy.dataset.giaTri === '1' ? 'Đã duyệt – đánh giá hiện trên web' : 'Đã ẩn đánh giá');
                    Admin.veLai();
                }
                const x = e.target.closest('[data-xoa-dg]');
                if (x && await Admin.xacNhan('Xóa đánh giá này?')) {
                    const { error: loi } = await db.from('danh_gia').delete().eq('id', x.dataset.xoaDg);
                    if (loi) return Admin.baoLoi(loi);
                    Admin.toast('Đã xóa đánh giá');
                    Admin.veLai();
                }
            };
        }
    });
})();
