// Trang Chi tiết bài viết: bai-viet.html?bai=<slug>
// Nội dung Markdown → HTML bằng marked, lọc an toàn bằng DOMPurify; tăng lượt xem 1 lần / phiên.
(function () {
    let bai = null;
    let lienQuan = [];
    const $ = id => document.getElementById(id);
    const m = s => TieuNghia.maHoa(s);
    const slug = (new URLSearchParams(location.search).get('bai') || '').trim();

    function coBanDich() {
        const ng = layNgonNgu();
        return ng === 'vi' || !!(bai && bai['noi_dung_' + ng]);
    }

    function thoiGianDoc(chu) {
        const coTrung = /[一-鿿]/.test(chu);
        const phut = coTrung ? chu.length / 400 : chu.split(/\s+/).length / 200;
        return Math.max(1, Math.round(phut));
    }

    function khongTimThay() {
        $('bv-tieu-de').textContent = t('tinTuc.khongTimThay');
        $('bv-tieu-de').removeAttribute('data-i18n');
        $('bv-meta').innerHTML = '';
        $('bv-noi-dung').innerHTML = `<p class="ct-dang-tai"><a class="btn-chinh" href="tin-tuc.html">← ${m(t('tinTuc.veTinTuc'))}</a></p>`;
    }

    function ve() {
        if (!bai) return;
        const tieuDe = tuDB(bai, 'tieu_de');
        const noiDung = tuDB(bai, 'noi_dung') || '';
        const tomTat = tuDB(bai, 'tom_tat') || '';

        $('bv-dau').style.backgroundImage = `linear-gradient(180deg, rgba(26,36,82,.35), rgba(26,36,82,.9)), url("${TieuNghia.anhAnToan(bai.anh_dai_dien).replace(/"/g, '%22')}")`;
        $('bv-tieu-de').removeAttribute('data-i18n');
        $('bv-tieu-de').textContent = tieuDe;
        $('bv-meta').innerHTML = `
            <span class="bv-chuyen-muc">${m(t('tinTuc.cm_' + bai.chuyen_muc.replace(/-/g, '_')))}</span>
            <span>📅 ${m(dinhDangNgay(bai.ngay_dang))}</span>
            <span>👁 ${m(dinhDangSo(bai.luot_xem || 0))} ${m(t('tinTuc.luotXem'))}</span>
            <span>⏱ ${m(t('tinTuc.phutDoc').replace('{n}', thoiGianDoc(noiDung)))}</span>`;

        const chiVi = $('bv-chi-vi');
        chiVi.hidden = coBanDich();
        chiVi.textContent = t('tinTuc.chiTiengViet');

        const html = typeof marked !== 'undefined' ? marked.parse(noiDung) : m(noiDung).replace(/\n/g, '<br>');
        $('bv-noi-dung').innerHTML = typeof DOMPurify !== 'undefined' ? DOMPurify.sanitize(html) : m(noiDung);
        // link ngoài mở tab mới
        $('bv-noi-dung').querySelectorAll('a[href^="http"]').forEach(a => { a.target = '_blank'; a.rel = 'noopener'; });

        document.title = `${tieuDe} - Xingfa Tiếu Nghĩa`;
        const moTa = document.querySelector('meta[name="description"]');
        if (moTa) moTa.setAttribute('content', tomTat || tieuDe);

        const link = location.href;
        $('bv-fb').href = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(link);
        $('bv-chia-se').hidden = false;
        $('bv-lien-he').hidden = false;
        veLienQuan();
    }

    function veLienQuan() {
        $('bv-lien-quan').hidden = !lienQuan.length;
        $('bv-ds-lien-quan').innerHTML = lienQuan.map(bv => TieuNghia.theBaiViet(bv)).join('');
    }

    async function saoChepLink(thongBao) {
        try {
            await navigator.clipboard.writeText(location.href);
            TieuNghia.toast(thongBao, 'thanh-cong');
        } catch (e) {
            TieuNghia.toast(location.href, 'info');
        }
    }

    async function tai() {
        if (!slug) { khongTimThay(); return; }
        try {
            const { data, error } = await db.from('bai_viet').select('*').eq('slug', slug).eq('da_dang', true).maybeSingle();
            if (error) throw error;
            if (!data) { khongTimThay(); return; }
            bai = data;
            ve();

            // Lượt xem: mỗi phiên chỉ tăng 1 lần
            const khoa = 'da_xem_' + slug;
            let daXem = false;
            try { daXem = sessionStorage.getItem(khoa) === '1'; } catch (e) { /* bỏ qua */ }
            if (!daXem) {
                db.rpc('tang_luot_xem', { p_slug: slug }).then(({ error: loi }) => {
                    if (!loi) {
                        try { sessionStorage.setItem(khoa, '1'); } catch (e) { /* bỏ qua */ }
                        bai.luot_xem = (bai.luot_xem || 0) + 1;
                        ve();
                    }
                });
            }

            // Bài liên quan: cùng chuyên mục trước, thiếu thì lấy bài mới khác
            const cot = 'slug, chuyen_muc, tieu_de, tieu_de_en, tieu_de_zh, tom_tat, tom_tat_en, tom_tat_zh, anh_dai_dien, ngay_dang';
            const { data: ds } = await db.from('bai_viet').select(cot).eq('da_dang', true).neq('slug', slug)
                .order('ngay_dang', { ascending: false }).limit(12);
            const cung = (ds || []).filter(x => x.chuyen_muc === bai.chuyen_muc);
            const khac = (ds || []).filter(x => x.chuyen_muc !== bai.chuyen_muc);
            lienQuan = [...cung, ...khac].slice(0, 3);
            veLienQuan();
        } catch (err) {
            console.error(err);
            $('bv-tieu-de').textContent = t('datLich.loiMang');
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        tai();
        $('bv-sao-chep').addEventListener('click', () => saoChepLink(t('tinTuc.daSaoChep')));
        // Zalo không có nút chia sẻ web chính thức không cần SDK → điện thoại dùng bảng chia sẻ của máy, máy tính thì sao chép link
        $('bv-zalo').addEventListener('click', async e => {
            e.preventDefault();
            if (navigator.share) {
                try { await navigator.share({ title: document.title, url: location.href }); return; } catch (err) { if (err.name === 'AbortError') return; }
            }
            saoChepLink(t('tinTuc.danVaoZalo'));
        });
    });

    document.addEventListener('doi-ngon-ngu', () => { ve(); });
})();
