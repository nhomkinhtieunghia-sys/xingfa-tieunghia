// Trang Thiết kế nhà panel 3D: bảng tùy chọn, tính toán, chia sẻ, chụp ảnh, gửi thiết kế (INSERT qua RPC)
// Mô hình 3D nằm ở nha-3d.js (tải sau, máy không hỗ trợ WebGL vẫn dùng được bảng tính).

// ====== TẤT CẢ TÙY CHỌN – sửa ở đây ======
const TUY_CHON = {
    congNang: {
        'nha-o':     { dai: 8,  rong: 5,  cao: 3.2, kieu_mai: '2-mai', loai_panel: 'PU',     do_day: 75,  so_cua_di: 2, so_cua_so: 4, mau_vach: 'trang-kem', mau_mai: 'do-do' },
        'nha-tro':   { dai: 12, rong: 4,  cao: 3,   kieu_mai: '1-mai', loai_panel: 'EPS',    do_day: 50,  so_cua_di: 4, so_cua_so: 4, mau_vach: 'trang-kem', mau_mai: 'xanh-duong' },
        'kho-xuong': { dai: 20, rong: 10, cao: 5,   kieu_mai: '2-mai', loai_panel: 'PU',     do_day: 100, so_cua_di: 2, so_cua_so: 2, mau_vach: 'xam-ghi',   mau_mai: 'xanh-duong' },
        'van-phong': { dai: 10, rong: 6,  cao: 3.2, kieu_mai: '1-mai', loai_panel: 'EPS',    do_day: 75,  so_cua_di: 1, so_cua_so: 6, mau_vach: 'trang-kem', mau_mai: 'xam-ghi' },
        'homestay':  { dai: 6,  rong: 4,  cao: 3,   kieu_mai: '2-mai', loai_panel: 'VAN-GO', do_day: 75,  so_cua_di: 1, so_cua_so: 3, mau_vach: 'van-go',    mau_mai: 'do-do' }
    },
    gioiHan: { dai: [3, 30, 0.5], rong: [3, 15, 0.5], cao: [2.8, 6, 0.1], so_cua_di: [1, 4, 1], so_cua_so: [0, 10, 1] },
    loaiPanel: ['EPS', 'PU', 'VAN-GO'],
    doDay: [50, 75, 100],
    kieuMai: ['1-mai', '2-mai'],
    mauVach: { 'trang-kem': '#F2EFE6', 'xam-ghi': '#9AA3AD', 'xanh-ngoc': '#2C7A7B', 'van-go': 'linear-gradient(135deg,#B7844C,#8A5A2B 45%,#B7844C 70%,#7A4E25)' },
    mauMai: { 'do-do': '#8B1E1E', 'xanh-duong': '#1F4E8C', 'xam-ghi': '#6B7280', 'trang': '#E5E7EB' },
    loaiCua: ['nhom-xingfa', 'panel']
};
const KHO_PANEL = 1.0; // m
const DOC_MAI = { '1-mai': 10, '2-mai': 15 };

let cauHinh = { cong_nang: 'nha-o', ...TUY_CHON.congNang['nha-o'], loai_cua: 'nhom-xingfa' };
let ketQua = {};
let Nha3D = null;
const $ = id => document.getElementById(id);

// ---------- Tiện ích ----------
const camel = ma => ma.toLowerCase().replace(/-([a-z])/g, (_, c) => c.toUpperCase());
const tenTuyChon = (nhom, ma) => t(`thietKe.${nhom}${camel(ma).charAt(0).toUpperCase()}${camel(ma).slice(1)}`);
const locale = () => ({ vi: 'vi-VN', en: 'en-US', zh: 'zh-CN' }[layNgonNgu()] || 'vi-VN');
const dinhDang = (so, le = 1) => new Intl.NumberFormat(locale(), { maximumFractionDigits: le }).format(so);
const maHoa = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function kep(so, [min, max, buoc]) {
    so = Number(so);
    if (!isFinite(so)) so = min;
    so = Math.min(max, Math.max(min, so));
    return Math.round(Math.round(so / buoc) * buoc * 10) / 10;
}

