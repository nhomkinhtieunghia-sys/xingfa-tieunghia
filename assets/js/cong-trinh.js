// Trang Công trình: bản đồ Leaflet + danh sách công trình (đọc bảng cong_trinh),
// đánh giá đã duyệt + form gửi đánh giá (INSERT bảng danh_gia, chờ admin duyệt).
(function () {
    const NHOM = ['cua-sat', 'cua-nhom', 'nha-panel', 'tu-bep', 'mai-che', 'bao-tri'];
    const MAU_NHOM = { 'cua-sat': '#475569', 'cua-nhom': '#046BD2', 'nha-panel': '#E53935', 'tu-bep': '#F59E0B', 'mai-che': '#16A34A', 'bao-tri': '#7C3AED' };
    const TAM_TAY_NINH = [10.95, 106.35];

    let banDo = null, lopGhim = null;
    let congTrinh = [], danhGia = [];
    let boLoc = 'tat-ca';
    let soSaoChon = 0;
    const ghimTheoId = {};
    const $ = id => document.getElementById(id);
    const maHoa = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const tenNhom = ma => NHOM.includes(ma) ? TieuNghia.tenNhom(ma) : (ma || '');
    // chỉ cho phép đường dẫn ảnh nội bộ hoặc https
    const anhAnToan = url => (/^(assets\/|https:\/\/)/.test(url || '') ? url : 'assets/images/banner.jpg');

    // ---------- Bản đồ ----------
    function iconGhim(ma) {
        const mau = MAU_NHOM[ma] || '#1A2452';
        return L.divIcon({
            className: 'ct-ghim',
            html: `<span style="--mau:${mau}"></span>`,
            iconSize: [30, 40],
            iconAnchor: [15, 38],
            popupAnchor: [0, -34]
        });
    }

    function noiDungPopup(c) {
        return `<div class="ct-popup">
            <img src="${maHoa(anhAnToan(c.hinh_anh))}" alt="${maHoa(tuDB(c, 'ten'))}" loading="lazy">
            <div class="ct-popup-chu">
                <span class="ct-nhan" style="--mau:${MAU_NHOM[c.hang_muc] || '#1A2452'}">${maHoa(tenNhom(c.hang_muc))}</span>
                <strong>${maHoa(tuDB(c, 'ten'))}</strong>
                <span>📍 ${maHoa(tuDB(c, 'dia_diem'))}</span>
                ${c.nam ? `<span>📅 ${maHoa(t('congTrinh.nam'))} ${maHoa(c.nam)}</span>` : ''}
            </div>
        </div>`;
    }

    function khoiTaoBanDo() {
        if (typeof L === 'undefined') {
            $('ban-do').innerHTML = `<div class="ct-dang-tai">${maHoa(t('congTrinh.loiBanDo'))}</div>`;
            return;
        }
        banDo = L.map('ban-do', { scrollWheelZoom: false }).setView(TAM_TAY_NINH, 10);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(banDo);
        lopGhim = L.featureGroup().addTo(banDo);
        // bấm vào bản đồ mới cho cuộn chuột phóng to (tránh kẹt khi cuộn trang)
        banDo.on('click', () => banDo.scrollWheelZoom.enable());
        banDo.on('mouseout', () => banDo.scrollWheelZoom.disable());
    }

    function loc() {
        return congTrinh.filter(c => boLoc === 'tat-ca' || c.hang_muc === boLoc);
    }

    function veGhim() {
        if (!banDo) return;
        lopGhim.clearLayers();
        const ds = loc().filter(c => c.vi_do && c.kinh_do);
        ds.forEach(c => {
            const g = L.marker([c.vi_do, c.kinh_do], { icon: iconGhim(c.hang_muc), title: tuDB(c, 'ten') })
                .bindPopup(noiDungPopup(c), { maxWidth: 260, minWidth: 220 });
            g.on('click', () => danhDauThe(c.id));
            lopGhim.addLayer(g);
            ghimTheoId[c.id] = g;
        });
        if (ds.length) banDo.fitBounds(lopGhim.getBounds(), { padding: [40, 40], maxZoom: 13 });
    }

    function danhDauThe(id) {
        document.querySelectorAll('.ct-the').forEach(el => el.classList.toggle('active', Number(el.dataset.id) === id));
        const the = document.querySelector(`.ct-the[data-id="${id}"]`);
        if (the && window.innerWidth > 900) the.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function veDanhSach() {
        const ds = loc();
        const khung = $('ct-danh-sach');
        if (!ds.length) {
            khung.innerHTML = `<div class="ct-dang-tai">${maHoa(t('congTrinh.khongCo'))}</div>`;
            return;
        }
        khung.innerHTML = ds.map(c => `
            <button type="button" class="ct-the" data-id="${c.id}">
                <img src="${maHoa(anhAnToan(c.hinh_anh))}" alt="" loading="lazy">
                <div class="ct-the-chu">
                    <span class="ct-nhan" style="--mau:${MAU_NHOM[c.hang_muc] || '#1A2452'}">${maHoa(tenNhom(c.hang_muc))}</span>
                    <strong>${maHoa(tuDB(c, 'ten'))}</strong>
                    <span class="ct-dia-diem">📍 ${maHoa(tuDB(c, 'dia_diem'))}${c.nam ? ' · ' + maHoa(c.nam) : ''}</span>
                </div>
            </button>`).join('');
    }

    function veChips() {
        const cac = ['tat-ca', ...NHOM.filter(ma => congTrinh.some(c => c.hang_muc === ma))];
        $('ct-loc').innerHTML = cac.map(ma => `
            <button type="button" class="tk-chip ct-chip${boLoc === ma ? ' active' : ''}" data-loc="${ma}">
                ${ma === 'tat-ca' ? '' : `<i style="background:${MAU_NHOM[ma]}"></i>`}${maHoa(ma === 'tat-ca' ? t('congTrinh.tatCa') : tenNhom(ma))}
                <small>${ma === 'tat-ca' ? congTrinh.length : congTrinh.filter(c => c.hang_muc === ma).length}</small>
            </button>`).join('');
    }

    async function taiCongTrinh() {
        try {
            const { data, error } = await db.from('cong_trinh').select('*').order('thu_tu', { ascending: true });
            if (error) throw error;
            congTrinh = data || [];
            veChips();
            veDanhSach();
            veGhim();
        } catch (err) {
            console.error(err);
            $('ct-danh-sach').innerHTML = `<div class="ct-dang-tai">${maHoa(t('datLich.loiMang'))}</div>`;
        }
    }

    // ---------- Đánh giá ----------
    const chuoiSao = n => '★'.repeat(n) + '☆'.repeat(5 - n);

    function veDanhGia() {
        const tong = danhGia.length;
        const tb = tong ? danhGia.reduce((s, d) => s + d.so_sao, 0) / tong : 0;
        $('dg-diem').textContent = tong ? new Intl.NumberFormat(({ vi: 'vi-VN', en: 'en-US', zh: 'zh-CN' })[layNgonNgu()], { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(tb) : '–';
        $('dg-sao-lon').textContent = chuoiSao(Math.round(tb));
        $('dg-so-luot').textContent = t('congTrinh.soDanhGia').replace('{n}', tong);
        $('dg-phan-bo').innerHTML = [5, 4, 3, 2, 1].map(s => {
            const n = danhGia.filter(d => d.so_sao === s).length;
            const pt = tong ? Math.round(n * 100 / tong) : 0;
            return `<div class="dg-thanh"><span>${s} ★</span><div class="dg-ray"><i style="width:${pt}%"></i></div><span>${n}</span></div>`;
        }).join('');

        if (!tong) {
            $('dg-danh-sach').innerHTML = `<p class="ct-dang-tai">${maHoa(t('congTrinh.chuaCoDanhGia'))}</p>`;
            return;
        }
        $('dg-danh-sach').innerHTML = danhGia.map(d => {
            const anh = /^assets\//.test(d.anh_minh_hoa || '')
                ? `<img class="dg-anh" src="${maHoa(d.anh_minh_hoa)}" alt="${maHoa(t('trangChu.anhMinhHoa'))}" title="${maHoa(t('trangChu.anhMinhHoa'))}" loading="lazy">`
                : `<span class="dg-anh dg-chu-cai">${maHoa((d.ho_ten || 'K').trim().charAt(0).toUpperCase())}</span>`;
            return `<article class="dg-the">
                <header>${anh}
                    <div><strong>${maHoa(d.ho_ten)}</strong>
                    <span class="dg-sao">${chuoiSao(d.so_sao)}</span></div>
                    <time>${maHoa(dinhDangNgay(d.created_at))}</time>
                </header>
                <p>${maHoa(d.noi_dung)}</p>
                ${NHOM.includes(d.dich_vu) ? `<span class="ct-nhan" style="--mau:${MAU_NHOM[d.dich_vu]}">${maHoa(tenNhom(d.dich_vu))}</span>` : ''}
            </article>`;
        }).join('');
    }

    async function taiDanhGia() {
        try {
            const { data, error } = await db.from('danh_gia').select('ho_ten, so_sao, noi_dung, dich_vu, anh_minh_hoa, created_at')
                .eq('da_duyet', true).order('created_at', { ascending: false }).limit(50);
            if (error) throw error;
            danhGia = data || [];
            veDanhGia();
        } catch (err) {
            console.error(err);
            $('dg-danh-sach').innerHTML = `<p class="ct-dang-tai">${maHoa(t('datLich.loiMang'))}</p>`;
        }
    }

    function veChonDichVu() {
        const sel = $('dg-dich-vu');
        const cu = sel.value;
        sel.innerHTML = `<option value="">${maHoa(t('datLich.chonDichVu'))}</option>` + NHOM.map(ma => `<option value="${ma}">${maHoa(tenNhom(ma))}</option>`).join('');
        sel.value = cu;
    }

    function veSaoChon(hover) {
        const n = hover || soSaoChon;
        document.querySelectorAll('#dg-chon-sao button').forEach(b => {
            b.classList.toggle('sang', Number(b.dataset.sao) <= n);
            b.setAttribute('aria-checked', Number(b.dataset.sao) === soSaoChon);
        });
    }

    async function guiDanhGia(e) {
        e.preventDefault();
        const loi = $('dg-loi');
        loi.textContent = '';
        const hoTen = $('dg-ho-ten').value.trim();
        const noiDung = $('dg-noi-dung').value.trim();
        if (!hoTen || !soSaoChon || noiDung.length < 10) {
            loi.textContent = t('congTrinh.loiNhap');
            return;
        }
        const nut = $('nut-gui-dg');
        nut.disabled = true;
        nut.textContent = t('datLich.dangGui');
        try {
            // Không .select() sau insert: khách không được đọc đánh giá chưa duyệt
            const { error } = await db.from('danh_gia').insert({
                ho_ten: hoTen,
                so_sao: soSaoChon,
                noi_dung: noiDung,
                dich_vu: $('dg-dich-vu').value || null,
                ngon_ngu: layNgonNgu()
            });
            if (error) throw error;
            $('form-danh-gia').hidden = true;
            $('dg-cam-on').hidden = false;
            TieuNghia.toast(t('congTrinh.camOn'), 'thanh-cong');
        } catch (err) {
            console.error(err);
            loi.textContent = t('datLich.loiMang');
        } finally {
            nut.disabled = false;
            nut.textContent = t('congTrinh.nutGui');
        }
    }

    // ---------- Khởi tạo ----------
    document.addEventListener('DOMContentLoaded', () => {
        khoiTaoBanDo();
        veChonDichVu();
        taiCongTrinh();
        taiDanhGia();

        $('ct-loc').addEventListener('click', e => {
            const chip = e.target.closest('[data-loc]');
            if (!chip) return;
            boLoc = chip.dataset.loc;
            if (banDo) banDo.closePopup();
            veChips();
            veDanhSach();
            veGhim();
        });
        $('ct-danh-sach').addEventListener('click', e => {
            const the = e.target.closest('.ct-the');
            if (!the) return;
            const id = Number(the.dataset.id);
            const c = congTrinh.find(x => x.id === id);
            const g = ghimTheoId[id];
            danhDauThe(id);
            if (!banDo || !c || !g) return;
            if (window.innerWidth <= 900) $('ban-do').scrollIntoView({ behavior: 'smooth', block: 'center' });
            banDo.flyTo([c.vi_do, c.kinh_do], 14, { duration: 0.8 });
            // mở popup khi bay xong; dự phòng sau 1 giây nếu trình duyệt tạm dừng hiệu ứng
            let daMo = false;
            const moPopup = () => { if (!daMo) { daMo = true; g.openPopup(); } };
            banDo.once('moveend', moPopup);
            setTimeout(moPopup, 1000);
        });

        const khungSao = $('dg-chon-sao');
        khungSao.addEventListener('click', e => {
            const b = e.target.closest('[data-sao]');
            if (!b) return;
            soSaoChon = Number(b.dataset.sao);
            veSaoChon();
        });
        khungSao.addEventListener('mouseover', e => { const b = e.target.closest('[data-sao]'); if (b) veSaoChon(Number(b.dataset.sao)); });
        khungSao.addEventListener('mouseleave', () => veSaoChon());
        $('form-danh-gia').addEventListener('submit', guiDanhGia);

        // Link từ trang chủ: cong-trinh.html#danh-gia
        if (location.hash === '#danh-gia') setTimeout(() => $('danh-gia').scrollIntoView({ behavior: 'smooth' }), 600);
    });

    document.addEventListener('doi-ngon-ngu', () => {
        veChips();
        veDanhSach();
        veGhim();
        veDanhGia();
        veChonDichVu();
        if (!$('nut-gui-dg').disabled) $('nut-gui-dg').textContent = t('congTrinh.nutGui');
    });
})();
