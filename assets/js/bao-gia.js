document.addEventListener('DOMContentLoaded', () => {
    renderCart();
});

document.addEventListener('doi-ngon-ngu', () => {
    renderCart();
    translatePlaceholders();
});

function translatePlaceholders() {
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (typeof t === 'function' && t(key)) {
            el.placeholder = t(key);
        }
    });
}

function renderCart() {
    const gio = TieuNghia.layGioHang();
    const content = document.getElementById('cart-content');
    const formContainer = document.getElementById('cart-form-container');
    
    if (!gio || gio.length === 0) {
        // Giỏ trống
        content.innerHTML = `
            <div class="text-center" style="padding: 60px 20px;">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="var(--mau-vien)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 20px;"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                <h3 style="color: var(--mau-chu); margin-bottom: 25px; font-weight: 500;">${t('baoGia.gioTrong')}</h3>
                <a href="san-pham.html" class="btn btn-chinh">${t('baoGia.xemSanPham')}</a>
            </div>
        `;
        content.style.gridColumn = "1 / -1";
        formContainer.style.display = "none";
        
        if (typeof apDungNgonNgu === 'function') apDungNgonNgu();
        return;
    }
    
    content.style.gridColumn = "auto";
    formContainer.style.display = "block";
    
    const lang = typeof layNgonNgu === 'function' ? layNgonNgu() : 'vi';
    
    let html = `
        <table class="cart-table">
            <thead>
                <tr>
                    <th>${t('baoGia.sp')}</th>
                    <th style="width: 100px; text-align: center;">${t('baoGia.soLuong')}</th>
                    <th>${t('baoGia.kichThuoc')}</th>
                    <th style="width: 80px; text-align: center;">${t('baoGia.xoa')}</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    function escapeHtml(text) {
        return (text || '').toString()
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    gio.forEach((sp, idx) => {
        let ten = sp.ten_vi;
        if (lang === 'en' && sp.ten_en) ten = sp.ten_en;
        if (lang === 'zh' && sp.ten_zh) ten = sp.ten_zh;
        
        const kichThuocVal = escapeHtml(sp.kich_thuoc || '');
        
        html += `
            <tr>
                <td data-label="${t('baoGia.sp')}">
                    <a href="chi-tiet.html?id=${sp.id}" style="color: var(--mau-chinh); text-decoration: none; font-weight: 600; display: flex; align-items: center;">
                        <img src="${sp.hinh_anh}" alt="${ten}" class="cart-item-img">
                        ${ten}
                    </a>
                </td>
                <td data-label="${t('baoGia.soLuong')}" style="text-align: center;">
                    <div style="display: flex; align-items: center; justify-content: center; gap: 5px;">
                        <button onclick="updateQty(${idx}, -1)" style="cursor:pointer; border:1px solid #ccc; background:#fff; padding:3px 8px; border-radius:4px;">-</button>
                        <input type="number" class="cart-qty-input" value="${sp.so_luong}" min="1" onchange="inputQty(${idx}, this.value)">
                        <button onclick="updateQty(${idx}, 1)" style="cursor:pointer; border:1px solid #ccc; background:#fff; padding:3px 8px; border-radius:4px;">+</button>
                    </div>
                </td>
                <td data-label="${t('baoGia.kichThuoc')}">
                    <input type="text" class="cart-note-input" value="${kichThuocVal}" placeholder="VD: 1m2 x 2m4" onchange="updateNote(${idx}, this.value)">
                </td>
                <td data-label="${t('baoGia.xoa')}" style="text-align: center;">
                    <button class="btn-delete" onclick="askRemoveItem(${idx})">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    </button>
                </td>
            </tr>
        `;
    });
    
    html += `
            </tbody>
        </table>
        <div style="text-align: right; margin-top: 15px;">
            <button onclick="askClearCart()" class="btn btn-phu">${t('baoGia.xoaHet')}</button>
        </div>
    `;
    
    content.innerHTML = html;
    translatePlaceholders();
    if (typeof apDungNgonNgu === 'function') apDungNgonNgu();
}

window.updateQty = function(idx, delta) {
    const gio = TieuNghia.layGioHang();
    if(gio[idx]) {
        gio[idx].so_luong += delta;
        if(gio[idx].so_luong < 1) gio[idx].so_luong = 1;
        TieuNghia.luuGioHang(gio);
        renderCart();
    }
};

window.inputQty = function(idx, val) {
    const gio = TieuNghia.layGioHang();
    if(gio[idx]) {
        let n = parseInt(val);
        if(isNaN(n) || n < 1) n = 1;
        gio[idx].so_luong = n;
        TieuNghia.luuGioHang(gio);
        renderCart();
    }
};

window.updateNote = function(idx, val) {
    const gio = TieuNghia.layGioHang();
    if(gio[idx]) {
        gio[idx].kich_thuoc = val;
        TieuNghia.luuGioHang(gio);
    }
};

let deleteTarget = null; // null: clear all, number: index

window.askRemoveItem = function(idx) {
    deleteTarget = idx;
    document.getElementById('confirm-msg').textContent = t('baoGia.xacNhanXoaMot') || 'Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ?';
    document.getElementById('confirm-modal').classList.add('active');
};

window.askClearCart = function() {
    deleteTarget = null;
    document.getElementById('confirm-msg').textContent = t('baoGia.xacNhanXoaHet') || 'Bạn có chắc chắn muốn xóa TOÀN BỘ sản phẩm?';
    document.getElementById('confirm-modal').classList.add('active');
};

window.closeConfirmModal = function() {
    document.getElementById('confirm-modal').classList.remove('active');
};

window.executeDelete = function() {
    if (deleteTarget !== null) {
        const gio = TieuNghia.layGioHang();
        gio.splice(deleteTarget, 1);
        TieuNghia.luuGioHang(gio);
    } else {
        TieuNghia.luuGioHang([]);
    }
    closeConfirmModal();
    renderCart();
};

window.submitQuote = async function(e) {
    e.preventDefault();
    
    const ho_ten = document.getElementById('q-name').value.trim();
    const so_dien_thoai = document.getElementById('q-phone').value.trim();
    const email = document.getElementById('q-email').value.trim();
    const dia_chi = document.getElementById('q-address').value.trim();
    const ghi_chu = document.getElementById('q-note').value.trim();
    const msgEl = document.getElementById('quote-msg');
    const btn = document.getElementById('btn-submit-quote');
    
    if (!ho_ten || !so_dien_thoai || !TieuNghia.kiemTraSDT(so_dien_thoai)) {
        msgEl.style.display = 'block';
        msgEl.style.color = 'var(--mau-nhan)';
        msgEl.innerText = t('baoGia.loiNhap');
        return;
    }
    
    const danh_sach = TieuNghia.layGioHang();
    if (danh_sach.length === 0) return;
    
    const ngon_ngu = typeof layNgonNgu === 'function' ? layNgonNgu() : 'vi';
    
    try {
        btn.disabled = true;
        btn.innerText = t('baoGia.dangGui');
        
        // Khách chỉ được INSERT vào yeu_cau_bao_gia, không select
        const { error } = await db.from('yeu_cau_bao_gia').insert({
            ho_ten, 
            so_dien_thoai, 
            email, 
            dia_chi, 
            ghi_chu, 
            danh_sach,
            ngon_ngu
        });
        
        if (error) throw error;
        
        // Thành công: xóa giỏ, hiện thông báo cảm ơn
        TieuNghia.luuGioHang([]);
        
        const tenKhach = document.getElementById('q-name').value;
        const camOnTpl = t('baoGia.camOnTen') || "Cảm ơn {ten}, Xingfa Tiếu Nghĩa sẽ gọi lại trong thời gian sớm nhất! Hotline hỗ trợ: 0976 224 875";
        const camOnText = camOnTpl.replace('{ten}', tenKhach);
        
        document.getElementById('cart-content').innerHTML = `
            <div class="text-center" style="padding: 60px 20px; background: #fff; border-radius: var(--bo-goc); border: 1px solid var(--mau-vien);">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="var(--mau-thanh-cong)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 20px;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                <h3 id="success-title" style="color: var(--mau-chinh); margin-bottom: 15px; font-size: 24px;"></h3>
                <p id="success-desc" style="color: var(--mau-chu); margin-bottom: 25px; line-height: 1.6;"></p>
                <a href="san-pham.html" class="btn btn-chinh">${t('baoGia.xemSanPham')}</a>
            </div>
        `;
        document.getElementById('success-title').textContent = t('baoGia.guiYeuCau') ? "Thành công" : "Thành công";
        document.getElementById('success-desc').textContent = camOnText;
        
        document.getElementById('cart-content').style.gridColumn = "1 / -1";
        document.getElementById('cart-form-container').style.display = "none";
        
    } catch (err) {
        console.error(err);
        msgEl.style.display = 'block';
        msgEl.style.color = 'var(--mau-nhan)';
        msgEl.innerText = t('baoGia.loiGui');
    } finally {
        btn.disabled = false;
        btn.innerText = t('baoGia.guiYeuCau');
    }
};
