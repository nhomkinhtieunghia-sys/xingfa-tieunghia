let tatCaSanPham = [];
let sanPhamHienThi = [];
let nhomHienTai = '';

document.addEventListener('DOMContentLoaded', () => {
    // Đọc URL param ?nhom=
    const params = new URLSearchParams(window.location.search);
    nhomHienTai = params.get('nhom') || '';
    
    // Gán trạng thái active cho chip
    const chips = document.querySelectorAll('.chip');
    chips.forEach(chip => {
        if (chip.dataset.nhom === nhomHienTai) {
            chips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
        }
        
        chip.addEventListener('click', () => {
            chips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            nhomHienTai = chip.dataset.nhom;
            locSanPham();
        });
    });
    
    // Sự kiện tìm kiếm
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            locSanPham(e.target.value);
        });
    }

    loadSanPham();
});

document.addEventListener('doi-ngon-ngu', () => {
    renderSanPham();
});

async function loadSanPham() {
    const grid = document.getElementById('san-pham-grid');
    if (!grid) return;
    
    grid.innerHTML = Array(6).fill(`
    <div class="the service-card skeleton-card">
        <div class="skeleton-img"></div>
        <div class="skeleton-title"></div>
        <div class="skeleton-desc"></div>
        <div class="skeleton-link"></div>
    </div>`).join('');
    
    try {
        const { data, error } = await db.from('san_pham').select('*').order('thu_tu');
        if (error) throw error;
        tatCaSanPham = data || [];
        locSanPham();
    } catch (err) {
        console.error("Lỗi tải sản phẩm:", err);
        grid.innerHTML = `<div class="error-msg">${t('sanPham.loiTai')}</div>`;
    }
}

function locSanPham(tuKhoa = document.getElementById('search-input')?.value || '') {
    tuKhoa = tuKhoa.toLowerCase().trim();
    
    sanPhamHienThi = tatCaSanPham.filter(sp => {
        const matchNhom = nhomHienTai === '' || sp.nhom === nhomHienTai;
        const ten = tuDB(sp, 'ten').toLowerCase();
        const matchTen = tuKhoa === '' || ten.includes(tuKhoa);
        return matchNhom && matchTen;
    });
    
    renderSanPham();
}

function renderSanPham() {
    const grid = document.getElementById('san-pham-grid');
    if (!grid) return;
    
    if (sanPhamHienThi.length === 0) {
        grid.innerHTML = `<div class="empty-msg">${t('sanPham.khongTimThay')}</div>`;
        return;
    }
    
    grid.innerHTML = sanPhamHienThi.map(sp => {
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