// Chuẩn hóa cấu hình (dùng cho ?tk= nhận từ link)
function chuanHoa(c) {
    const goc = TUY_CHON.congNang['nha-o'];
    const r = { ...cauHinh };
    r.cong_nang = TUY_CHON.congNang[c.cong_nang] ? c.cong_nang : 'nha-o';
    ['dai', 'rong', 'cao', 'so_cua_di', 'so_cua_so'].forEach(k => { r[k] = kep(c[k] ?? goc[k], TUY_CHON.gioiHan[k]); });
    r.loai_panel = TUY_CHON.loaiPanel.includes(c.loai_panel) ? c.loai_panel : goc.loai_panel;
    r.do_day = TUY_CHON.doDay.includes(Number(c.do_day)) ? Number(c.do_day) : goc.do_day;
    r.kieu_mai = TUY_CHON.kieuMai.includes(c.kieu_mai) ? c.kieu_mai : goc.kieu_mai;
    r.mau_vach = TUY_CHON.mauVach[c.mau_vach] ? c.mau_vach : goc.mau_vach;
    r.mau_mai = TUY_CHON.mauMai[c.mau_mai] ? c.mau_mai : goc.mau_mai;
    r.loai_cua = TUY_CHON.loaiCua.includes(c.loai_cua) ? c.loai_cua : 'nhom-xingfa';
    return r;
}

