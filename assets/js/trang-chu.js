document.addEventListener('DOMContentLoaded', () => {
    loadThongKe();
    loadSanPhamNoiBat();
    loadDanhGia();
    loadBaiVietMoi();
});

document.addEventListener('doi-ngon-ngu', () => {
    renderSanPhamNoiBat();
    renderDanhGia();
    renderBaiVietMoi();
});

let sanPhamNoiBatData = [];
let danhGiaData = [];

// 1. Thống kê số sản phẩm
async function loadThongKe() {
    try {
        const { count, error } = await db.from('san_pham').select('*', { count: 'exact', head: true });
        if (error) throw error;
        if (count !== null) {
            const productStat = document.querySelector('[data-i18n="trangChu.soSanPham"]');
            if (productStat) {
                const numEl = productStat.previousElementSibling.querySelector('span');
                if (numEl) {
                    numEl.dataset.dem = count;
                    numEl.innerText = count; // Gán cứng luôn
                }
            }
        }
    } catch (err) {
        console.error("Lỗi đếm số lượng SP:", err);
    }
}

// 2. Sản phẩm nổi bật
async function loadSanPhamNoiBat() {
    const grid = document.getElementById('san-pham-noi-bat-grid');
    if (!grid) return;
    
    // Khung loading
    grid.innerHTML = Array(6).fill(`
    <div class="the service-card skeleton-card">
        <div class="skeleton-img"></div>
        <div class="skeleton-title"></div>
        <div class="skeleton-desc"></div>
        <div class="skeleton-link"></div>
    </div>`).join('');
    
    try {
        const { data, error } = await db.from('san_pham')
            .select('*').eq('noi_bat', true).order('thu_tu').limit(6);
        if (error) throw error;
        sanPhamNoiBatData = data || [];
        renderSanPhamNoiBat();
    } catch (err) {
        console.error(err);
        grid.innerHTML = `<div class="error-msg">${t('sanPham.loiTai')}</div>`;
    }
}

function renderSanPhamNoiBat() {
    const grid = document.getElementById('san-pham-noi-bat-grid');
    if (!grid || !sanPhamNoiBatData.length) return;
    
    grid.innerHTML = sanPhamNoiBatData.map(sp => {
        const ten = tuDB(sp, 'ten');
        const moTa = tuDB(sp, 'mo_ta_ngan');
        const nhom = TieuNghia.tenNhom(sp.nhom);
        return `
            <a href="chi-tiet.html?id=${sp.id}" class="the service-card" style="text-decoration: none; display: flex; flex-direction: column; height: 100%;">
                <img src="${sp.hinh_anh || 'assets/images/cua-sat.jpg'}" alt="${ten}" loading="lazy" style="width:100%; aspect-ratio:4/3; object-fit:cover;">
                <div class="service-info" style="display: flex; flex-direction: column; flex-grow: 1;">
                    <span style="font-size:12px; color:var(--mau-phu); font-weight:600; text-transform:uppercase;">${nhom}</span>
                    <h3 style="color:var(--mau-chinh); margin: 8px 0; font-size: 18px;">${ten}</h3>
                    <p style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 15px;">${moTa}</p>
                    <span class="service-link" style="margin-top: auto; display: inline-block;">${t('trangChu.xemSanPham')}</span>
                </div>
            </a>
        `;
    }).join('');
    
    if (typeof apDungNgonNgu === 'function') apDungNgonNgu();
}

// 3. Đánh giá
async function loadDanhGia() {
    const grid = document.getElementById('danh-gia-list');
    if (!grid) return;
    
    // Khung loading
    grid.innerHTML = Array(3).fill(`
    <div class="the skeleton-card" style="padding: 20px;">
        <div class="skeleton-text"></div>
        <div class="skeleton-text" style="width: 80%"></div>
        <div class="skeleton-text" style="width: 50%"></div>
    </div>`).join('');

    try {
        const { data, error } = await db.from('danh_gia')
            .select('*').eq('da_duyet', true).order('created_at', { ascending: false }).limit(3);
        if (error) throw error;
        danhGiaData = data || [];
        renderDanhGia();
    } catch (err) {
        console.error(err);
        grid.innerHTML = `<div class="error-msg">Không thể tải đánh giá lúc này.</div>`;
    }
}

// Chống chèn mã: nội dung đánh giá do khách gõ nên phải mã hóa trước khi đưa vào HTML
function maHoaHTML(chu) {
    return String(chu ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function renderDanhGia() {
    const grid = document.getElementById('danh-gia-list');
    if (!grid || !danhGiaData.length) return;
    
    grid.innerHTML = danhGiaData.map(dg => {
        const sao = '⭐'.repeat(dg.so_sao || 5);
        let avatarHtml = '';
        if (dg.anh_minh_hoa) {
            avatarHtml = `
                <div class="avatar-wrapper">
                    <img src="${maHoaHTML(dg.anh_minh_hoa)}" alt="${t('trangChu.anhMinhHoa')}" class="avatar-img" loading="lazy">
                </div>
                <div class="avatar-label">${t('trangChu.anhMinhHoa')}</div>
            `;
        } else {
            const firstLetter = dg.ho_ten ? dg.ho_ten.charAt(0).toUpperCase() : 'K';
            avatarHtml = `
                <div class="avatar-fallback">${firstLetter}</div>
            `;
        }

        return `
            <div class="the value-card text-center" style="padding: 30px 20px; background: #fff; height: 100%; display: flex; flex-direction: column;">
                ${avatarHtml}
                <div style="font-size: 18px; margin-bottom: 15px; letter-spacing: 2px;">${sao}</div>
                <p style="font-style: italic; color: var(--mau-chu); margin-bottom: 20px; flex-grow: 1; display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden;">"${maHoaHTML(dg.noi_dung)}"</p>
                <div style="border-top: 1px solid #eee; padding-top: 15px;">
                    <div style="font-weight: 600; color: var(--mau-chinh);">${maHoaHTML(dg.ho_ten)}</div>
                    <div class="verified-badge">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        ${t('trangChu.daSuDungDichVu')}
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    if (typeof apDungNgonNgu === 'function') apDungNgonNgu();
}


// 4. Bài viết mới nhất (3 bài đã đăng)
let baiVietMoiData = [];
async function loadBaiVietMoi() {
    const khung = document.getElementById('tin-tuc-list');
    if (!khung) return;
    try {
        const { data, error } = await db.from('bai_viet')
            .select('slug, chuyen_muc, tieu_de, tieu_de_en, tieu_de_zh, tom_tat, tom_tat_en, tom_tat_zh, anh_dai_dien, ngay_dang')
            .eq('da_dang', true).order('ngay_dang', { ascending: false }).order('created_at', { ascending: false }).limit(3);
        if (error) throw error;
        baiVietMoiData = data || [];
        renderBaiVietMoi();
    } catch (err) {
        console.error(err);
        khung.innerHTML = '';
    }
}

function renderBaiVietMoi() {
    const khung = document.getElementById('tin-tuc-list');
    if (!khung || !baiVietMoiData.length) return;
    khung.classList.add('bv-luoi');
    khung.innerHTML = baiVietMoiData.map(bv => TieuNghia.theBaiViet(bv)).join('');
}
