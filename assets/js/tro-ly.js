// Trợ lý tư vấn tự động (không dùng AI trả phí): nút chat nổi góc trái dưới mọi trang.
// Nội dung hội thoại nằm trong tro-ly-du-lieu.js. Lịch sử chat lưu trong sessionStorage.
(function () {
    const KB = window.TRO_LY;
    if (!KB || document.getElementById('tl-khung')) return;

    const KHOA_LUU = 'tro_ly_lich_su';
    let lichSu = [];          // [{ai:'bot', node} | {ai:'ban', nut} | {ai:'ban', chu}]
    let dangGo = false;
    const boNhoSP = {};       // nhóm → danh sách sản phẩm

    const ng = () => (typeof layNgonNgu === 'function' ? layNgonNgu() : 'vi');
    const chu3 = obj => (obj ? (obj[ng()] || obj.vi || '') : '');
    const maHoa = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    // **đậm** → <strong> (sau khi đã mã hóa)
    const dinhDangChu = s => maHoa(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

    // ---------- Lưu / đọc lịch sử ----------
    function luu() {
        try { sessionStorage.setItem(KHOA_LUU, JSON.stringify(lichSu.slice(-60))); } catch (e) { /* bỏ qua */ }
    }
    function doc() {
        try { lichSu = JSON.parse(sessionStorage.getItem(KHOA_LUU) || '[]'); } catch (e) { lichSu = []; }
        if (!Array.isArray(lichSu)) lichSu = [];
    }

    // ---------- Nhận diện câu gõ tự do ----------
    function chuanHoa(s) {
        return ' ' + String(s).toLowerCase()
            .normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd')
            .replace(/[^\p{L}\p{N}]+/gu, ' ')
            // ghép các cụm hay gây nhầm (vd "gia công" ≠ "giá", "khảo sát" ≠ "sắt")
            .replace(/\bgia cong\b/g, 'giacong').replace(/\bgia dinh\b/g, 'giadinh')
            .replace(/\bkhao sat\b/g, 'khaosat').replace(/\bthi cong\b/g, 'thicong')
            .replace(/\bcong ty\b/g, 'congty').replace(/\bcong trinh\b/g, 'congtrinh')
            .replace(/\s+/g, ' ').trim() + ' ';
    }
    const coChuTrung = s => /[一-鿿]/.test(s);

    function timNode(cauHoi) {
        const goc = String(cauHoi).toLowerCase();
        const chuan = chuanHoa(cauHoi);
        for (const muc of KB.TU_KHOA) {
            for (const tu of muc.tu) {
                if (coChuTrung(tu) ? goc.includes(tu) : chuan.includes(' ' + chuanHoa(tu).trim() + ' ')) return muc.toi;
            }
        }
        return 'khong-hieu';
    }

    // ---------- Giao diện ----------
    const iconChat = '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><circle cx="8" cy="10" r="0.6" fill="currentColor"/><circle cx="12" cy="10" r="0.6" fill="currentColor"/><circle cx="16" cy="10" r="0.6" fill="currentColor"/></svg>';

    const nut = document.createElement('button');
    nut.type = 'button';
    nut.className = 'tl-nut-mo';
    nut.innerHTML = `${iconChat}<span class="tl-nhan-mo"></span><i class="tl-cham-do"></i>`;
    const khung = document.createElement('section');
    khung.id = 'tl-khung';
    khung.className = 'tl-khung';
    khung.setAttribute('aria-live', 'polite');
    khung.hidden = true;
    khung.innerHTML = `
        <header class="tl-dau">
            <img src="assets/images/logo.jpg" alt="" class="tl-logo">
            <div><strong class="tl-ten"></strong><span class="tl-trang-thai"></span></div>
            <button type="button" class="tl-dong" aria-label="Đóng">✕</button>
        </header>
        <div class="tl-than" id="tl-than"></div>
        <form class="tl-nhap" id="tl-form" autocomplete="off">
            <input type="text" id="tl-o-nhap" maxlength="200">
            <button type="submit" aria-label="Gửi">➤</button>
        </form>`;
    document.body.appendChild(nut);
    document.body.appendChild(khung);
    const than = khung.querySelector('#tl-than');

    function veNhan() {
        nut.querySelector('.tl-nhan-mo').textContent = chu3(KB.moChat);
        nut.setAttribute('aria-label', chu3(KB.moChat));
        khung.querySelector('.tl-ten').textContent = chu3(KB.ten);
        khung.querySelector('.tl-trang-thai').textContent = chu3(KB.trangThai);
        khung.querySelector('#tl-o-nhap').placeholder = chu3(KB.oNhap);
    }

    function linkHanhDong(loai, node) {
        const nhom = node.nhom || '';
        switch (loai) {
            case '3d': return `thiet-ke-nha.html${node.congNang ? '?cong_nang=' + node.congNang : ''}`;
            case 'datLich': return `dat-lich.html${nhom ? '?dich_vu=' + nhom : ''}`;
            case 'goi': return 'tel:0976224875';
            case 'zalo': return 'https://zalo.me/0976224875';
            default: return '#';
        }
    }

    function htmlSanPham(nhom) {
        const ds = boNhoSP[nhom];
        if (!ds) return `<div class="tl-sp-dang-tai" data-nhom="${nhom}">…</div>`;
        if (!ds.length) return '';
        return `<div class="tl-goi-y">${maHoa(chu3(KB.goiYSanPham))}</div>
            <div class="tl-ds-sp">${ds.map(sp => `
                <a class="tl-sp" href="chi-tiet.html?id=${sp.id}">
                    <img src="${maHoa(/^(assets\/|https:\/\/)/.test(sp.hinh_anh || '') ? sp.hinh_anh : 'assets/images/logo.jpg')}" alt="" loading="lazy">
                    <span>${maHoa(typeof tuDB === 'function' ? tuDB(sp, 'ten') : sp.ten)}</span>
                    <em>${maHoa(chu3(KB.hanhDong.xemChiTiet))} →</em>
                </a>`).join('')}</div>`;
    }

    async function taiSanPham(nhom) {
        if (boNhoSP[nhom] || typeof db === 'undefined' || !db) { boNhoSP[nhom] = boNhoSP[nhom] || []; return; }
        try {
            const { data, error } = await db.from('san_pham').select('id, ten, ten_en, ten_zh, hinh_anh, nhom, noi_bat, thu_tu')
                .eq('nhom', nhom).order('noi_bat', { ascending: false }).order('thu_tu', { ascending: true }).limit(3);
            if (error) throw error;
            boNhoSP[nhom] = data || [];
        } catch (e) {
            console.warn('Trợ lý: không tải được sản phẩm', e);
            boNhoSP[nhom] = [];
        }
        than.querySelectorAll(`.tl-sp-dang-tai[data-nhom="${nhom}"]`).forEach(el => { el.outerHTML = htmlSanPham(nhom); });
    }

    function htmlTinBot(muc, laCuoi) {
        const node = KB.NODE[muc.node];
        if (!node) return '';
        let h = `<div class="tl-tin tl-bot"><p>${dinhDangChu(chu3(node.chu))}</p>`;
        if (node.nhom) {
            h += htmlSanPham(node.nhom);
            if (!boNhoSP[node.nhom]) taiSanPham(node.nhom);
        }
        if (node.hanhDong && laCuoi) {
            h += `<div class="tl-hanh-dong">${node.hanhDong.map(hd => hd === 'batDauLai'
                ? `<button type="button" class="tl-hd" data-bat-dau-lai>${maHoa(chu3(KB.hanhDong[hd]))}</button>`
                : `<a class="tl-hd${hd === 'goi' ? ' tl-hd-chinh' : ''}" href="${linkHanhDong(hd, node)}"${hd === 'zalo' ? ' target="_blank" rel="noopener"' : ''}>${maHoa(chu3(KB.hanhDong[hd]))}</a>`).join('')}</div>`;
        }
        h += '</div>';
        if (node.nut && laCuoi) {
            h += `<div class="tl-nut-nhanh">${node.nut.map(id => `<button type="button" data-nut="${id}">${maHoa(chu3(KB.NUT[id].nhan))}</button>`).join('')}</div>`;
        }
        return h;
    }

    function ve() {
        let viTriBotCuoi = -1;
        lichSu.forEach((m, i) => { if (m.ai === 'bot') viTriBotCuoi = i; });
        than.innerHTML = lichSu.map((m, i) => {
            if (m.ai === 'bot') return htmlTinBot(m, i === viTriBotCuoi);
            const chu = m.nut ? chu3(KB.NUT[m.nut] && KB.NUT[m.nut].nhan) : m.chu;
            return `<div class="tl-tin tl-ban"><p>${maHoa(chu)}</p></div>`;
        }).join('') + (dangGo ? '<div class="tl-tin tl-bot tl-dang-go"><span></span><span></span><span></span></div>' : '');
        than.scrollTop = than.scrollHeight;
    }

    function botNoi(nodeId) {
        dangGo = true;
        ve();
        const node = KB.NODE[nodeId];
        if (node && node.nhom) taiSanPham(node.nhom);
        setTimeout(() => {
            dangGo = false;
            lichSu.push({ ai: 'bot', node: nodeId });
            luu();
            ve();
        }, 550 + Math.random() * 400);
    }

    function mo() {
        khung.hidden = false;
        nut.classList.add('dang-mo');
        nut.querySelector('.tl-cham-do').hidden = true;
        requestAnimationFrame(() => khung.classList.add('hien'));
        if (!lichSu.length) botNoi('chao');
        else ve();
        if (window.innerWidth > 640) setTimeout(() => khung.querySelector('#tl-o-nhap').focus(), 250);
    }
    function dong() {
        khung.classList.remove('hien');
        nut.classList.remove('dang-mo');
        setTimeout(() => { khung.hidden = true; }, 200);
    }

    // ---------- Sự kiện ----------
    nut.addEventListener('click', () => (khung.hidden ? mo() : dong()));
    khung.querySelector('.tl-dong').addEventListener('click', dong);
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !khung.hidden) dong(); });

    than.addEventListener('click', e => {
        if (dangGo) return;
        const b = e.target.closest('[data-nut]');
        if (b && KB.NUT[b.dataset.nut]) {
            lichSu.push({ ai: 'ban', nut: b.dataset.nut });
            botNoi(KB.NUT[b.dataset.nut].toi);
            return;
        }
        if (e.target.closest('[data-bat-dau-lai]')) {
            botNoi('chao');
        }
    });

    khung.querySelector('#tl-form').addEventListener('submit', e => {
        e.preventDefault();
        const o = khung.querySelector('#tl-o-nhap');
        const cau = o.value.trim();
        if (!cau || dangGo) return;
        o.value = '';
        lichSu.push({ ai: 'ban', chu: cau.slice(0, 200) });
        botNoi(timNode(cau));
    });

    document.addEventListener('doi-ngon-ngu', () => { veNhan(); if (!khung.hidden) ve(); });

    doc();
    veNhan();
    // chấm đỏ nhắc khách lần đầu
    if (lichSu.length) nut.querySelector('.tl-cham-do').hidden = true;

    // cho phép trang khác mở trợ lý: window.TroLy.mo()
    window.TroLy = { mo, dong, timNode };
})();
