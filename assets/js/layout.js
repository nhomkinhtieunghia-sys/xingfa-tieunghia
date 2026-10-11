document.addEventListener("DOMContentLoaded", () => {
    taoTopBar();
    taoHeader();
    taoFooter();
    taoNutNoi();
    toSangTrangHienTai();
    setupLanguageDropdowns();
    setupMobileMenu();
    
    // Đảm bảo dịch tất cả phần tử được chèn qua layout.js
    if (typeof apDungNgonNgu === 'function') {
        apDungNgonNgu();
    }
});

const svgs = {
    phone: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>`,
    clock: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`,
    location: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`,
    mail: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`,
    globe: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`,
    cart: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>`,
    fb: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>`,
    zalo: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>`,
    zalo_solid: `<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>`,
    phone_solid: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>`,
    flag_vi: `<svg width="20" height="14" viewBox="0 0 20 14" xmlns="http://www.w3.org/2000/svg" class="flag-icon"><rect width="20" height="14" fill="#da251d"/><polygon points="10,2 12,8 18,8 13,11 15,17 10,13 5,17 7,11 2,8 8,8" transform="scale(0.6) translate(6.5, 0)" fill="#ffcd00"/></svg>`,
    flag_en: `<svg width="20" height="14" viewBox="0 0 60 42" xmlns="http://www.w3.org/2000/svg" class="flag-icon"><rect width="60" height="42" fill="#012169"/><path d="M0,0 L60,42 M60,0 L0,42" stroke="#fff" stroke-width="6"/><path d="M0,0 L60,42 M60,0 L0,42" stroke="#C8102E" stroke-width="4"/><path d="M30,0 L30,42 M0,21 L60,21" stroke="#fff" stroke-width="14"/><path d="M30,0 L30,42 M0,21 L60,21" stroke="#C8102E" stroke-width="8"/></svg>`,
    flag_zh: `<svg width="20" height="14" viewBox="0 0 20 14" xmlns="http://www.w3.org/2000/svg" class="flag-icon"><rect width="20" height="14" fill="#ee1c25"/><polygon points="5,2 6,4.5 8.5,4.5 6.5,6 7.5,8.5 5,7 2.5,8.5 3.5,6 1.5,4.5 4,4.5" fill="#ffff00"/><circle cx="9" cy="2" r="0.8" fill="#ffff00"/><circle cx="10" cy="4" r="0.8" fill="#ffff00"/><circle cx="10" cy="6" r="0.8" fill="#ffff00"/><circle cx="9" cy="8" r="0.8" fill="#ffff00"/></svg>`
};

function taoTopBar() {
    const topBar = document.createElement('div');
    topBar.className = 'top-bar';
    
    topBar.innerHTML = `
        <div class="top-bar-left">
            <span>${svgs.phone} 097-622-4875</span>
            <span class="an-mobile"> | ${svgs.clock} <span data-i18n="chung.gioLamViec">8:00 - 17:00 (T2 - CN)</span></span>
        </div>
        <div class="top-bar-right">
            <span class="an-mobile"><span data-i18n="chung.ngonNgu">Ngôn ngữ:</span></span>
            <div class="lang-dropdown-container">
                <button class="lang-btn" aria-haspopup="listbox" aria-expanded="false" id="lang-btn-top">
                    <span class="lang-icon">${svgs.flag_vi}</span>
                    <span class="lang-text">Tiếng Việt</span> <span class="lang-arrow">▾</span>
                </button>
                <ul class="lang-list" role="listbox" id="lang-list-top">
                    <li role="option" data-lang="vi" class="lang-option" tabindex="0">${svgs.flag_vi} <span class="lang-text-full">Tiếng Việt</span> <span class="check">✓</span></li>
                    <li role="option" data-lang="en" class="lang-option" tabindex="0">${svgs.flag_en} <span class="lang-text-full">English</span> <span class="check"></span></li>
                    <li role="option" data-lang="zh" class="lang-option" tabindex="0">${svgs.flag_zh} <span class="lang-text-full">中文</span> <span class="check"></span></li>
                </ul>
            </div>
        </div>
    `;
    document.body.insertBefore(topBar, document.body.firstChild);
}

function taoHeader() {
    const header = document.createElement('header');
    header.innerHTML = `
        <div class="container header-container">
            <div class="logo">
                <a href="index.html" class="logo-link">
                    <img src="assets/images/logo.jpg" alt="Logo Xingfa Tiếu Nghĩa" class="logo-img">
                    <div class="logo-text">
                        <div class="logo-title">Xingfa Tiếu Nghĩa</div>
                        <div class="logo-sub" data-i18n="chung.khauHieu">Cơ Khí – Cửa Nhôm – Nhà Panel</div>
                    </div>
                </a>
            </div>
            <nav class="menu an-mobile">
                <ul class="menu-list">
                    <li><a href="index.html" data-i18n="menu.trangChu" class="menu-item">Trang chủ</a></li>
                    <li><a href="gioi-thieu.html" data-i18n="menu.gioiThieu" class="menu-item">Giới thiệu</a></li>
                    <li><a href="san-pham.html" data-i18n="menu.sanPham" class="menu-item">Sản phẩm</a></li>
                    <li><a href="thiet-ke-nha.html" class="menu-item"><span data-i18n="menu.thietKe3D">Thiết kế 3D</span><sup class="badge-new" data-i18n="menu.moi">Mới</sup></a></li>
                    <li><a href="cong-trinh.html" data-i18n="menu.congTrinh" class="menu-item">Công trình</a></li>
                    <li><a href="tin-tuc.html" data-i18n="menu.tinTuc" class="menu-item">Tin tức</a></li>
                    <li><a href="dat-lich.html" data-i18n="menu.datLich" class="menu-item">Đặt lịch & Tiến độ</a></li>
                    <li><a href="bao-gia.html" class="menu-item cart-item">
                        ${svgs.cart}
                        <span id="sl-gio" class="gio-count">0</span>
                    </a></li>
                </ul>
            </nav>
            <div class="header-right">
                <a href="tel:0976224875" class="btn-chinh btn-pill an-mobile">
                    ${svgs.phone} <span data-i18n="chung.nutGoi">Gọi 097-622-4875</span>
                </a>
                <button class="menu-mobile-btn hien-mobile" aria-label="Menu">☰</button>
            </div>
        </div>
        
        <!-- Mobile Menu -->
        <div class="mobile-menu-overlay" id="mobile-menu-overlay"></div>
        <div class="mobile-menu" id="mobile-menu">
            <div class="mobile-menu-header">
                <div class="logo-title" style="color: var(--mau-chinh);">Menu</div>
                <button class="close-menu-btn" aria-label="Close">&times;</button>
            </div>
            <ul class="mobile-nav">
                <li><a href="index.html" data-i18n="menu.trangChu">Trang chủ</a></li>
                <li><a href="gioi-thieu.html" data-i18n="menu.gioiThieu">Giới thiệu</a></li>
                <li><a href="san-pham.html" data-i18n="menu.sanPham">Sản phẩm</a></li>
                <li><a href="thiet-ke-nha.html"><span data-i18n="menu.thietKe3D">Thiết kế 3D</span> <sup class="badge-new" data-i18n="menu.moi">Mới</sup></a></li>
                <li><a href="cong-trinh.html" data-i18n="menu.congTrinh">Công trình</a></li>
                <li><a href="tin-tuc.html" data-i18n="menu.tinTuc">Tin tức</a></li>
                <li><a href="dat-lich.html" data-i18n="menu.datLich">Đặt lịch & Tiến độ</a></li>
                <li><a href="bao-gia.html">${svgs.cart} <span data-i18n="menu.gioBaoGia">Giỏ báo giá</span> (<span id="sl-gio-mobile">0</span>)</a></li>
            </ul>
            <div class="mobile-menu-lang">
                <span data-i18n="chung.ngonNgu">Ngôn ngữ:</span>
                <div class="lang-dropdown-container">
                    <button class="lang-btn" aria-haspopup="listbox" aria-expanded="false" id="lang-btn-mobile">
                        <span class="lang-icon">${svgs.flag_vi}</span>
                        <span class="lang-text">Tiếng Việt</span> <span class="lang-arrow">▾</span>
                    </button>
                    <ul class="lang-list" role="listbox" id="lang-list-mobile">
                        <li role="option" data-lang="vi" class="lang-option" tabindex="0">${svgs.flag_vi} <span class="lang-text-full">Tiếng Việt</span> <span class="check">✓</span></li>
                        <li role="option" data-lang="en" class="lang-option" tabindex="0">${svgs.flag_en} <span class="lang-text-full">English</span> <span class="check"></span></li>
                        <li role="option" data-lang="zh" class="lang-option" tabindex="0">${svgs.flag_zh} <span class="lang-text-full">中文</span> <span class="check"></span></li>
                    </ul>
                </div>
            </div>
        </div>
    `;
    const app = document.getElementById('app') || document.body;
    app.insertBefore(header, app.firstChild);
    
    // Cập nhật số lượng giỏ
    const gio = TieuNghia.layGioHang ? TieuNghia.layGioHang() : [];
    const count = gio.reduce((t, sp) => t + sp.so_luong, 0);
    const sl = document.getElementById('sl-gio');
    const slm = document.getElementById('sl-gio-mobile');
    if (sl) {
        sl.textContent = count;
        if(count > 0) sl.style.display = 'flex';
        else sl.style.display = 'none';
    }
    if (slm) slm.textContent = count;

    // Hiệu ứng cuộn header
    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    });
}

function taoFooter() {
    const footer = document.createElement('footer');
    footer.innerHTML = `
        <div class="container footer-container">
            <div class="footer-col">
                <img src="assets/images/logo.jpg" alt="Logo" class="footer-logo">
                <p class="footer-desc" data-i18n="footer.moTa">Công ty TNHH Cơ Khí Tiếu Nghĩa - Hơn 10 năm kinh nghiệm gia công, lắp đặt cửa sắt, cửa nhôm Xingfa và nhà lắp ráp panel.</p>
                <div class="social-icons">
                    <a href="https://www.facebook.com/cokhixingfatieunghia/" target="_blank" class="social-btn" title="Facebook">${svgs.fb}</a>
                    <a href="https://zalo.me/0976224875" target="_blank" class="social-btn" title="Zalo">${svgs.zalo}</a>
                </div>
            </div>
            <div class="footer-col">
                <h4 class="footer-title" data-i18n="footer.lienKet">Liên kết</h4>
                <ul class="footer-links">
                    <li><a href="index.html" data-i18n="menu.trangChu">Trang chủ</a></li>
                    <li><a href="gioi-thieu.html" data-i18n="menu.gioiThieu">Giới thiệu</a></li>
                    <li><a href="san-pham.html" data-i18n="menu.sanPham">Sản phẩm</a></li>
                    <li><a href="thiet-ke-nha.html" data-i18n="menu.thietKe3D">Thiết kế 3D</a></li>
                    <li><a href="cong-trinh.html" data-i18n="menu.congTrinh">Công trình</a></li>
                    <li><a href="tin-tuc.html" data-i18n="menu.tinTuc">Tin tức</a></li>
                    <li><a href="dat-lich.html" data-i18n="menu.datLich">Đặt lịch & Tiến độ</a></li>
                    <li><a href="bao-gia.html" data-i18n="menu.gioBaoGia">Giỏ báo giá</a></li>
                    <li class="footer-small-link"><a href="ai.html" data-i18n="footer.danhChoAI">Dành cho AI</a></li>
                    <li class="footer-small-link"><a href="admin.html" data-i18n="footer.quanTri">Quản trị</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h4 class="footer-title" data-i18n="footer.dichVu">Dịch vụ</h4>
                <ul class="footer-links">
                    <li><a href="san-pham.html?nhom=cua-sat" data-i18n="dichVu.cuaSat">Cửa sắt – Cổng – Lan can</a></li>
                    <li><a href="san-pham.html?nhom=cua-nhom" data-i18n="dichVu.cuaNhom">Cửa nhôm Xingfa</a></li>
                    <li><a href="san-pham.html?nhom=nha-panel" data-i18n="dichVu.nhaPanel">Nhà lắp ráp panel</a></li>
                    <li><a href="san-pham.html?nhom=tu-bep" data-i18n="dichVu.tuBep">Tủ bếp & nội thất nhôm</a></li>
                    <li><a href="san-pham.html?nhom=mai-che" data-i18n="dichVu.maiChe">Mái che hiện đại</a></li>
                    <li><a href="san-pham.html?nhom=bao-tri" data-i18n="dichVu.baoTri">Bảo trì & sửa chữa</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h4 class="footer-title" data-i18n="footer.lienHe">Liên hệ</h4>
                <ul class="footer-contact">
                    <li>${svgs.location} <span data-i18n="footer.diaChi">12 Ấp An Thuận, xã An Ninh, tỉnh Tây Ninh</span></li>
                    <li>${svgs.phone} 097-622-4875</li>
                    <li>${svgs.mail} nhomkinhtieunghia@gmail.com</li>
                    <li>${svgs.clock} <span data-i18n="chung.gioLamViec">8:00 - 17:00 (T2 - CN)</span></li>
                    <li>${svgs.globe} <a href="https://www.facebook.com/cokhixingfatieunghia/" target="_blank">Facebook</a></li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom">
            © 2026 <span data-i18n="footer.banQuyen">Công Ty TNHH Cơ Khí Tiếu Nghĩa</span>
        </div>
    `;
    const app = document.getElementById('app') || document.body;
    app.appendChild(footer);
}

function taoNutNoi() {
    const nutNoi = document.createElement('div');
    nutNoi.className = 'nut-noi';
    nutNoi.innerHTML = `
        <a href="tel:0976224875" class="btn-goi" title="Gọi điện">${svgs.phone_solid}</a>
        <a href="https://zalo.me/0976224875" target="_blank" class="btn-zalo" title="Zalo">${svgs.zalo_solid}</a>
        <button class="btn-len-dau" onclick="window.scrollTo({top: 0, behavior: 'smooth'})" title="Lên đầu trang">↑</button>
    `;
    document.body.appendChild(nutNoi);
    
    const btnLenDau = nutNoi.querySelector('.btn-len-dau');
    window.addEventListener('scroll', () => {
        btnLenDau.style.display = window.scrollY > 300 ? 'flex' : 'none';
    });
}

function toSangTrangHienTai() {
    const duongDan = window.location.pathname.split('/').pop() || 'index.html';
    const menuLinks = document.querySelectorAll('.menu-list a, .mobile-nav a');
    menuLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.split('?')[0] === duongDan) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

function setupMobileMenu() {
    const btn = document.querySelector('.menu-mobile-btn');
    const closeBtn = document.querySelector('.close-menu-btn');
    const overlay = document.getElementById('mobile-menu-overlay');
    const menu = document.getElementById('mobile-menu');

    if(!btn || !menu) return;

    function openMenu() {
        overlay.classList.add('active');
        menu.classList.add('active');
    }

    function closeMenu() {
        overlay.classList.remove('active');
        menu.classList.remove('active');
    }

    btn.addEventListener('click', openMenu);
    closeBtn.addEventListener('click', closeMenu);
    overlay.addEventListener('click', closeMenu);
}

function setupLanguageDropdowns() {
    const containers = document.querySelectorAll('.lang-dropdown-container');
    
    containers.forEach(container => {
        const btn = container.querySelector('.lang-btn');
        const list = container.querySelector('.lang-list');
        const options = list.querySelectorAll('.lang-option');

        function toggleDropdown() {
            const isExpanded = btn.getAttribute('aria-expanded') === 'true';
            btn.setAttribute('aria-expanded', !isExpanded);
            list.classList.toggle('active', !isExpanded);
        }

        function closeDropdown() {
            btn.setAttribute('aria-expanded', 'false');
            list.classList.remove('active');
        }

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleDropdown();
        });

        options.forEach(opt => {
            opt.addEventListener('click', () => {
                const lang = opt.getAttribute('data-lang');
                if(typeof doiNgonNgu === 'function') doiNgonNgu(lang);
                closeDropdown();
            });
            opt.addEventListener('keydown', (e) => {
                if(e.key === 'Enter') {
                    const lang = opt.getAttribute('data-lang');
                    if(typeof doiNgonNgu === 'function') doiNgonNgu(lang);
                    closeDropdown();
                }
            });
        });

        container.addEventListener('keydown', (e) => {
            if(e.key === 'Escape') closeDropdown();
            if(e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
                const isExpanded = btn.getAttribute('aria-expanded') === 'true';
                if(!isExpanded) {
                    toggleDropdown();
                    options[0].focus();
                    return;
                }
                const currentFocus = document.activeElement;
                const index = Array.from(options).indexOf(currentFocus);
                if(e.key === 'ArrowDown') {
                    const next = options[index + 1] || options[0];
                    next.focus();
                } else {
                    const prev = options[index - 1] || options[options.length - 1];
                    prev.focus();
                }
            }
        });
    });

    document.addEventListener('click', () => {
        containers.forEach(container => {
            const btn = container.querySelector('.lang-btn');
            const list = container.querySelector('.lang-list');
            btn.setAttribute('aria-expanded', 'false');
            list.classList.remove('active');
        });
    });

    document.addEventListener('doi-ngon-ngu', (e) => {
        const lang = e.detail;
        const labels = {
            'vi': 'Tiếng Việt',
            'en': 'English',
            'zh': '中文'
        };
        const mobileLabels = {
            'vi': 'VI',
            'en': 'EN',
            'zh': 'ZH'
        };
        
        containers.forEach(container => {
            const btnText = container.querySelector('.lang-text');
            const btnIcon = container.querySelector('.lang-icon');
            const options = container.querySelectorAll('.lang-option');
            const isMobile = container.closest('.mobile-menu') !== null;
            
            btnIcon.innerHTML = svgs[`flag_${lang}`];

            if (window.innerWidth <= 1200 && !isMobile) {
                btnText.textContent = mobileLabels[lang];
            } else if (window.innerWidth <= 1200 && isMobile) {
                btnText.textContent = labels[lang];
            } else {
                btnText.textContent = labels[lang];
            }

            options.forEach(opt => {
                const check = opt.querySelector('.check');
                if (opt.getAttribute('data-lang') === lang) {
                    check.textContent = '✓';
                } else {
                    check.textContent = '';
                }
            });
        });
    });
    
    if (typeof ngonNguHienTai !== 'undefined') {
        document.dispatchEvent(new CustomEvent('doi-ngon-ngu', { detail: ngonNguHienTai }));
    }
}

// Chỉ cập nhật nhãn nút ngôn ngữ khi màn hình đổi qua lại mốc 1200px
// (không phát sự kiện mỗi lần cuộn trên điện thoại làm trang vẽ lại)
let laManHinhNho = window.innerWidth <= 1200;
window.addEventListener('resize', () => {
    const nho = window.innerWidth <= 1200;
    if (nho === laManHinhNho) return;
    laManHinhNho = nho;
    if (typeof ngonNguHienTai !== 'undefined') {
        document.dispatchEvent(new CustomEvent('doi-ngon-ngu', { detail: ngonNguHienTai }));
    }
});

// Nạp trợ lý tư vấn (góc trái dưới) cho mọi trang khách – trừ trang quản trị
(function napTroLy() {
    if (/admin\.html$/.test(location.pathname)) return;
    const nap = () => {
        const s1 = document.createElement('script');
        s1.src = 'assets/js/tro-ly-du-lieu.js';
        s1.onload = () => {
            const s2 = document.createElement('script');
            s2.src = 'assets/js/tro-ly.js';
            document.body.appendChild(s2);
        };
        document.body.appendChild(s1);
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', nap);
    else nap();
})();
