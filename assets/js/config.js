// Cấu hình chung và các hàm tiện ích
const SUPABASE_URL = "https://mzopvxoyakqybboaugul.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_qI6kSOCZJPK4UI2lZ4e06g_PCgoc6TI";
const DIA_CHI_WEB = "https://nhomkinhtieunghia-sys.github.io/xingfa-tieunghia/"; // đổi thành https://xingfatieunghia.com/thiet-ke-nha/ khi chạy thật

// Trợ lý AI: khóa OpenRouter cất trong Supabase → Edge Functions → Secrets (hàm "tro-ly-ai"), KHÔNG để ở đây

let db = null;
if (typeof supabase !== 'undefined' && SUPABASE_URL && SUPABASE_ANON_KEY) {
    db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// Các hàm tiện ích dùng chung
const TieuNghia = {
    // Lấy tên nhóm hiển thị đa ngôn ngữ
    tenNhom(ma) {
        if (!ma) return '';
        const camelMa = ma.replace(/-([a-z])/g, g => g[1].toUpperCase());
        return typeof t === 'function' ? t('dichVu.' + camelMa) : ma;
    },
    
    // Tên bước tiến độ
    tenBuocTienDo(ma) {
        const buoc = {
            'cho_xac_nhan': 'Chờ xác nhận',
            'da_xac_nhan': 'Đã xác nhận lịch',
            'da_khao_sat': 'Đã khảo sát đo đạc',
            'da_bao_gia': 'Đã báo giá',
            'dang_gia_cong': 'Đang gia công tại xưởng',
            'dang_lap_dat': 'Đang lắp đặt',
            'hoan_thanh': 'Hoàn thành – bàn giao',
            'da_huy': 'Đã hủy'
        };
        return buoc[ma] || ma;
    },

    // Kiểm tra SĐT Việt Nam (10 số, bắt đầu bằng 0)
    kiemTraSDT(sdt) {
        const re = /(0[3|5|7|8|9])+([0-9]{8})\b/g;
        return re.test(sdt);
    },

    // Quản lý giỏ hàng localStorage
    layGioHang() {
        return JSON.parse(localStorage.getItem('gioBaoGia') || '[]');
    },
    luuGioHang(gio) {
        localStorage.setItem('gioBaoGia', JSON.stringify(gio));
        // Cập nhật số lượng trên header
        const sl = document.getElementById('sl-gio');
        if (sl) sl.textContent = gio.reduce((t, sp) => t + sp.so_luong, 0);
    },
    themVaoGio(sp) {
        const gio = this.layGioHang();
        const tim = gio.find(x => x.id === sp.id && x.kich_thuoc === sp.kich_thuoc);
        if (tim) tim.so_luong += sp.so_luong;
        else gio.push(sp);
        this.luuGioHang(gio);
        
        const msg = typeof t === 'function' ? t('sanPham.daThemVaoGio') || 'Đã thêm vào giỏ báo giá' : 'Đã thêm vào giỏ báo giá';
        const linkText = typeof t === 'function' ? t('menu.gioBaoGia') || 'Xem giỏ' : 'Xem giỏ';
        this.toast(msg, 'thanh-cong', `<span>${msg}</span> <a href="bao-gia.html" style="color: #fff; text-decoration: underline; margin-left: 10px; font-weight: 600;">${linkText}</a>`);
    },

    // Mã hóa ký tự đặc biệt trước khi chèn chữ vào HTML (chống chèn mã)
    maHoa(chu) {
        return String(chu ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    },

    // Ảnh chỉ nhận đường dẫn nội bộ assets/... hoặc https://
    anhAnToan(url, macDinh = 'assets/images/banner.jpg') {
        return /^(assets\/|https:\/\/)/.test(url || '') ? url : macDinh;
    },

    // Thẻ bài viết dùng chung (trang chủ, trang Tin tức, bài liên quan)
    theBaiViet(bv) {
        const m = this.maHoa;
        const ten = typeof tuDB === 'function' ? tuDB(bv, 'tieu_de') : bv.tieu_de;
        const tomTat = typeof tuDB === 'function' ? tuDB(bv, 'tom_tat') : bv.tom_tat;
        return `<a class="bv-the" href="bai-viet.html?bai=${encodeURIComponent(bv.slug)}">
            <div class="bv-the-anh"><img src="${m(this.anhAnToan(bv.anh_dai_dien))}" alt="${m(ten)}" loading="lazy"></div>
            <div class="bv-the-chu">
                <div class="bv-the-meta"><span class="bv-chuyen-muc">${m(t('tinTuc.cm_' + bv.chuyen_muc.replace(/-/g, '_')))}</span><span>${m(dinhDangNgay(bv.ngay_dang))}</span></div>
                <h3>${m(ten)}</h3>
                <p>${m(tomTat || '')}</p>
                <span class="bv-xem">${m(t('tinTuc.xemChiTiet'))} →</span>
            </div>
        </a>`;
    },

    // Hiện toast thông báo
    toast(msg, type = 'info', htmlContent = null) {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        const t = document.createElement('div');
        t.className = `toast toast-${type}`;
        if (htmlContent) {
            t.innerHTML = htmlContent;
        } else {
            t.textContent = msg;
        }
        container.appendChild(t);
        setTimeout(() => t.remove(), 3000);
    }
};