// Base64 an toàn tiếng Việt + an toàn trong URL
function maHoaTk(obj) {
    const bytes = new TextEncoder().encode(JSON.stringify(obj));
    let s = '';
    bytes.forEach(b => { s += String.fromCharCode(b); });
    return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function giaiMaTk(str) {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4) str += '=';
    const bytes = Uint8Array.from(atob(str), ch => ch.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
}

// ---------- Tính toán (DESIGN.md mục 8) ----------
function tinhKetQua(c) {
    const doc = (DOC_MAI[c.kieu_mai] || 15) * Math.PI / 180;
    const dtCua = c.so_cua_di * 0.9 * 2.2 + c.so_cua_so * 1.2 * 1.2;
    const dauHoi = c.kieu_mai === '2-mai' ? c.rong * c.rong * Math.tan(doc) / 2 : c.rong * c.rong * Math.tan(doc);
    const dtVach = 2 * (c.dai + c.rong) * c.cao + dauHoi - dtCua;
    const lam = x => Math.round(x * 10) / 10;
    return {
        dien_tich_san: lam(c.dai * c.rong),
        dien_tich_vach: lam(dtVach),
        dien_tich_mai: lam((c.dai + 0.6) * (c.rong + 0.6) / Math.cos(doc)),
        so_tam_panel: Math.ceil(dtVach / (KHO_PANEL * c.cao)),
        the_tich: lam(c.dai * c.rong * c.cao)
    };
}

function demSo(el, den) {
    const tu = Number(el.dataset.giaTri || 0);
    el.dataset.giaTri = den;
    const le = Number.isInteger(den) ? 0 : 1;
    const batDau = performance.now();
    const buoc = (tg) => {
        const p = Math.min(1, (tg - batDau) / 450);
        const v = tu + (den - tu) * (1 - Math.pow(1 - p, 3));
        el.textContent = dinhDang(p < 1 ? v : den, le);
        if (p < 1) requestAnimationFrame(buoc);
    };
    requestAnimationFrame(buoc);
    if (tu !== den) {
        el.parentElement.classList.remove('nhay');
        void el.parentElement.offsetWidth;
        el.parentElement.classList.add('nhay');
    }
}

// ---------- Vẽ bảng tùy chọn ----------
function veChips(idKhung, ds, truong, nhomI18n, giaTriHienThi) {
    const khung = $(idKhung);
    khung.innerHTML = ds.map(ma => `<button type="button" class="tk-chip${String(cauHinh[truong]) === String(ma) ? ' active' : ''}" data-truong="${truong}" data-gia-tri="${ma}">${maHoa(giaTriHienThi ? giaTriHienThi(ma) : tenTuyChon(nhomI18n, ma))}</button>`).join('');
}

function veMau(idKhung, bang, truong, nhomI18n) {
    $(idKhung).innerHTML = Object.entries(bang).map(([ma, mau]) =>
        `<button type="button" class="tk-mau${cauHinh[truong] === ma ? ' active' : ''}" data-truong="${truong}" data-gia-tri="${ma}" title="${maHoa(tenTuyChon(nhomI18n, ma))}" aria-label="${maHoa(tenTuyChon(nhomI18n, ma))}" style="background:${mau}"></button>`
    ).join('');
}

function veTuyChon() {
    veChips('ds-cong-nang', Object.keys(TUY_CHON.congNang), 'cong_nang', 'cn');
    veChips('ds-loai-panel', TUY_CHON.loaiPanel, 'loai_panel', 'panel');
    veChips('ds-do-day', TUY_CHON.doDay, 'do_day', '', ma => ma + ' mm');
    veChips('ds-kieu-mai', TUY_CHON.kieuMai, 'kieu_mai', 'mai');
    veChips('ds-loai-cua', TUY_CHON.loaiCua, 'loai_cua', 'cua');
    veMau('ds-mau-vach', TUY_CHON.mauVach, 'mau_vach', 'vach');
    veMau('ds-mau-mai', TUY_CHON.mauMai, 'mau_mai', 'maiMau');
    $('mo-ta-panel').textContent = tenTuyChon('moTaPanel', cauHinh.loai_panel);
    ['dai', 'rong', 'cao'].forEach(k => {
        $('truot-' + k).value = cauHinh[k];
        if (document.activeElement !== $('o-' + k)) $('o-' + k).value = cauHinh[k];
    });
    $('so-cua-di').textContent = cauHinh.so_cua_di;
    $('so-cua-so').textContent = cauHinh.so_cua_so;
}

function veKetQua() {
    ketQua = tinhKetQua(cauHinh);
    document.querySelectorAll('[data-kq]').forEach(el => demSo(el, ketQua[el.dataset.kq]));
}

// Mọi thay đổi đi qua đây
let hen3D = null;
let choCapNhat = false;
function capNhat3DNgay() {
    cancelAnimationFrame(hen3D);
    choCapNhat = false;
    if (Nha3D) Nha3D.capNhat(cauHinh);
}
// Chụp ảnh luôn lấy đúng thiết kế mới nhất (kể cả khi khung hình chưa kịp vẽ lại)
function chupAnhMoi(tuyChon) {
    if (!Nha3D) return null;
    if (choCapNhat) capNhat3DNgay();
    return Nha3D.chupAnh(tuyChon);
}
function apDung({ veLai = true } = {}) {
    if (veLai) veTuyChon();
    veKetQua();
    if (Nha3D) {
        // gộp các thay đổi liên tiếp khi kéo thanh trượt
        cancelAnimationFrame(hen3D);
        choCapNhat = true;
        hen3D = requestAnimationFrame(capNhat3DNgay);
    }
    document.dispatchEvent(new CustomEvent('tk-doi-cau-hinh'));
}

function chonGiaTri(truong, giaTri) {
    if (truong === 'cong_nang') {
        cauHinh = { ...cauHinh, cong_nang: giaTri, ...TUY_CHON.congNang[giaTri] };
    } else if (truong === 'do_day') {
        cauHinh.do_day = Number(giaTri);
    } else {
        cauHinh[truong] = giaTri;
        if (truong === 'loai_panel' && giaTri === 'VAN-GO') cauHinh.mau_vach = 'van-go';
        if (truong === 'loai_panel' && giaTri !== 'VAN-GO' && cauHinh.mau_vach === 'van-go') cauHinh.mau_vach = 'trang-kem';
    }
    apDung();
}

// ---------- Tabs ----------
function moTab(ten) {
    document.querySelectorAll('.tk-tab').forEach(b => b.classList.toggle('active', b.dataset.tab === ten));
    document.querySelectorAll('.tk-panel').forEach(p => p.classList.toggle('active', p.id === 'tab-' + ten));
    if (ten === 'gui') veTomTat();
    document.dispatchEvent(new CustomEvent('tk-doi-tab', { detail: ten }));
    const tabs = document.querySelector('.tk-tabs');
    if (tabs.getBoundingClientRect().top < 0) tabs.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ---------- Chụp, chia sẻ ----------
function taiXuong(url, ten) {
    const a = document.createElement('a');
    a.href = url;
    a.download = ten;
    document.body.appendChild(a);
    a.click();
    a.remove();
}

function linkChiaSe() {
    const u = new URL(location.href);
    u.search = '';
    u.hash = '';
    u.searchParams.set('tk', maHoaTk(cauHinh));
    return u.toString();
}

async function saoChep(chu) {
    try {
        await navigator.clipboard.writeText(chu);
        return true;
    } catch (e) {
        const o = document.createElement('textarea');
        o.value = chu;
        o.style.position = 'fixed';
        o.style.opacity = '0';
        document.body.appendChild(o);
        o.select();
        let ok = false;
        try { ok = document.execCommand('copy'); } catch (_) { /* bỏ qua */ }
        o.remove();
        return ok;
    }
}

// ---------- Tab Gửi thiết kế ----------
function veTomTat() {
    const c = cauHinh;
    const dong = (nhan, gt) => `<dt>${maHoa(nhan)}</dt><dd>${maHoa(gt)}</dd>`;
    $('ds-tom-tat').innerHTML =
        dong(t('thietKe.nhomCongNang'), tenTuyChon('cn', c.cong_nang)) +
        dong(t('thietKe.nhomKichThuoc'), `${dinhDang(c.dai)} × ${dinhDang(c.rong)} × ${dinhDang(c.cao)} m`) +
        dong(t('thietKe.nhomPanel'), `${tenTuyChon('panel', c.loai_panel)} · ${c.do_day} mm`) +
        dong(t('thietKe.nhomMai'), tenTuyChon('mai', c.kieu_mai)) +
        dong(t('thietKe.mauVach'), tenTuyChon('vach', c.mau_vach)) +
        dong(t('thietKe.mauMai'), tenTuyChon('maiMau', c.mau_mai)) +
        dong(t('thietKe.soCuaDi'), `${c.so_cua_di} · ${tenTuyChon('cua', c.loai_cua)}`) +
        dong(t('thietKe.soCuaSo'), String(c.so_cua_so));
    const k = ketQua;
    $('ds-ket-qua-gui').innerHTML =
        dong(t('thietKe.dtSan'), dinhDang(k.dien_tich_san) + ' m²') +
        dong(t('thietKe.dtVach'), dinhDang(k.dien_tich_vach) + ' m²') +
        dong(t('thietKe.dtMai'), dinhDang(k.dien_tich_mai) + ' m²') +
        dong(t('thietKe.soTam'), dinhDang(k.so_tam_panel, 0) + ' ' + t('thietKe.tamUocTinh')) +
        dong(t('thietKe.theTich'), dinhDang(k.the_tich) + ' m³') +
        dong(t('thietKe.gia'), t('thietKe.lienHe'));
    const anh = chupAnhMoi({ nenTrongSuot: false });
    $('anh-tom-tat').hidden = !anh;
    if (anh) $('anh-tom-tat').src = anh;
}

async function guiThietKe(e) {
    e.preventDefault();
    const loi = $('tg-loi');
    loi.textContent = '';
    const hoTen = $('tg-ho-ten').value.trim();
    const sdt = $('tg-sdt').value.trim();
    if (!hoTen || !/^0[35789][0-9]{8}$/.test(sdt)) {
        loi.textContent = t('thietKe.loiNhap');
        return;
    }
    const nut = $('nut-gui-tk');
    nut.disabled = true;
    nut.textContent = t('datLich.dangGui');
    try {
        const { data, error } = await db.rpc('gui_thiet_ke_nha', {
            p_ho_ten: hoTen,
            p_so_dien_thoai: sdt,
            p_dia_chi: $('tg-dia-chi').value.trim() || null,
            p_ghi_chu: $('tg-ghi-chu').value.trim() || null,
            p_cau_hinh: cauHinh,
            p_ket_qua: tinhKetQua(cauHinh),
            p_ngon_ngu: layNgonNgu()
        });
        if (error || !data) throw error || new Error('no data');
        $('ma-tk-moi').textContent = data;
        $('khung-gui').hidden = true;
        $('tg-thanh-cong').hidden = false;
        $('tg-thanh-cong').scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (err) {
        console.error(err);
        loi.textContent = t('datLich.loiMang');
    } finally {
        nut.disabled = false;
        nut.textContent = t('thietKe.nutGui');
    }
}

// ---------- Khởi tạo ----------
function ganSuKien() {
    $('bang-tuy-chon').addEventListener('click', e => {
        const chip = e.target.closest('[data-truong][data-gia-tri]');
        if (chip) chonGiaTri(chip.dataset.truong, chip.dataset.giaTri);
        const dem = e.target.closest('[data-dem]');
        if (dem) {
            const k = dem.dataset.dem;
            cauHinh[k] = kep(cauHinh[k] + Number(dem.dataset.buoc), TUY_CHON.gioiHan[k]);
            apDung();
        }
    });
    ['dai', 'rong', 'cao'].forEach(k => {
        $('truot-' + k).addEventListener('input', e => {
            cauHinh[k] = kep(e.target.value, TUY_CHON.gioiHan[k]);
            $('o-' + k).value = cauHinh[k];
            apDung({ veLai: false });
        });
        $('o-' + k).addEventListener('change', e => {
            cauHinh[k] = kep(e.target.value, TUY_CHON.gioiHan[k]);
            e.target.value = cauHinh[k];
            $('truot-' + k).value = cauHinh[k];
            apDung({ veLai: false });
        });
    });

    document.querySelectorAll('.tk-tab').forEach(b => b.addEventListener('click', () => moTab(b.dataset.tab)));
    document.addEventListener('click', e => {
        const nut = e.target.closest('[data-mo-tab]');
        if (nut) moTab(nut.dataset.moTab);
    });

    document.querySelectorAll('[data-goc]').forEach(b => b.addEventListener('click', () => Nha3D && Nha3D.datGocNhin(b.dataset.goc)));
    $('nut-tu-xoay').addEventListener('click', () => {
        const bat = !$('nut-tu-xoay').classList.contains('active');
        $('nut-tu-xoay').classList.toggle('active', bat);
        if (Nha3D) Nha3D.batTuXoay(bat);
    });
    $('khung-3d').addEventListener('tat-tu-xoay', () => $('nut-tu-xoay').classList.remove('active'));
    $('nut-chup').addEventListener('click', () => {
        if (!Nha3D) { TieuNghia.toast(t('thietKe.khongCo3D'), 'loi'); return; }
        taiXuong(chupAnhMoi({ nenTrongSuot: false }), 'thiet-ke-nha-panel-tieu-nghia.png');
        TieuNghia.toast(t('thietKe.daChup'), 'thanh-cong');
    });
    $('nut-chia-se').addEventListener('click', async () => {
        const link = linkChiaSe();
        history.replaceState(null, '', link);
        const ok = await saoChep(link);
        TieuNghia.toast(ok ? t('thietKe.daSaoChepLink') : link, ok ? 'thanh-cong' : 'info');
    });

    $('form-gui-tk').addEventListener('submit', guiThietKe);
    $('nut-thiet-ke-moi').addEventListener('click', () => {
        $('form-gui-tk').reset();
        $('tg-thanh-cong').hidden = true;
        $('khung-gui').hidden = false;
        moTab('3d');
    });

    document.addEventListener('doi-ngon-ngu', () => {
        veTuyChon();
        document.querySelectorAll('[data-kq]').forEach(el => { el.textContent = dinhDang(Number(el.dataset.giaTri || 0), Number.isInteger(Number(el.dataset.giaTri)) ? 0 : 1); });
        if ($('tab-gui').classList.contains('active')) veTomTat();
        if (!$('nut-gui-tk').disabled) $('nut-gui-tk').textContent = t('thietKe.nutGui');
    });
}

async function tai3D() {
    const khung = $('khung-3d');
    try {
        const mod = await import('./nha-3d.js');
        if (!mod.hoTroWebGL()) throw new Error('webgl');
        mod.khoiTao(khung);
        Nha3D = mod;
        Nha3D.capNhat(cauHinh);
        $('dang-tai-3d').remove();
        document.dispatchEvent(new CustomEvent('tk-3d-san-sang'));
    } catch (err) {
        console.warn('Không tải được 3D:', err);
        $('dang-tai-3d').innerHTML = `<span>⚠️ ${maHoa(t('thietKe.khongCo3D'))}</span>`;
        $('dang-tai-3d').classList.add('loi');
    }
}

function khoiDong() {
    const tham = new URLSearchParams(location.search);
    if (tham.get('tk')) {
        try {
            cauHinh = chuanHoa(giaiMaTk(tham.get('tk')));
        } catch (e) {
            console.warn('Link thiết kế không hợp lệ', e);
        }
    } else if (tham.get('cong_nang') && TUY_CHON.congNang[tham.get('cong_nang')]) {
        cauHinh = { ...cauHinh, cong_nang: tham.get('cong_nang'), ...TUY_CHON.congNang[tham.get('cong_nang')] };
    }
    ganSuKien();
    apDung();
    if (['anh', 'gui'].includes(tham.get('tab'))) moTab(tham.get('tab'));
    tai3D();
}

// Cho thu-anh.js dùng chung
window.ThietKe3D = {
    chupAnh: chupAnhMoi,
    sanSang: () => !!Nha3D,
    moTab,
    layCauHinh: () => ({ ...cauHinh })
};

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', khoiDong);
else khoiDong();
