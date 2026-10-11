// QUẢN TRỊ – tab "Lịch & Tiến độ": xem lịch khảo sát, cập nhật bước tiến độ
// (UPDATE lich_khao_sat.trang_thai + INSERT tien_do), xem dòng thời gian, xóa lịch.
(() => {
    const m = Admin.m;
    const BUOC = {
        cho_xac_nhan: 'Chờ xác nhận', da_xac_nhan: 'Đã xác nhận lịch', da_khao_sat: 'Đã khảo sát đo đạc', da_bao_gia: 'Đã báo giá',
        dang_gia_cong: 'Đang gia công tại xưởng', dang_lap_dat: 'Đang lắp đặt', hoan_thanh: 'Hoàn thành – bàn giao', da_huy: 'Đã hủy'
    };
    const THU_TU = Object.keys(BUOC);
    let dsLich = [];
    let locBuoc = 'tat-ca';

    async function moCapNhat(lich) {
        const { data: lichSu, error } = await db.from('tien_do').select('*').eq('lich_id', lich.id).order('created_at');
        if (error) return Admin.baoLoi(error);
        const viTri = THU_TU.indexOf(lich.trang_thai);
        // lịch đã hủy thì gợi ý mở lại từ "Chờ xác nhận"
        const buocKe = lich.trang_thai === 'da_huy' ? 'cho_xac_nhan' : THU_TU[Math.min(viTri + 1, 6)];
        Admin.moModal({
            tieuDe: `Tiến độ ${lich.ma_lich} – ${lich.ho_ten}`,
            nutLuu: 'Cập nhật tiến độ',
            noiDung: `
                <div class="ad-luoi-2" style="align-items:start">
                    <div>
                        <h3 class="ad-h3">Dòng thời gian</h3>
                        <ol class="dl-timeline ad-timeline">${lichSu.map(t => `
                            <li class="dl-tl-muc ${t.buoc === 'da_huy' ? 'hien-tai' : 'xong'}"><span class="dl-tl-cham">${t.buoc === 'da_huy' ? '✕' : '✓'}</span>
                            <div class="dl-tl-noi-dung"><div class="dl-tl-ten">${m(BUOC[t.buoc] || t.buoc)}</div>
                            <div class="dl-tl-ghi"><time>${Admin.ngayGio(t.created_at)}</time>${t.ghi_chu ? ' · ' + m(t.ghi_chu) : ''}</div></div></li>`).join('')}</ol>
                    </div>
                    <form id="form-td" class="ad-form">
                        <h3 class="ad-h3">Cập nhật bước mới</h3>
                        <label class="dl-o"><span>Bước tiến độ</span>
                            <select name="buoc">${THU_TU.map(b => `<option value="${b}" ${b === buocKe ? 'selected' : ''}>${BUOC[b]}</option>`).join('')}</select></label>
                        <label class="dl-o"><span>Ghi chú cho khách (hiện trên trang tra cứu)</span>
                            <textarea name="ghi_chu" rows="4" placeholder="VD: Đã đo xong, sẽ gửi báo giá trong 2 ngày"></textarea></label>
                        <p class="ad-goi-y">Khách tra cứu bằng mã <strong>${m(lich.ma_lich)}</strong> + SĐT sẽ thấy bước mới ngay.</p>
                    </form>
                </div>`,
            khiLuu: async () => {
                const d = Admin.docForm(document.getElementById('form-td'));
                const { error: e1 } = await db.from('lich_khao_sat').update({ trang_thai: d.buoc, updated_at: new Date().toISOString() }).eq('id', lich.id);
                if (e1) { Admin.baoLoi(e1); return false; }
                const { error: e2 } = await db.from('tien_do').insert({ lich_id: lich.id, buoc: d.buoc, ghi_chu: d.ghi_chu });
                if (e2) { Admin.baoLoi(e2); return false; }
                Admin.toast('Đã cập nhật tiến độ');
                Admin.veLai();
            }
        });
    }

    Admin.dangKyTab({
        id: 'lich', ten: 'Lịch & Tiến độ', icon: '📅', thuTu: 6,
        dem: async () => (await db.from('lich_khao_sat').select('id', { count: 'exact', head: true }).eq('trang_thai', 'cho_xac_nhan')).count,
        ve: async (khung, dau) => {
            dau.innerHTML = `<select class="ad-tim" id="loc-buoc"><option value="tat-ca">Tất cả bước</option>${THU_TU.map(b => `<option value="${b}" ${b === locBuoc ? 'selected' : ''}>${BUOC[b]}</option>`).join('')}</select>`;
            const { data, error } = await db.from('lich_khao_sat').select('*').order('ngay_hen', { ascending: true });
            if (error) throw error;
            dsLich = data;
            const homNay = new Date().toISOString().slice(0, 10);
            const ve = () => {
                const ds = dsLich.filter(l => locBuoc === 'tat-ca' || l.trang_thai === locBuoc);
                khung.innerHTML = ds.length ? `<div class="ad-bang-khung"><table class="ad-bang">
                    <thead><tr><th>Mã</th><th>Ngày hẹn</th><th>Khách</th><th>Địa chỉ · dịch vụ</th><th>Bước hiện tại</th><th></th></tr></thead>
                    <tbody>${ds.map(l => `<tr class="${l.ngay_hen < homNay && ['cho_xac_nhan', 'da_xac_nhan'].includes(l.trang_thai) ? 'ad-qua-han' : ''}">
                        <td><strong>${m(l.ma_lich)}</strong></td>
                        <td>${Admin.ngay(l.ngay_hen)}<br><small>${l.buoi === 'chieu' ? 'Chiều 13h–17h' : 'Sáng 8h–11h'}</small></td>
                        <td>${Admin.co(l.ngon_ngu)} ${m(l.ho_ten)}<br><a href="tel:${m(l.so_dien_thoai)}">${m(l.so_dien_thoai)}</a></td>
                        <td>${m(l.dia_chi_cong_trinh)}<br><small>${m(Admin.NHOM[l.dich_vu] || '')}${l.ghi_chu ? ' · 💬 ' + m(l.ghi_chu) : ''}</small></td>
                        <td><span class="ad-buoc b-${l.trang_thai}">${m(BUOC[l.trang_thai] || l.trang_thai)}</span></td>
                        <td class="ad-hanh-dong"><button type="button" class="ad-nut" data-cap-nhat="${l.id}">Cập nhật tiến độ</button><button type="button" class="ad-nut ad-nut-xoa" data-xoa-lich="${l.id}">Xóa</button></td>
                    </tr>`).join('')}</tbody></table></div>` : '<div class="ad-dang-tai">Không có lịch nào.</div>';
            };
            ve();
            document.getElementById('loc-buoc').addEventListener('change', e => { locBuoc = e.target.value; ve(); });
            khung.onclick = async e => {
                const cn = e.target.closest('[data-cap-nhat]');
                if (cn) moCapNhat(dsLich.find(l => l.id === Number(cn.dataset.capNhat)));
                const x = e.target.closest('[data-xoa-lich]');
                if (x) {
                    const l = dsLich.find(v => v.id === Number(x.dataset.xoaLich));
                    if (!(await Admin.xacNhan(`Xóa lịch ${l.ma_lich} của ${l.ho_ten}? Toàn bộ tiến độ cũng bị xóa.`))) return;
                    const { error: loi } = await db.from('lich_khao_sat').delete().eq('id', l.id);
                    if (loi) return Admin.baoLoi(loi);
                    Admin.toast('Đã xóa lịch');
                    Admin.veLai();
                }
            };
        }
    });
})();
