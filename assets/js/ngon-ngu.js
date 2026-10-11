// Quản lý đa ngôn ngữ
let ngonNguHienTai = localStorage.getItem('ngon_ngu') || 'vi';

// Đọc lang từ URL nếu có
const params = new URLSearchParams(window.location.search);
if (params.has('lang')) {
    ngonNguHienTai = params.get('lang');
    localStorage.setItem('ngon_ngu', ngonNguHienTai);
}

// Hàm lấy chữ
function t(khoa) {
    const dict = window[`lang_${ngonNguHienTai}`] || window['lang_vi'];
    const parts = khoa.split('.');
    let result = dict;
    for (let p of parts) {
        if (result && result[p]) {
            result = result[p];
        } else {
            // Fallback to vi
            let resVi = window['lang_vi'];
            for (let p2 of parts) {
                if (resVi) resVi = resVi[p2];
            }
            return resVi || khoa;
        }
    }
    return result;
}

// Lấy từ CSDL theo ngôn ngữ
function tuDB(dong, tenCot) {
    if (ngonNguHienTai === 'en' && dong[`${tenCot}_en`]) return dong[`${tenCot}_en`];
    if (ngonNguHienTai === 'zh' && dong[`${tenCot}_zh`]) return dong[`${tenCot}_zh`];
    return dong[tenCot];
}

// Đổi ngôn ngữ
function doiNgonNgu(lang) {
    ngonNguHienTai = lang;
    localStorage.setItem('ngon_ngu', lang);
    apDungNgonNgu();
    
    // Phát sự kiện để các trang tự render lại nếu cần
    document.dispatchEvent(new CustomEvent('doi-ngon-ngu', { detail: lang }));
}

function layNgonNgu() {
    return ngonNguHienTai;
}

// Áp dụng ngôn ngữ vào HTML hiện tại
function apDungNgonNgu() {
    document.documentElement.lang = ngonNguHienTai === 'zh' ? 'zh-CN' : ngonNguHienTai;
    
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        el.textContent = t(el.getAttribute('data-i18n'));
    });
    
    // Chữ gợi ý trong ô nhập (placeholder)
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
    });

    // Cập nhật thẻ select
    const select = document.getElementById('chon-ngon-ngu');
    if (select) select.value = ngonNguHienTai;
    
    // Cập nhật title
    const titleEl = document.querySelector('title[data-i18n]');
    if (titleEl) {
        document.title = t(titleEl.getAttribute('data-i18n'));
    }
}

// Định dạng số
function dinhDangSo(so) {
    const locales = { 'vi': 'vi-VN', 'en': 'en-US', 'zh': 'zh-CN' };
    return new Intl.NumberFormat(locales[ngonNguHienTai]).format(so);
}

// Định dạng ngày
function dinhDangNgay(ngayStr) {
    if (!ngayStr) return '';
    const date = new Date(ngayStr);
    const locales = { 'vi': 'vi-VN', 'en': 'en-US', 'zh': 'zh-CN' };
    return new Intl.DateTimeFormat(locales[ngonNguHienTai]).format(date);
}

document.addEventListener('DOMContentLoaded', () => {
    apDungNgonNgu();
});
