// QUẢN TRỊ – tab "Tổng quan": 5 thẻ số liệu + 3 biểu đồ (Chart.js 4.4.1) + bảng lịch 7 ngày tới
(() => {
    const m = Admin.m;
    const MAU = { chinh: '#1A2452', phu: '#046BD2', nhan: '#E53935', canhBao: '#F59E0B', thanhCong: '#16A34A' };
    const BUOC = {
        cho_xac_nhan: 'Chờ xác nhận', da_xac_nhan: 'Đã xác nhận', da_khao_sat: 'Đã khảo sát', da_bao_gia: 'Đã báo giá',
        dang_gia_cong: 'Đang gia công', dang_lap_dat: 'Đang lắp đặt', hoan_thanh: 'Hoàn thành', da_huy: 'Đã hủy'
    };
    const MAU_BUOC = ['#F59E0B', '#046BD2', '#0EA5E9', '#7C3AED', '#1A2452', '#64748B', '#16A34A', '#E53935'];
    let bieuDo = [];

    const ngayISO = d => d.toISOString().slice(0, 10);
    const chuaCo = '<div class="ad-chua-co">Chưa có dữ liệu</div>';

    function veBieuDo(id, cauHinh, coDuLieu) {
        const khung = document.getElementById(id);
        if (!coDuLieu || typeof Chart === 'undefined') { khung.innerHTML = chuaCo; return; }
        khung.innerHTML = '<canvas></canvas>';
        bieuDo.push(new Chart(khung.querySelector('canvas'), cauHinh));
    }

    Admin.dangKyTab({
        id: 'tong-quan', ten: 'Tổng quan', icon: '📊', thuTu: 1,
        ve: async khung => {
            bieuDo.forEach(b => b.destroy());
            bieuDo = [];
            const homNay = new Date();
            const sau7 = new Date(Date.now() + 7 * 86400000);
            const dau6Thang = new Date(homNay.getFullYear(), homNay.getMonth() - 5, 1);

            const [yc, tk, lich, dg] = await Promise.all([
                db.from('yeu_cau_bao_gia').select('trang_thai, danh_sach, created_at'),
                db.from('thiet_ke_nha').select('trang_thai, created_at'),
                db.from('lich_khao_sat').select('ma_lich, ho_ten, so_dien_thoai, ngay_hen, buoi, trang_thai, dia_chi_cong_trinh, created_at').order('ngay_hen'),
                db.from('danh_gia').select('so_sao, da_duyet')
            ]);
            [yc, tk, lich, dg].forEach(r => { if (r.error) throw r.error; });

            const lich7 = lich.data.filter(l => l.ngay_hen >= ngayISO(homNay) && l.ngay_hen <= ngayISO(sau7) && l.trang_thai !== 'da_huy');
            const daDuyet = dg.data.filter(d => d.da_duyet);
            const diemTB = daDuyet.length ? daDuyet.reduce((s, d) => s + d.so_sao, 0) / daDuyet.length : 0;
            const the = [
                { so: yc.data.filter(x => x.trang_thai === 'moi').length, nhan: 'Yêu cầu báo giá mới', icon: '🧾', mau: MAU.nhan, tab: 'yeu-cau' },
                { so: tk.data.filter(x => x.trang_thai === 'moi').length, nhan: 'Thiết kế nhà mới', icon: '🏠', mau: MAU.phu, tab: 'thiet-ke' },
                { so: lich7.length, nhan: 'Lịch 7 ngày tới', icon: '📅', mau: MAU.chinh, tab: 'lich' },
                { so: dg.data.filter(d => !d.da_duyet).length, nhan: 'Đánh giá chờ duyệt', icon: '⭐', mau: MAU.canhBao, tab: 'danh-gia' },
                { so: daDuyet.length ? Admin.so(diemTB) + '★' : '–', nhan: `Điểm đánh giá TB (${daDuyet.length} lượt)`, icon: '🏆', mau: MAU.thanhCong, tab: 'danh-gia' }
            ];

            khung.innerHTML = `
                <div class="ad-the-so">${the.map(t => `
                    <button type="button" class="ad-o-so" style="--mau:${t.mau}" data-den-tab="${t.tab}">
                        <span class="ad-o-icon">${t.icon}</span><strong>${t.so}</strong><span>${t.nhan}</span>
                    </button>`).join('')}</div>
                <div class="ad-luoi-bieu-do">
                    <section class="ad-hop ad-hop-rong"><h3>Yêu cầu theo 6 tháng gần nhất</h3><div class="ad-bieu-do" id="bd-duong"></div></section>
                    <section class="ad-hop"><h3>Top 5 sản phẩm được thêm vào báo giá</h3><div class="ad-bieu-do" id="bd-cot"></div></section>
                    <section class="ad-hop"><h3>Lịch theo bước tiến độ</h3><div class="ad-bieu-do" id="bd-tron"></div></section>
                </div>
                <section class="ad-hop"><h3>Lịch khảo sát 7 ngày tới</h3>
                    ${lich7.length ? `<div class="ad-bang-khung"><table class="ad-bang"><thead><tr><th>Ngày</th><th>Buổi</th><th>Mã</th><th>Khách</th><th>Địa chỉ</th><th>Bước</th></tr></thead><tbody>
                    ${lich7.map(l => `<tr><td>${Admin.ngay(l.ngay_hen)}</td><td>${l.buoi === 'chieu' ? 'Chiều' : 'Sáng'}</td><td><strong>${m(l.ma_lich)}</strong></td>
                        <td>${m(l.ho_ten)}<br><a href="tel:${m(l.so_dien_thoai)}">${m(l.so_dien_thoai)}</a></td><td>${m(l.dia_chi_cong_trinh)}</td>
                        <td><span class="ad-buoc b-${l.trang_thai}">${m(BUOC[l.trang_thai] || l.trang_thai)}</span></td></tr>`).join('')}
                    </tbody></table></div>` : chuaCo}
                </section>`;
            khung.onclick = e => { const b = e.target.closest('[data-den-tab]'); if (b) Admin.moTab(b.dataset.denTab); };

            // --- Biểu đồ đường: 6 tháng ---
            const thang = [];
            for (let i = 0; i < 6; i++) thang.push(new Date(dau6Thang.getFullYear(), dau6Thang.getMonth() + i, 1));
            const nhanThang = thang.map(d => `T${d.getMonth() + 1}/${String(d.getFullYear()).slice(2)}`);
            const demTheoThang = ds => thang.map(d => ds.filter(x => {
                const c = new Date(x.created_at);
                return c.getFullYear() === d.getFullYear() && c.getMonth() === d.getMonth();
            }).length);
            const sYC = demTheoThang(yc.data), sTK = demTheoThang(tk.data), sL = demTheoThang(lich.data);
            const duong = (nhan, dl, mau) => ({ label: nhan, data: dl, borderColor: mau, backgroundColor: mau + '22', tension: 0.35, fill: true, pointRadius: 4 });
            veBieuDo('bd-duong', {
                type: 'line',
                data: { labels: nhanThang, datasets: [duong('Yêu cầu báo giá', sYC, MAU.nhan), duong('Thiết kế nhà', sTK, MAU.phu), duong('Lịch khảo sát', sL, MAU.chinh)] },
                options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }, plugins: { legend: { position: 'bottom' } } }
            }, [...sYC, ...sTK, ...sL].some(n => n > 0));

            // --- Biểu đồ cột: top 5 sản phẩm trong danh_sach ---
            const dem = {};
            yc.data.forEach(y => (y.danh_sach || []).forEach(sp => {
                const ten = sp.ten_vi || sp.ten || ('#' + sp.id);
                dem[ten] = (dem[ten] || 0) + (Number(sp.so_luong) || 1);
            }));
            const top = Object.entries(dem).sort((a, b) => b[1] - a[1]).slice(0, 5);
            veBieuDo('bd-cot', {
                type: 'bar',
                data: { labels: top.map(x => x[0].length > 22 ? x[0].slice(0, 21) + '…' : x[0]), datasets: [{ label: 'Số lượng', data: top.map(x => x[1]), backgroundColor: [MAU.chinh, MAU.phu, MAU.nhan, MAU.canhBao, MAU.thanhCong], borderRadius: 6 }] },
                options: { responsive: true, maintainAspectRatio: false, indexAxis: 'y', plugins: { legend: { display: false } }, scales: { x: { beginAtZero: true, ticks: { precision: 0 } } } }
            }, top.length > 0);

            // --- Biểu đồ tròn: lịch theo bước ---
            const cacBuoc = Object.keys(BUOC);
            const soBuoc = cacBuoc.map(b => lich.data.filter(l => l.trang_thai === b).length);
            veBieuDo('bd-tron', {
                type: 'doughnut',
                data: { labels: cacBuoc.map(b => BUOC[b]), datasets: [{ data: soBuoc, backgroundColor: MAU_BUOC, borderWidth: 2 }] },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { boxWidth: 12 } } }, cutout: '58%' }
            }, soBuoc.some(n => n > 0));
        }
    });
})();
