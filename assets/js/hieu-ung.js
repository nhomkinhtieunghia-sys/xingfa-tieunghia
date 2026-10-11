// Khởi tạo các hiệu ứng
document.addEventListener('DOMContentLoaded', () => {
    // 1. Màn hình chờ (chỉ hiện lần đầu trong phiên)
    const splash = document.getElementById('splash-screen');
    if (splash) {
        if (!sessionStorage.getItem('daXemSplash')) {
            sessionStorage.setItem('daXemSplash', 'true');
            setTimeout(() => {
                splash.classList.add('hide');
                setTimeout(() => splash.remove(), 500);
            }, 1000);
        } else {
            splash.style.display = 'none';
        }
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 2. Typing text & Banner Banner Ken Burns
    const bannerBg = document.querySelector('.banner-bg');
    if (bannerBg && !prefersReducedMotion) {
        bannerBg.classList.add('animate-ken-burns');
    }

    if (!prefersReducedMotion) {
        const typingEl = document.getElementById('typing-text');
        if (typingEl) {
            // Danh sách chữ gõ lấy theo ngôn ngữ đang chọn (khóa trangChu.goChu, ngăn cách bằng |)
            const layChu = () => (typeof t === 'function' ? t('trangChu.goChu') : 'Cửa nhôm Xingfa|Nhà lắp ráp panel').split('|');
            let texts = layChu();
            let textIdx = 0;
            let charIdx = 0;
            let isDeleting = false;
            
            function type() {
                const currentText = texts[textIdx];
                if (isDeleting) {
                    typingEl.textContent = currentText.substring(0, charIdx - 1);
                    charIdx--;
                } else {
                    typingEl.textContent = currentText.substring(0, charIdx + 1);
                    charIdx++;
                }

                let speed = isDeleting ? 30 : 80;
                if (!isDeleting && charIdx === currentText.length) {
                    speed = 2000;
                    isDeleting = true;
                } else if (isDeleting && charIdx === 0) {
                    isDeleting = false;
                    texts = layChu();
                    textIdx = (textIdx + 1) % texts.length;
                    speed = 400;
                }
                setTimeout(type, speed);
            }
            setTimeout(type, 1000);
        }
    } else {
        const typingEl = document.getElementById('typing-text');
        if (typingEl) typingEl.textContent = (typeof t === 'function' ? t('trangChu.goChu') : 'Cửa nhôm Xingfa|Nhà lắp ráp panel').split('|').slice(0, 2).join(' | ');
        const cursor = document.querySelector('.cursor');
        if (cursor) cursor.style.display = 'none';
    }

    // 3. Hiện dần khi cuộn (data-hieu-ung)
    const animateEls = document.querySelectorAll('[data-hieu-ung]');
    if (!prefersReducedMotion) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('da-hien');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

        animateEls.forEach((el, index) => {
            // Stagger if in grid
            const isGridItem = el.classList.contains('the') || el.classList.contains('step') || el.classList.contains('stat-item') || el.classList.contains('faq-item');
            if (isGridItem) {
                el.style.transitionDelay = `${(index % 8) * 80}ms`;
            }
            observer.observe(el);
        });
    } else {
        animateEls.forEach(el => {
            el.classList.add('da-hien');
            el.style.transition = 'none';
        });
    }

    // Dự phòng: sau 2s nếu phần tử nào chưa hiện thì tự ép hiện
    setTimeout(() => {
        animateEls.forEach(el => {
            if (!el.classList.contains('da-hien')) {
                el.classList.add('da-hien');
            }
        });
    }, 2000);

    // 4. Số đếm tăng
    const statEls = document.querySelectorAll('[data-dem]');
    if (!prefersReducedMotion) {
        const countObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.getAttribute('data-dem'));
                    const suffix = el.getAttribute('data-hau-to') || '';
                    let current = 0;
                    const duration = 1500;
                    const increment = target / (duration / 16);
                    
                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            el.textContent = Math.ceil(current) + suffix;
                            requestAnimationFrame(updateCounter);
                        } else {
                            el.textContent = target + suffix;
                        }
                    };
                    updateCounter();
                    countObserver.unobserve(el);
                }
            });
        }, { threshold: 0.5 });
        statEls.forEach(el => countObserver.observe(el));
    } else {
        statEls.forEach(el => {
            el.textContent = el.getAttribute('data-dem') + (el.getAttribute('data-hau-to') || '');
        });
    }

    // 5. Đường nối quy trình chạy dần
    const processLine = document.querySelector('.process-line-fill');
    if (processLine && !prefersReducedMotion) {
        window.addEventListener('scroll', () => {
            const section = document.querySelector('.process-section');
            if (section) {
                const rect = section.getBoundingClientRect();
                const viewHeight = window.innerHeight;
                if (rect.top < viewHeight && rect.bottom > 0) {
                    // Calculate percentage of section scrolled
                    let percent = (viewHeight - rect.top) / rect.height * 110; 
                    if (percent > 100) percent = 100;
                    if (percent < 0) percent = 0;
                    processLine.style.width = `${percent}%`;
                }
            }
        });
    } else if (processLine) {
        processLine.style.width = '100%';
    }
});
