// Trang Đặt lịch & Tiến độ: đặt lịch khảo sát (INSERT qua RPC), tra cứu tiến độ,
// đổi lịch và hủy lịch (UPDATE qua RPC). Khách không đọc bảng trực tiếp – chỉ gọi hàm.
(function () {
    const NHOM = ['cua-sat', 'cua-nhom', 'nha-panel', 'tu-bep', 'mai-che', 'bao-tri'];
    const CAC_BUOC = ['cho_xac_nhan', 'da_xac_nhan', 'da_khao_sat', 'da_bao_gia', 'dang_gia_cong', 'dang_lap_dat', 'hoan_thanh'];
    const SDT_HOP_LE = /^0[35789][0-9]{8}$/;

    let ketQua = null;          // dữ liệu tra cứu gần nhất
    let thongTinTra = null;     // { ma, sdt } dùng cho đổi / hủy

    const $ = id => document.getElementById(id);

    function maHoa(chu) {
        return String(chu ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    }

    function homNay() {
        const d = new Date();
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        return d.toISOString().slice(0, 10);
    }

    function tenDichVu(ma) {
        return ma ? TieuNghia.tenNhom(ma) : '—';
    }

    function ngayGio(chuoi) {
        const loc = { vi: 'vi-VN', en: 'en-US', zh: 'zh-CN' }[layNgonNgu()] || 'vi-VN';
        return new Intl.DateTimeFormat(loc, { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(chuoi));
    }

    // ---------- Tabs ----------
    function moTab(ten) {
        document.querySelectorAll('.dl-tab').forEach(b => b.classList.toggle('active', b.dataset.tab === ten));
        $('panel-dat').classList.toggle('active', ten === 'dat');
        $('panel-tra').classList.toggle('active', ten === 'tra');
    }

    // ---------- Ô chọn dịch vụ ----------
    function veDichVu() {
        const sel = $('dl-dich-vu');
        const dangChon = sel.value || new URLSearchParams(location.search).get('dich_vu') || '';
        sel.innerHTML = `<option value="">${maHoa(t('datLich.chonDichVu'))}</option>` +
            NHOM.map(ma => `<option value="${ma}">${maHoa(tenDichVu(ma))}</option>`).join('');
        if (NHOM.includes(dangChon)) sel.value = dangChon;
    }

    // ---------- Đặt lịch ----------
    async function datLich(e) {
        e.preventDefault();
        const loi = $('dl-loi-dat');
        loi.textContent = '';
        const hoTen = $('dl-ho-ten').value.trim();
        const sdt = $('dl-sdt').value.trim();
        const diaChi = $('dl-dia-chi').value.trim();
        const ngay = $('dl-ngay').value;
        if (!hoTen || !SDT_HOP_LE.test(sdt) || !diaChi || !ngay) {
            loi.textContent = t('datLich.loiNhap');
            return;
        }
        if (ngay < homNay()) {
            loi.textContent = t('datLich.loiNgay');
            return;
        }
        const nut = $('nut-dat');
        nut.disabled = true;
        nut.textContent = t('datLich.dangGui');
        try {
            const { data, error } = await db.rpc('dat_lich_khao_sat', {
                p_ho_ten: hoTen,
                p_so_dien_thoai: sdt,
                p_dia_chi: diaChi,
                p_dich_vu: $('dl-dich-vu').value || null,
                p_ngay_hen: ngay,
                p_buoi: document.querySelector('input[name="dl-buoi"]:checked').value,
                p_ghi_chu: $('dl-ghi-chu').value.trim() || null,
                p_ngon_ngu: layNgonNgu()
            });
            if (error || !data) throw error || new Error('no data');
            thongTinTra = { ma: data, sdt };
            $('ma-lich-moi').textContent = data;
            $('khung-form-dat').hidden = true;
            $('hop-thanh-cong').hidden = false;
            $('hop-thanh-cong').scrollIntoView({ behavior: 'smooth', block: 'center' });
        } catch (err) {
            console.error(err);
            loi.textContent = t('datLich.loiMang');
        } finally {
            nut.disabled = false;
            nut.textContent = t('datLich.nutDat');
        }
    }

    // ---------- Tra cứu ----------
    async function traCuu(ma, sdt) {
        const loi = $('dl-loi-tra');
        loi.textContent = '';
        ma = ma.trim().toUpperCase();
        sdt = sdt.trim();
        if (!ma || !SDT_HOP_LE.test(sdt)) {
            loi.textContent = t('datLich.khongTimThay');
            return;
        }
        const nut = $('nut-tra-cuu');
        nut.disabled = true;
        try {
            const { data, error } = await db.rpc('tra_cuu_lich', { p_ma_lich: ma, p_so_dien_thoai: sdt });
            if (error) throw error;
            if (!data) {
                ketQua = null;
                $('ket-qua-tra-cuu').innerHTML = '';
                loi.textContent = t('datLich.khongTimThay');
                return;
            }
            ketQua = data;
            thongTinTra = { ma, sdt };
            veKetQua();
        } catch (err) {
            console.error(err);
            loi.textContent = t('datLich.loiMang');
        } finally {
            nut.disabled = false;
        }
    }

    function veKetQua() {
        const khung = $('ket-qua-tra-cuu');
        if (!ketQua) { khung.innerHTML = ''; return; }
        const l = ketQua.lich;
        const tienDo = ketQua.tien_do || [];
        const daHuy = l.trang_thai === 'da_huy';
        const viTri = CAC_BUOC.indexOf(l.trang_thai);
        const choPhepDoi = l.trang_thai === 'cho_xac_nhan' || l.trang_thai === 'da_xac_nhan';
        const buoi = l.buoi === 'chieu' ? t('datLich.chieu') : t('datLich.sang');

        const dong = (nhan, giaTri) => `<div class="dl-tt-dong"><span>${maHoa(nhan)}</span><strong>${maHoa(giaTri)}</strong></div>`;

        const cacMuc = CAC_BUOC.map((buoc, i) => {
            const ghi = tienDo.filter(x => x.buoc === buoc);
            let lop = 'tuong-lai';
            if (l.trang_thai === 'hoan_thanh' || (viTri >= 0 && i < viTri)) lop = 'xong';
            else if (i === viTri) lop = 'hien-tai';
            else if (daHuy && ghi.length) lop = 'xong';
            const chiTiet = ghi.map(x => `<div class="dl-tl-ghi"><time>${maHoa(ngayGio(x.thoi_gian))}</time>${x.ghi_chu ? ' · ' + maHoa(x.ghi_chu) : ''}</div>`).join('');
            return `<li class="dl-tl-muc ${lop}">
                <span class="dl-tl-cham">${lop === 'xong' ? '✓' : i + 1}</span>
                <div class="dl-tl-noi-dung">
                    <div class="dl-tl-ten">${maHoa(t('buoc.' + buoc))}${lop === 'hien-tai' ? ` <em class="dl-nhan-hien-tai">${maHoa(t('datLich.hienTai'))}</em>` : ''}</div>
                    ${chiTiet}
                </div>
            </li>`;
        }).join('');

        const ghiHuy = tienDo.filter(x => x.buoc === 'da_huy').pop();
        const bangHuy = daHuy ? `<div class="dl-bang-huy">✕ ${maHoa(t('datLich.daHuyBang'))}${ghiHuy ? ` · <time>${maHoa(ngayGio(ghiHuy.thoi_gian))}</time>` : ''}</div>` : '';

        khung.innerHTML = `
        <div class="dl-the dl-ket-qua">
            <div class="dl-kq-dau">
                <h3>${maHoa(t('datLich.thongTinLich'))} <span class="dl-ma-nho">${maHoa(l.ma_lich)}</span></h3>
                <span class="dl-trang-thai tt-${maHoa(l.trang_thai)}">${maHoa(t('buoc.' + l.trang_thai))}</span>
            </div>
            <div class="dl-tt-luoi">
                ${dong(t('datLich.khachHang'), l.ho_ten)}
                ${dong(t('datLich.dichVu'), tenDichVu(l.dich_vu))}
                ${dong(t('datLich.ngay'), dinhDangNgay(l.ngay_hen) + ' · ' + buoi)}
                ${dong(t('datLich.diaChi').replace(' *', ''), l.dia_chi_cong_trinh)}
            </div>
            ${bangHuy}
            <h4 class="dl-tl-tieu-de">${maHoa(t('datLich.tienDo'))}</h4>
            <ol class="dl-timeline">${cacMuc}</ol>
            ${choPhepDoi ? `<div class="dl-hang-nut dl-hang-nut-trai">
                <button type="button" class="btn-phu" id="nut-mo-doi">${maHoa(t('datLich.nutDoi'))}</button>
                <button type="button" class="btn-phu dl-nut-huy" id="nut-mo-huy">${maHoa(t('datLich.nutHuy'))}</button>
            </div>` : ''}
        </div>`;

        if (choPhepDoi) {
            $('nut-mo-doi').addEventListener('click', () => moModal('modal-doi'));
            $('nut-mo-huy').addEventListener('click', () => moModal('modal-huy'));
        }
    }

    // ---------- Modal ----------
    function moModal(id) {
        if (id === 'modal-doi' && ketQua) {
            $('doi-ngay').min = homNay();
            $('doi-ngay').value = ketQua.lich.ngay_hen >= homNay() ? ketQua.lich.ngay_hen : homNay();
            const r = document.querySelector(`input[name="doi-buoi"][value="${ketQua.lich.buoi}"]`);
            if (r) r.checked = true;
            $('dl-loi-doi').textContent = '';
        }
        $(id).hidden = false;
        requestAnimationFrame(() => $(id).classList.add('hien'));
    }
    function dongModal() {
        document.querySelectorAll('.dl-modal-nen').forEach(m => { m.classList.remove('hien'); m.hidden = true; });
    }

    async function luuDoiLich() {
        const ngay = $('doi-ngay').value;
        if (!ngay || ngay < homNay()) { $('dl-loi-doi').textContent = t('datLich.loiNgay'); return; }
        const nut = $('nut-luu-doi');
        nut.disabled = true;
        try {
            const { data, error } = await db.rpc('doi_lich', {
                p_ma_lich: thongTinTra.ma, p_so_dien_thoai: thongTinTra.sdt,
                p_ngay_hen: ngay, p_buoi: document.querySelector('input[name="doi-buoi"]:checked').value, p_ghi_chu: null
            });
            if (error) throw error;
            dongModal();
            if (data) TieuNghia.toast(t('datLich.daDoi'), 'thanh-cong');
            else TieuNghia.toast(t('datLich.khongDoiDuoc'), 'loi');
            await traCuu(thongTinTra.ma, thongTinTra.sdt);
        } catch (err) {
            console.error(err);
            $('dl-loi-doi').textContent = t('datLich.loiMang');
        } finally {
            nut.disabled = false;
        }
    }

    async function xacNhanHuy() {
        const nut = $('nut-xac-nhan-huy');
        nut.disabled = true;
        try {
            const { data, error } = await db.rpc('huy_lich', { p_ma_lich: thongTinTra.ma, p_so_dien_thoai: thongTinTra.sdt });
            if (error) throw error;
            dongModal();
            if (data) TieuNghia.toast(t('datLich.daHuy'), 'thanh-cong');
            else TieuNghia.toast(t('datLich.khongDoiDuoc'), 'loi');
            await traCuu(thongTinTra.ma, thongTinTra.sdt);
        } catch (err) {
            console.error(err);
            dongModal();
            TieuNghia.toast(t('datLich.loiMang'), 'loi');
        } finally {
            nut.disabled = false;
        }
    }

    // ---------- Khởi tạo ----------
    document.addEventListener('DOMContentLoaded', () => {
        const tham = new URLSearchParams(location.search);
        $('dl-ngay').min = homNay();
        veDichVu();

        document.querySelectorAll('.dl-tab').forEach(b => b.addEventListener('click', () => moTab(b.dataset.tab)));
        $('form-dat-lich').addEventListener('submit', datLich);
        $('form-tra-cuu').addEventListener('submit', e => {
            e.preventDefault();
            traCuu($('tc-ma').value, $('tc-sdt').value);
        });

        $('nut-sao-chep').addEventListener('click', async () => {
            const ma = $('ma-lich-moi').textContent;
            try { await navigator.clipboard.writeText(ma); } catch (_) { /* trình duyệt chặn – bỏ qua */ }
            TieuNghia.toast(t('datLich.daSaoChep'), 'thanh-cong');
        });
        $('nut-xem-tien-do').addEventListener('click', () => {
            $('tc-ma').value = thongTinTra.ma;
            $('tc-sdt').value = thongTinTra.sdt;
            moTab('tra');
            traCuu(thongTinTra.ma, thongTinTra.sdt);
        });
        $('nut-dat-khac').addEventListener('click', () => {
            $('form-dat-lich').reset();
            veDichVu();
            $('hop-thanh-cong').hidden = true;
            $('khung-form-dat').hidden = false;
        });

        document.querySelectorAll('[data-dong-modal]').forEach(b => b.addEventListener('click', dongModal));
        document.querySelectorAll('.dl-modal-nen').forEach(m => m.addEventListener('click', e => { if (e.target === m) dongModal(); }));
        document.addEventListener('keydown', e => { if (e.key === 'Escape') dongModal(); });
        $('nut-luu-doi').addEventListener('click', luuDoiLich);
        $('nut-xac-nhan-huy').addEventListener('click', xacNhanHuy);

        // Link có ?ma=TN-xxxx → mở sẵn tab tra cứu
        if (tham.get('ma')) {
            $('tc-ma').value = tham.get('ma').toUpperCase();
            moTab('tra');
            $('tc-sdt').focus();
        } else if (tham.get('tab') === 'tra') {
            moTab('tra');
        }
    });

    // Đổi ngôn ngữ → vẽ lại phần sinh bằng JS
    document.addEventListener('doi-ngon-ngu', () => {
        veDichVu();
        veKetQua();
        const nut = $('nut-dat');
        if (nut && !nut.disabled) nut.textContent = t('datLich.nutDat');
    });
})();
