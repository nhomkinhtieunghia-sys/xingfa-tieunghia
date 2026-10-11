let currentProduct = null;
let currentQuantity = 1;

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    
    if (!id) {
        showError();
        return;
    }

    // Modal ảnh
    const modal = document.getElementById('image-modal');
    if(modal) {
        modal.addEventListener('click', () => modal.style.display = 'none');
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'flex') {
                modal.style.display = 'none';
            }
        });
    }

    loadProduct(id);
});

document.addEventListener('doi-ngon-ngu', () => {
    if (currentProduct) {
        renderProduct(currentProduct);
        document.title = tuDB(currentProduct, 'ten') + ' - Xingfa Tiếu Nghĩa';
    }
});

async function loadProduct(id) {
    try {
        const { data, error } = await db.from('san_pham').select('*').eq('id', id).single();
        if (error || !data) throw error;
        
        currentProduct = data;
        renderProduct(currentProduct);
        document.title = tuDB(currentProduct, 'ten') + ' - Xingfa Tiếu Nghĩa';
        
        // Load related
        loadRelated(data.nhom, data.id);
    } catch (err) {
        console.error(err);
        showError();
    }
}

function showError() {
    const container = document.getElementById('product-detail-container');
    container.innerHTML = `
        <div class="empty-msg" style="padding: 60px 20px;">
            <h2 style="margin-bottom: 20px;">${t('sanPham.khongTimThay') || "Không tìm thấy sản phẩm"}</h2>
            <a href="san-pham.html" class="btn btn-chinh">${t('sanPham.quayLai') || "Quay lại sản phẩm"}</a>
        </div>
    `;
    document.getElementById('page-title').innerText = t('sanPham.khongTimThay') || "Lỗi";
    document.getElementById('bc-name').innerText = "Lỗi";
}

function renderProduct(sp) {
    const container = document.getElementById('product-detail-container');
    
    const ten = tuDB(sp, 'ten');
    const nhom = TieuNghia.tenNhom(sp.nhom);
    // Ưu tiên hiển thị mô tả chi tiết, nếu trống thì dùng mô tả ngắn
    const moTaChiTiet = tuDB(sp, 'mo_ta_chi_tiet') || tuDB(sp, 'mo_ta_ngan');
    const vatLieu = tuDB(sp, 'vat_lieu');
    const baoHanh = tuDB(sp, 'bao_hanh');
    const uuDiemRaw = tuDB(sp, 'uu_diem') || "";
    const gia = (sp.gia && sp.gia !== 'Liên hệ') ? sp.gia : t('sanPham.giaLienHe');
    
    document.getElementById('page-title').innerText = ten;
    document.getElementById('bc-name').innerText = ten;
    
    // Xử lý list ưu điểm (ngăn cách bằng dấu ;)
    const listUuDiem = uuDiemRaw.split(';').map(i => i.trim()).filter(i => i);
    const uuDiemHtml = listUuDiem.length ? `
        <div style="margin-top: 20px;">
            <strong style="color: var(--mau-chinh); font-size: 16px;">${t('sanPham.uuDiem') || "Ưu điểm nổi bật"}:</strong>
            <ul class="product-specs">
                ${listUuDiem.map(u => `
                    <li>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--mau-thanh-cong)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        <span>${u}</span>
                    </li>
                `).join('')}
            </ul>
        </div>
    ` : '';
    
    const hinhAnh = sp.hinh_anh || 'assets/images/cua-sat.jpg';
    
    let btn3D = '';
    if (sp.nhom === 'nha-panel') {
        btn3D = `<a href="thiet-ke-nha.html" class="btn btn-phu" style="display:inline-flex; align-items:center; gap:8px; padding: 12px 24px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
            ${t('sanPham.tuThietKe3D') || "Tự thiết kế 3D"}
        </a>`;
    }

    container.innerHTML = `
        <div class="grid-2" style="gap: 50px; align-items: start;">
            <div>
                <img src="${hinhAnh}" alt="${ten}" class="product-image" onclick="zoomImage(this.src)">
            </div>
            <div>
                <span style="font-size:13px; color:var(--mau-phu); font-weight:600; text-transform:uppercase; padding: 4px 12px; background: var(--mau-nen-nhat); border-radius: 20px;">${nhom}</span>
                <h2 style="color:var(--mau-chinh); margin: 15px 0 20px; font-size: 32px; line-height: 1.3;">${ten}</h2>
                <div class="product-price">${gia === 'Liên hệ' || gia === 'Contact for quote' || gia === '欢迎咨询报价' ? gia : gia}</div>
                
                <p style="color: var(--mau-chu); line-height: 1.8; margin-bottom: 25px; font-size: 16px;">${moTaChiTiet}</p>
                
                ${vatLieu ? `<div style="margin-bottom: 12px; font-size: 16px;"><strong>${t('sanPham.vatLieu') || "Vật liệu chính"}:</strong> ${vatLieu}</div>` : ''}
                ${baoHanh ? `<div style="margin-bottom: 12px; font-size: 16px;"><strong>${t('sanPham.baoHanh') || "Bảo hành"}:</strong> ${baoHanh}</div>` : ''}
                
                ${uuDiemHtml}
                
                <div style="margin-top: 30px; display: flex; align-items: center; border-top: 1px solid var(--mau-vien); padding-top: 30px;">
                    <div style="margin-right: 15px; font-weight: 600; color: var(--mau-chu);">${t('sanPham.soLuong') || "Số lượng"}:</div>
                    <div class="qty-selector">
                        <button class="qty-btn" onclick="changeQty(-1)">-</button>
                        <input type="text" class="qty-input" id="detail-qty" value="${currentQuantity}" readonly>
                        <button class="qty-btn" onclick="changeQty(1)">+</button>
                    </div>
                </div>
                
                <div class="action-buttons" style="display: flex; gap: 15px; flex-wrap: wrap; margin-top: 25px;">
                    <button class="btn btn-chinh" onclick="addToCart()" style="display:inline-flex; align-items:center; gap:8px; padding: 12px 24px;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                        ${t('sanPham.themVaoGio') || "Thêm vào giỏ báo giá"}
                    </button>
                    <a href="dat-lich.html?dich_vu=${sp.nhom}" class="btn btn-phu" style="display:inline-flex; align-items:center; gap:8px; padding: 12px 24px;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        ${t('sanPham.datLichKhaoSat') || "Đặt lịch khảo sát"}
                    </a>
                    ${btn3D}
                </div>
            </div>
        </div>
    `;
    
    if (typeof apDungNgonNgu === 'function') apDungNgonNgu();
}

