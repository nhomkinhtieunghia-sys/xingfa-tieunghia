// Trang Tin tức: danh sách bài ĐÃ ĐĂNG (bảng bai_viet), lọc chuyên mục, tìm kiếm, bài nổi bật, phân trang 9 bài
(function () {
    const CHUYEN_MUC = ['tat-ca', 'kien-thuc', 'tin-cong-ty', 'cong-trinh'];
    const MOI_TRANG = 9;
    let tatCa = [];
    let chuyenMuc = 'tat-ca';
    let tuKhoa = '';
    let trang = 1;
    const $ = id => document.getElementById(id);
    const m = s => TieuNghia.maHoa(s);

    // bỏ dấu để tìm "nha panel" vẫn ra "Nhà panel"
    const boDau = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');

    function veChuyenMuc() {
        $('tt-chuyen-muc').innerHTML = CHUYEN_MUC.map(cm => `
            <button type="button" class="tk-chip ct-chip${chuyenMuc === cm ? ' active' : ''}" data-cm="${cm}">
                ${m(cm === 'tat-ca' ? t('congTrinh.tatCa') : t('tinTuc.cm_' + cm.replace(/-/g, '_')))}
            </button>`).join('');
    }

    function locBai() {
        const k = boDau(tuKhoa.trim());
        return tatCa.filter(bv => (chuyenMuc === 'tat-ca' || bv.chuyen_muc === chuyenMuc) &&
            (!k || boDau(bv.tieu_de + ' ' + (bv.tieu_de_en || '') + ' ' + (bv.tieu_de_zh || '') + ' ' + (bv.tom_tat || '')).includes(k)));
    }

    function ve() {
        const ds = locBai();
        // Bài nổi bật: chỉ hiện to ở trang 1 khi không lọc / tìm
        const coNoiBat = trang === 1 && chuyenMuc === 'tat-ca' && !tuKhoa.trim();
        const noiBat = coNoiBat ? ds.find(bv => bv.noi_bat) : null;
        const conLai = noiBat ? ds.filter(bv => bv !== noiBat) : ds;

        $('tt-noi-bat').innerHTML = noiBat ? `
            <a class="tt-noi-bat" href="bai-viet.html?bai=${encodeURIComponent(noiBat.slug)}">
                <div class="tt-nb-anh"><img src="${m(TieuNghia.anhAnToan(noiBat.anh_dai_dien))}" alt="${m(tuDB(noiBat, 'tieu_de'))}"></div>
                <div class="tt-nb-chu">
                    <span class="tt-nhan-nb">★ ${m(t('tinTuc.noiBat'))}</span>
                    <div class="bv-the-meta"><span class="bv-chuyen-muc">${m(t('tinTuc.cm_' + noiBat.chuyen_muc.replace(/-/g, '_')))}</span><span>${m(dinhDangNgay(noiBat.ngay_dang))}</span></div>
                    <h2>${m(tuDB(noiBat, 'tieu_de'))}</h2>
                    <p>${m(tuDB(noiBat, 'tom_tat') || '')}</p>
                    <span class="btn-chinh">${m(t('tinTuc.docBai'))} →</span>
                </div>
            </a>` : '';

        const tongTrang = Math.max(1, Math.ceil(conLai.length / MOI_TRANG));
        if (trang > tongTrang) trang = tongTrang;
        const trangNay = conLai.slice((trang - 1) * MOI_TRANG, trang * MOI_TRANG);
        $('tt-luoi').innerHTML = trangNay.length
            ? trangNay.map(bv => TieuNghia.theBaiViet(bv)).join('')
            : (noiBat ? '' : `<div class="ct-dang-tai">${m(t('tinTuc.khongCo'))}</div>`);

        $('tt-phan-trang').innerHTML = tongTrang > 1 ? Array.from({ length: tongTrang }, (_, i) =>
            `<button type="button" class="${i + 1 === trang ? 'active' : ''}" data-trang="${i + 1}">${i + 1}</button>`).join('') : '';
    }

    async function tai() {
        try {
            // Lọc da_dang = true cả ở đây (admin đã đăng nhập vẫn chỉ thấy bài đã đăng ngoài trang khách)
            const { data, error } = await db.from('bai_viet')
                .select('slug, chuyen_muc, tieu_de, tieu_de_en, tieu_de_zh, tom_tat, tom_tat_en, tom_tat_zh, anh_dai_dien, noi_bat, ngay_dang, created_at')
                .eq('da_dang', true).order('ngay_dang', { ascending: false }).order('created_at', { ascending: false });
            if (error) throw error;
            tatCa = data || [];
            ve();
        } catch (err) {
            console.error(err);
            $('tt-luoi').innerHTML = `<div class="ct-dang-tai">${m(t('datLich.loiMang'))}</div>`;
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        const tham = new URLSearchParams(location.search);
        if (CHUYEN_MUC.includes(tham.get('cm'))) chuyenMuc = tham.get('cm');
        veChuyenMuc();
        tai();
        $('tt-chuyen-muc').addEventListener('click', e => {
            const b = e.target.closest('[data-cm]');
            if (!b) return;
            chuyenMuc = b.dataset.cm;
            trang = 1;
            veChuyenMuc();
            ve();
        });
        let hen;
        $('tt-o-tim').addEventListener('input', e => {
            clearTimeout(hen);
            hen = setTimeout(() => { tuKhoa = e.target.value; trang = 1; ve(); }, 200);
        });
        $('tt-phan-trang').addEventListener('click', e => {
            const b = e.target.closest('[data-trang]');
            if (!b) return;
            trang = Number(b.dataset.trang);
            ve();
            $('tt-chuyen-muc').scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    document.addEventListener('doi-ngon-ngu', () => {
        if (!$('tt-chuyen-muc')) return;
        veChuyenMuc();
        if (tatCa.length) ve();
    });
})();