// Khai báo hàm ra window để inline onclick hoạt động
window.zoomImage = function(src) {
    const modal = document.getElementById('image-modal');
    document.getElementById('modal-img').src = src;
    modal.style.display = 'flex';
};

window.changeQty = function(delta) {
    currentQuantity += delta;
    if (currentQuantity < 1) currentQuantity = 1;
    document.getElementById('detail-qty').value = currentQuantity;
};

window.addToCart = function() {
    if (!currentProduct) return;
    
    TieuNghia.themVaoGio({
        id: currentProduct.id,
        ten_vi: currentProduct.ten,
        ten_en: currentProduct.ten_en,
        ten_zh: currentProduct.ten_zh,
        hinh_anh: currentProduct.hinh_anh,
        kich_thuoc: "",
        so_luong: currentQuantity
    });
};

async function loadRelated(nhom, currentId) {
    const section = document.getElementById('related-products-section');
    const grid = document.getElementById('related-grid');
    if (!section || !grid) return;
    
    try {
        const { data, error } = await db.from('san_pham')
            .select('*')
            .eq('nhom', nhom)
            .neq('id', currentId)
            .limit(3);
            
        if (error || !data || data.length === 0) return;
        
        section.style.display = 'block';
        
        // Render 3 thẻ giống phong cách trang chủ/sản phẩm
        grid.innerHTML = data.map(sp => {
            const ten = tuDB(sp, 'ten');
            const moTa = tuDB(sp, 'mo_ta_ngan');
            const nhomTen = TieuNghia.tenNhom(sp.nhom);
            return `
                <a href="chi-tiet.html?id=${sp.id}" class="the service-card" style="text-decoration: none; display: flex; flex-direction: column; height: 100%;">
                    <img src="${sp.hinh_anh || 'assets/images/cua-sat.jpg'}" alt="${ten}" loading="lazy" style="width:100%; aspect-ratio:4/3; object-fit:cover;">
                    <div class="service-info" style="display: flex; flex-direction: column; flex-grow: 1;">
                        <span style="font-size:12px; color:var(--mau-phu); font-weight:600; text-transform:uppercase;">${nhomTen}</span>
                        <h3 style="color:var(--mau-chinh); margin: 8px 0; font-size: 18px;">${ten}</h3>
                        <p style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 15px;">${moTa}</p>
                        <span class="service-link" style="margin-top: auto; display: inline-block;">${t('trangChu.xemSanPham') || "Xem chi tiết"}</span>
                    </div>
                </a>
            `;
        }).join('');
        
        if (typeof apDungNgonNgu === 'function') apDungNgonNgu();
    } catch (e) {
        console.error("Lỗi tải sản phẩm liên quan:", e);
    }
}
