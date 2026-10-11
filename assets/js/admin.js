// QUẢN TRỊ – phần lõi: đăng nhập, menu 8 mục, modal, form 3 ngôn ngữ, chọn ảnh, cờ ngôn ngữ
// + 3 tab: Sản phẩm (thêm/sửa/xóa), Yêu cầu báo giá, Thiết kế nhà.
// Các tab khác nằm ở file riêng: admin-thong-ke.js, admin-tien-do.js, admin-cong-trinh.js, admin-bai-viet.js
const Admin = (() => {
    const $ = id => document.getElementById(id);
    const m = s => TieuNghia.maHoa(s);

    const NHOM = {
        'cua-sat': 'Cửa sắt – Cổng – Lan can', 'cua-nhom': 'Cửa nhôm Xingfa', 'nha-panel': 'Nhà lắp ráp panel',
        'tu-bep': 'Tủ bếp & nội thất nhôm', 'mai-che': 'Mái che hiện đại', 'bao-tri': 'Bảo trì & sửa chữa'
    };
    const TRANG_THAI_YC = { moi: 'Mới', da_lien_he: 'Đã liên hệ', da_bao_gia: 'Đã báo giá', hoan_tat: 'Hoàn tất' };
    const CO = { vi: '🇻🇳', en: '🇬🇧', zh: '🇨🇳' };
    const ANH_CO_SAN = ['banner.jpg', 'bao-tri.jpg', 'cua-nhom-4-canh.jpg', 'cua-nhom-xingfa.jpg', 'cua-sat.jpg', 'mai-che.jpg',
        'nha-panel-dan-dung.jpg', 'nha-panel-mau-go.jpg', 'tu-bep-nhom.jpg', 'tu-bep-tieu-nghia.jpg', 've-chung-toi.jpg',
        'sp-cua-sat-rao.jpg', 'sp-lan-can-cau-thang.jpg', 'sp-mai-hien-di-dong.jpg', 'sp-nha-panel-pu.jpg', 'sp-sua-cong-sat.jpg',
        'sp-vach-kinh-cuong-luc.jpg'].map(f => 'assets/images/' + f);

    const tabs = [];       // [{id, ten, icon, dem, ve}]
    let tabHienTai = null;
    let khiLuuModal = null;

    // ---------- Tiện ích ----------
    const ngay = d => d ? new Date(d).toLocaleDateString('vi-VN') : '';
    const ngayGio = d => d ? new Date(d).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';
    const co = ng => `<span class="ad-co" title="Khách dùng ${ng === 'en' ? 'tiếng Anh' : ng === 'zh' ? 'tiếng Trung' : 'tiếng Việt'}">${CO[ng] || CO.vi}</span>`;
    const so = n => new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 }).format(n || 0);
    const toast = (chu, loai = 'thanh-cong') => TieuNghia.toast(chu, loai);
    const baoLoi = (err, chu = 'Có lỗi, vui lòng thử lại') => { console.error(err); toast(chu + (err && err.message ? ': ' + err.message : ''), 'loi'); };

    function xacNhan(cauHoi) {
        return new Promise(resolve => {
            $('ad-xac-nhan-chu').textContent = cauHoi;
            $('ad-xac-nhan').hidden = false;
            const xong = kq => { $('ad-xac-nhan').hidden = true; $('ad-xn-co').onclick = $('ad-xn-khong').onclick = null; resolve(kq); };
            $('ad-xn-co').onclick = () => xong(true);
            $('ad-xn-khong').onclick = () => xong(false);
        });
    }

    // ---------- Modal ----------
    function moModal({ tieuDe, noiDung, nutLuu = 'Lưu', khiLuu = null, toanManHinh = false, chanTrang = null }) {
        $('ad-modal-tieu-de').textContent = tieuDe;
        $('ad-modal-than').innerHTML = noiDung;
        $('ad-modal').classList.toggle('toan-man-hinh', toanManHinh);
        $('ad-modal-chan').innerHTML = chanTrang ?? (khiLuu
            ? `<button type="button" class="btn-phu" data-dong-modal>Hủy</button><button type="button" class="btn-chinh" id="ad-nut-luu">${m(nutLuu)}</button>`
            : `<button type="button" class="btn-phu" data-dong-modal>Đóng</button>`);
        khiLuuModal = khiLuu;
        $('ad-modal').hidden = false;
        document.body.classList.add('ad-khoa-cuon');
        const nut = $('ad-nut-luu');
        if (nut) nut.addEventListener('click', luuModal);
        return $('ad-modal-than');
    }
    async function luuModal() {
        const nut = $('ad-nut-luu');
        if (!khiLuuModal || nut.disabled) return;
        nut.disabled = true;
        const chuCu = nut.textContent;
        nut.textContent = 'Đang lưu...';
        try {
            const ok = await khiLuuModal();
            if (ok !== false) dongModal();
        } finally {
            nut.disabled = false;
            nut.textContent = chuCu;
        }
    }
    function dongModal() {
        $('ad-modal').hidden = true;
        $('ad-modal-than').innerHTML = '';
        document.body.classList.remove('ad-khoa-cuon');
        khiLuuModal = null;
    }

    // ---------- Form 3 ngôn ngữ ----------
    // truong: [{ten:'ten', nhan:'Tên', loai:'text'|'textarea', batBuoc:true, dong:4, goiY:''}]
    function oDaNgonNgu(truong, duLieu = {}, { coNutDich = true, id = 'nn' } = {}) {
        const ve = ng => truong.map(tr => {
            const ten = ng === 'vi' ? tr.ten : `${tr.ten}_${ng}`;
            const gt = m(duLieu[ten] ?? '');
            const bb = tr.batBuoc && ng === 'vi' ? ' *' : '';
            const o = tr.loai === 'textarea'
                ? `<textarea name="${ten}" rows="${tr.dong || 3}" placeholder="${m(tr.goiY || '')}">${gt}</textarea>`
                : `<input type="text" name="${ten}" value="${gt}" placeholder="${m(tr.goiY || '')}">`;
            return `<label class="dl-o"><span>${m(tr.nhan)}${bb}</span>${o}</label>`;
        }).join('');
        const coDuLieu = ng => truong.some(tr => (duLieu[`${tr.ten}_${ng}`] || '').trim());
        return `<div class="ad-da-nn" data-nhom-nn="${id}">
            <div class="ad-nn-tabs">
                <button type="button" class="active" data-nn="vi">🇻🇳 VI</button>
                <button type="button" data-nn="en">🇬🇧 EN <i class="ad-cham ${coDuLieu('en') ? 'co' : ''}"></i></button>
                <button type="button" data-nn="zh">🇨🇳 中文 <i class="ad-cham ${coDuLieu('zh') ? 'co' : ''}"></i></button>
                ${coNutDich ? `<span class="ad-nn-gian"></span>
                <label class="ad-chi-o-trong"><input type="checkbox" data-chi-trong checked> Chỉ dịch ô còn trống</label>
                <button type="button" class="ad-nut-dich-ai" data-dich-ai>✨ 🌐 Dịch bằng AI</button>` : ''}
            </div>
            ${['vi', 'en', 'zh'].map(ng => `<div class="ad-nn-than${ng === 'vi' ? ' active' : ''}" data-than-nn="${ng}">${ve(ng)}</div>`).join('')}
        </div>`;
    }

    function docForm(form) {
        const kq = {};
        form.querySelectorAll('[name]').forEach(el => {
            if (el.type === 'checkbox') kq[el.name] = el.checked;
            else if (el.type === 'number') kq[el.name] = el.value === '' ? null : Number(el.value);
            else kq[el.name] = el.value.trim() === '' ? null : el.value.trim();
        });
        return kq;
    }

    // ---------- Chọn ảnh (có sẵn hoặc tải lên kho ảnh "anh-web") ----------
    function oChonAnh(ten, giaTri, thuMuc) {
        const coSan = ANH_CO_SAN.includes(giaTri);
        return `<div class="ad-chon-anh" data-thu-muc="${thuMuc}">
            <img class="ad-xem-anh" src="${m(TieuNghia.anhAnToan(giaTri, 'assets/images/logo.jpg'))}" alt="">
            <div class="ad-chon-anh-o">
                <label class="dl-o"><span>Ảnh có sẵn</span>
                    <select data-chon-co-san>
                        <option value="">— Chọn ảnh —</option>
                        ${ANH_CO_SAN.map(a => `<option value="${a}" ${a === giaTri ? 'selected' : ''}>${a.replace('assets/images/', '')}</option>`).join('')}
                        ${giaTri && !coSan ? `<option value="${m(giaTri)}" selected>Ảnh đã tải lên</option>` : ''}
                    </select>
                </label>
                <label class="btn-phu ad-nut-tai-anh">⬆ Tải ảnh lên<input type="file" accept="image/*" data-tai-anh hidden></label>
                <input type="hidden" name="${ten}" value="${m(giaTri || '')}">
                <small class="ad-goi-y">Ảnh tải lên được nén còn tối đa 1600px trước khi lưu.</small>
            </div>
        </div>`;
    }

    // nén ảnh ≤1600px, JPEG 0.82
    function nenAnh(file) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const tl = Math.min(1, 1600 / Math.max(img.width, img.height));
                const cv = document.createElement('canvas');
                cv.width = Math.round(img.width * tl);
                cv.height = Math.round(img.height * tl);
                cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
                cv.toBlob(b => (b ? resolve(b) : reject(new Error('Không nén được ảnh'))), 'image/jpeg', 0.82);
                URL.revokeObjectURL(img.src);
            };
            img.onerror = () => reject(new Error('File không phải ảnh'));
            img.src = URL.createObjectURL(file);
        });
    }

    async function taiAnhLen(file, thuMuc, tenGoi = 'anh') {
        const blob = await nenAnh(file);
        const duongDan = `${thuMuc}/${tenGoi}-${Date.now()}.jpg`;
        const { error } = await db.storage.from('anh-web').upload(duongDan, blob, { contentType: 'image/jpeg' });
        if (error) throw error;
        return db.storage.from('anh-web').getPublicUrl(duongDan).data.publicUrl;
    }

    // Sự kiện chung trong modal (tab ngôn ngữ, chọn ảnh, dịch AI)
    function ganSuKienModal() {
        const than = $('ad-modal-than');
        than.addEventListener('click', e => {
            const nn = e.target.closest('[data-nn]');
            if (nn) {
                const khoi = nn.closest('.ad-da-nn');
                khoi.querySelectorAll('[data-nn]').forEach(b => b.classList.toggle('active', b === nn));
                khoi.querySelectorAll('[data-than-nn]').forEach(d => d.classList.toggle('active', d.dataset.thanNn === nn.dataset.nn));
            }
            const dich = e.target.closest('[data-dich-ai]');
            if (dich && window.AdminDichAI) window.AdminDichAI.dichKhoi(dich.closest('.ad-da-nn'));
        });
        than.addEventListener('change', async e => {
            const khung = e.target.closest('.ad-chon-anh');
            if (!khung) return;
            const an = khung.querySelector('input[type=hidden]');
            if (e.target.matches('[data-chon-co-san]')) {
                an.value = e.target.value;
                khung.querySelector('.ad-xem-anh').src = TieuNghia.anhAnToan(e.target.value, 'assets/images/logo.jpg');
            }
            if (e.target.matches('[data-tai-anh]') && e.target.files[0]) {
                const nhan = khung.querySelector('.ad-nut-tai-anh');
                nhan.classList.add('dang-tai');
                try {
                    const url = await taiAnhLen(e.target.files[0], khung.dataset.thuMuc);
                    an.value = url;
                    khung.querySelector('.ad-xem-anh').src = url;
                    const sel = khung.querySelector('[data-chon-co-san]');
                    sel.insertAdjacentHTML('beforeend', `<option value="${m(url)}" selected>Ảnh đã tải lên</option>`);
                    toast('Đã tải ảnh lên kho ảnh');
                } catch (err) {
                    baoLoi(err, 'Tải ảnh lỗi');
                } finally {
                    nhan.classList.remove('dang-tai');
                    e.target.value = '';
                }
            }
        });
        // dấu chấm xanh khi ô EN/ZH có chữ
        than.addEventListener('input', e => {
            const khoi = e.target.closest('.ad-da-nn');
            if (khoi) capNhatCham(khoi);
        });
    }
    function capNhatCham(khoi) {
        ['en', 'zh'].forEach(ng => {
            const coChu = [...khoi.querySelectorAll(`[data-than-nn="${ng}"] [name]`)].some(o => o.value.trim());
            const cham = khoi.querySelector(`[data-nn="${ng}"] .ad-cham`);
            if (cham) cham.classList.toggle('co', coChu);
        });
    }

    // ---------- Khung, menu, đếm số ----------
    function dangKyTab(tab) { tabs.push(tab); }

    function veMenu() {
        $('ad-menu').innerHTML = tabs.map(tb => `
            <button type="button" class="ad-muc${tabHienTai === tb.id ? ' active' : ''}" data-tab="${tb.id}">
                <span class="ad-icon">${tb.icon}</span><span class="ad-ten-muc">${m(tb.ten)}</span><span class="ad-dem" data-dem="${tb.id}"></span>
            </button>`).join('');
    }

    async function capNhatDem() {
        await Promise.all(tabs.filter(tb => tb.dem).map(async tb => {
            try {
                const n = await tb.dem();
                const el = document.querySelector(`[data-dem="${tb.id}"]`);
                if (el) { el.textContent = n || ''; el.classList.toggle('co', n > 0 && !tb.demTong); el.classList.toggle('tong', n > 0 && !!tb.demTong); }
            } catch (e) { /* bỏ qua */ }
        }));
    }

    async function moTab(id) {
        const tab = tabs.find(tb => tb.id === id) || tabs[0];
        tabHienTai = tab.id;
        document.querySelectorAll('.ad-muc').forEach(b => b.classList.toggle('active', b.dataset.tab === tab.id));
        $('ad-tieu-de').textContent = tab.ten;
        $('ad-dau-phai').innerHTML = '';
        const khung = $('ad-trang');
        khung.innerHTML = '<div class="ad-dang-tai">Đang tải...</div>';
        try { history.replaceState(null, '', '#' + tab.id); } catch (e) { /* bỏ qua */ }
        try {
            await tab.ve(khung, $('ad-dau-phai'));
        } catch (err) {
            khung.innerHTML = `<div class="ad-dang-tai">Không tải được dữ liệu. ${m(err.message || '')}</div>`;
            console.error(err);
        }
    }
    const veLai = () => { capNhatDem(); return moTab(tabHienTai); };

    // ---------- Đăng nhập ----------
    async function hienTheoPhien(phien) {
        const daDN = !!(phien && phien.user);
        $('ad-dang-nhap').hidden = daDN;
        $('ad-khung').hidden = !daDN;
        if (!daDN) return;
        $('ad-email').textContent = phien.user.email;
        if (!$('ad-menu').children.length) {
            veMenu();
            const tuLink = location.hash.replace('#', '');
            await moTab(tabs.some(tb => tb.id === tuLink) ? tuLink : tabs[0].id);
            capNhatDem();
        }
    }

    function khoiDong() {
        if (!db) { document.body.innerHTML = '<p style="padding:40px">Chưa cấu hình Supabase trong config.js</p>'; return; }
        tabs.sort((a, b) => (a.thuTu || 0) - (b.thuTu || 0));
        $('form-dang-nhap').addEventListener('submit', async e => {
            e.preventDefault();
            const nut = $('nut-dang-nhap');
            nut.disabled = true;
            $('dn-loi').textContent = '';
            const { error } = await db.auth.signInWithPassword({ email: $('dn-email').value.trim(), password: $('dn-mat-khau').value });
            nut.disabled = false;
            if (error) $('dn-loi').textContent = 'Sai email hoặc mật khẩu.';
            $('dn-mat-khau').value = '';
        });
        $('nut-dang-xuat').addEventListener('click', async () => {
            await db.auth.signOut();
            $('ad-menu').innerHTML = '';
            $('ad-trang').innerHTML = '';
        });
        $('ad-menu').addEventListener('click', e => {
            const b = e.target.closest('[data-tab]');
            if (b) moTab(b.dataset.tab);
        });
        document.addEventListener('click', e => { if (e.target.closest('[data-dong-modal]')) dongModal(); });
        document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('ad-modal').hidden && !$('ad-modal').classList.contains('toan-man-hinh')) dongModal(); });
        ganSuKienModal();
        db.auth.onAuthStateChange((_su_kien, phien) => { hienTheoPhien(phien); });
        db.auth.getSession().then(({ data }) => hienTheoPhien(data.session));
    }

    // =========================================================
    // TAB SẢN PHẨM (INSERT / UPDATE / DELETE)
    // =========================================================
    const TRUONG_SP = [
        { ten: 'ten', nhan: 'Tên sản phẩm', batBuoc: true },
        { ten: 'mo_ta_ngan', nhan: 'Mô tả ngắn (1–2 câu)', loai: 'textarea', dong: 2 },
        { ten: 'mo_ta_chi_tiet', nhan: 'Mô tả chi tiết', loai: 'textarea', dong: 5 },
        { ten: 'vat_lieu', nhan: 'Vật liệu' },
        { ten: 'uu_diem', nhan: 'Ưu điểm (ngăn cách bằng dấu ;)', loai: 'textarea', dong: 2 },
        { ten: 'bao_hanh', nhan: 'Bảo hành (ghi chung, không ghi số năm)' }
    ];
    let dsSanPham = [];

    function formSanPham(sp = {}) {
        return `<form class="ad-form" id="form-sp">
            ${oDaNgonNgu(TRUONG_SP, sp, { id: 'sp' })}
            <div class="ad-luoi-2">
                <label class="dl-o"><span>Nhóm *</span><select name="nhom">${Object.entries(NHOM).map(([k, v]) => `<option value="${k}" ${sp.nhom === k ? 'selected' : ''}>${v}</option>`).join('')}</select></label>
                <label class="dl-o"><span>Giá hiển thị</span><input type="text" name="gia" value="${m(sp.gia || 'Liên hệ')}"></label>
                <label class="dl-o"><span>Thứ tự</span><input type="number" name="thu_tu" value="${sp.thu_tu ?? 0}"></label>
                <label class="ad-hop-chon"><input type="checkbox" name="noi_bat" ${sp.noi_bat ? 'checked' : ''}> Nổi bật (hiện ở trang chủ)</label>
            </div>
            ${oChonAnh('hinh_anh', sp.hinh_anh, 'san-pham')}
        </form>`;
    }

    function moFormSanPham(sp) {
        moModal({
            tieuDe: sp ? `Sửa sản phẩm #${sp.id}` : 'Thêm sản phẩm',
            noiDung: formSanPham(sp || {}),
            nutLuu: sp ? 'Lưu thay đổi' : 'Thêm sản phẩm',
            khiLuu: async () => {
                const d = docForm($('form-sp'));
                if (!d.ten) { toast('Vui lòng nhập tên sản phẩm (tiếng Việt)', 'loi'); return false; }
                d.gia = d.gia || 'Liên hệ';
                d.thu_tu = d.thu_tu || 0;
                const { error } = sp ? await db.from('san_pham').update(d).eq('id', sp.id) : await db.from('san_pham').insert(d);
                if (error) { baoLoi(error, 'Lưu sản phẩm lỗi'); return false; }
                toast(sp ? 'Đã cập nhật sản phẩm' : 'Đã thêm sản phẩm');
                veLai();
            }
        });
    }

    dangKyTab({
        id: 'san-pham', ten: 'Sản phẩm', icon: '📦', thuTu: 2, demTong: true,
        dem: async () => (await db.from('san_pham').select('id', { count: 'exact', head: true })).count,
        ve: async (khung, dau) => {
            dau.innerHTML = '<input type="search" class="ad-tim" id="tim-sp" placeholder="Tìm tên..."><button type="button" class="btn-chinh" id="them-sp">+ Thêm sản phẩm</button>';
            const { data, error } = await db.from('san_pham').select('*').order('nhom').order('thu_tu');
            if (error) throw error;
            dsSanPham = data;
            const ve = (loc = '') => {
                const ds = dsSanPham.filter(sp => sp.ten.toLowerCase().includes(loc.toLowerCase()));
                khung.innerHTML = `<div class="ad-bang-khung"><table class="ad-bang">
                    <thead><tr><th>Ảnh</th><th>Tên</th><th>Nhóm</th><th>Bản dịch</th><th>Nổi bật</th><th>TT</th><th></th></tr></thead>
                    <tbody>${ds.map(sp => `<tr>
                        <td><img class="ad-anh-nho" src="${m(TieuNghia.anhAnToan(sp.hinh_anh, 'assets/images/logo.jpg'))}" alt=""></td>
                        <td><strong>${m(sp.ten)}</strong><br><small>${m(sp.mo_ta_ngan || '')}</small></td>
                        <td>${m(NHOM[sp.nhom] || sp.nhom)}</td>
                        <td>${sp.ten_en ? '🇬🇧' : '<span class="ad-mo">🇬🇧</span>'} ${sp.ten_zh ? '🇨🇳' : '<span class="ad-mo">🇨🇳</span>'}</td>
                        <td>${sp.noi_bat ? '⭐' : ''}</td><td>${sp.thu_tu}</td>
                        <td class="ad-hanh-dong"><button type="button" class="ad-nut" data-sua="${sp.id}">Sửa</button><button type="button" class="ad-nut ad-nut-xoa" data-xoa="${sp.id}">Xóa</button></td>
                    </tr>`).join('') || '<tr><td colspan="7">Chưa có sản phẩm</td></tr>'}</tbody></table></div>`;
            };
            ve();
            $('tim-sp').addEventListener('input', e => ve(e.target.value));
            $('them-sp').addEventListener('click', () => moFormSanPham(null));
            khung.onclick = async e => {
                const sua = e.target.closest('[data-sua]');
                if (sua) moFormSanPham(dsSanPham.find(sp => sp.id === Number(sua.dataset.sua)));
                const xoa = e.target.closest('[data-xoa]');
                if (xoa) {
                    const sp = dsSanPham.find(x => x.id === Number(xoa.dataset.xoa));
                    if (!(await xacNhan(`Xóa sản phẩm "${sp.ten}"? Không thể hoàn tác.`))) return;
                    const { error: loi } = await db.from('san_pham').delete().eq('id', sp.id);
                    if (loi) return baoLoi(loi, 'Xóa lỗi');
                    toast('Đã xóa sản phẩm');
                    veLai();
                }
            };
        }
    });

    // =========================================================
    // TAB YÊU CẦU BÁO GIÁ (UPDATE trạng thái / DELETE)
    // =========================================================
    function oTrangThai(bang, id, giaTri) {
        return `<select class="ad-chon-tt tt-${giaTri}" data-bang="${bang}" data-id="${id}">${Object.entries(TRANG_THAI_YC).map(([k, v]) => `<option value="${k}" ${k === giaTri ? 'selected' : ''}>${v}</option>`).join('')}</select>`;
    }
    async function doiTrangThai(e) {
        const sel = e.target.closest('.ad-chon-tt');
        if (!sel) return;
        const { error } = await db.from(sel.dataset.bang).update({ trang_thai: sel.value }).eq('id', sel.dataset.id);
        if (error) return baoLoi(error, 'Đổi trạng thái lỗi');
        sel.className = `ad-chon-tt tt-${sel.value}`;
        toast('Đã cập nhật trạng thái');
        capNhatDem();
    }

    dangKyTab({
        id: 'yeu-cau', ten: 'Yêu cầu báo giá', icon: '🧾', thuTu: 4,
        dem: async () => (await db.from('yeu_cau_bao_gia').select('id', { count: 'exact', head: true }).eq('trang_thai', 'moi')).count,
        ve: async khung => {
            const { data, error } = await db.from('yeu_cau_bao_gia').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            khung.innerHTML = data.length ? `<div class="ad-the-luoi">${data.map(yc => `
                <article class="ad-the-yc">
                    <header>${co(yc.ngon_ngu)} <strong>${m(yc.ho_ten)}</strong> <a href="tel:${m(yc.so_dien_thoai)}">${m(yc.so_dien_thoai)}</a>
                        <span class="ad-gian"></span>${oTrangThai('yeu_cau_bao_gia', yc.id, yc.trang_thai)}</header>
                    <div class="ad-yc-meta">🕒 ${ngayGio(yc.created_at)}${yc.email ? ' · ✉ ' + m(yc.email) : ''}${yc.dia_chi ? ' · 📍 ' + m(yc.dia_chi) : ''}</div>
                    <ul class="ad-ds-sp">${(yc.danh_sach || []).map(sp => `<li><img src="${m(TieuNghia.anhAnToan(sp.hinh_anh, 'assets/images/logo.jpg'))}" alt="">
                        <span><strong>${m(sp.ten_vi || sp.ten || '')}</strong> × ${m(sp.so_luong)}${sp.kich_thuoc ? ' · ' + m(sp.kich_thuoc) : ''}</span></li>`).join('')}</ul>
                    ${yc.ghi_chu ? `<p class="ad-ghi-chu">💬 ${m(yc.ghi_chu)}</p>` : ''}
                    <footer><button type="button" class="ad-nut ad-nut-xoa" data-xoa-yc="${yc.id}">Xóa</button></footer>
                </article>`).join('')}</div>` : '<div class="ad-dang-tai">Chưa có yêu cầu báo giá.</div>';
            khung.onchange = doiTrangThai;
            khung.onclick = async e => {
                const b = e.target.closest('[data-xoa-yc]');
                if (!b || !(await xacNhan('Xóa yêu cầu báo giá này?'))) return;
                const { error: loi } = await db.from('yeu_cau_bao_gia').delete().eq('id', b.dataset.xoaYc);
                if (loi) return baoLoi(loi, 'Xóa lỗi');
                toast('Đã xóa yêu cầu');
                veLai();
            };
        }
    });

    // =========================================================
    // TAB THIẾT KẾ NHÀ (UPDATE trạng thái / DELETE / Xem 3D)
    // =========================================================
    function linkXem3D(cauHinh) {
        const bytes = new TextEncoder().encode(JSON.stringify(cauHinh || {}));
        let s = '';
        bytes.forEach(b => { s += String.fromCharCode(b); });
        return 'thiet-ke-nha.html?tk=' + btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }
    dangKyTab({
        id: 'thiet-ke', ten: 'Thiết kế nhà', icon: '🏠', thuTu: 5,
        dem: async () => (await db.from('thiet_ke_nha').select('id', { count: 'exact', head: true }).eq('trang_thai', 'moi')).count,
        ve: async khung => {
            const { data, error } = await db.from('thiet_ke_nha').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            khung.innerHTML = data.length ? `<div class="ad-bang-khung"><table class="ad-bang">
                <thead><tr><th>Mã</th><th>Khách</th><th>Kích thước</th><th>Panel · mái</th><th>Diện tích</th><th>Ngày gửi</th><th>Trạng thái</th><th></th></tr></thead>
                <tbody>${data.map(tk => {
                    const c = tk.cau_hinh || {}, k = tk.ket_qua || {};
                    return `<tr>
                        <td><strong>${m(tk.ma_thiet_ke)}</strong></td>
                        <td>${co(tk.ngon_ngu)} ${m(tk.ho_ten)}<br><a href="tel:${m(tk.so_dien_thoai)}">${m(tk.so_dien_thoai)}</a>${tk.dia_chi ? '<br><small>📍 ' + m(tk.dia_chi) + '</small>' : ''}${tk.ghi_chu ? '<br><small>💬 ' + m(tk.ghi_chu) + '</small>' : ''}</td>
                        <td>${so(c.dai)} × ${so(c.rong)} × ${so(c.cao)} m<br><small>${m(c.cong_nang || '')}</small></td>
                        <td>${m(c.loai_panel || '')} ${m(c.do_day || '')}mm<br><small>${c.kieu_mai === '1-mai' ? '1 mái' : '2 mái'} · ${m(c.so_cua_di)} cửa đi · ${m(c.so_cua_so)} cửa sổ</small></td>
                        <td>Sàn ${so(k.dien_tich_san)} m²<br><small>Vách ${so(k.dien_tich_vach)} m² · ${so(k.so_tam_panel)} tấm</small></td>
                        <td>${ngayGio(tk.created_at)}</td>
                        <td>${oTrangThai('thiet_ke_nha', tk.id, tk.trang_thai)}</td>
                        <td class="ad-hanh-dong"><a class="ad-nut" href="${linkXem3D(tk.cau_hinh)}" target="_blank">Xem 3D</a><button type="button" class="ad-nut ad-nut-xoa" data-xoa-tk="${tk.id}">Xóa</button></td>
                    </tr>`;
                }).join('')}</tbody></table></div>` : '<div class="ad-dang-tai">Chưa có thiết kế nào.</div>';
            khung.onchange = doiTrangThai;
            khung.onclick = async e => {
                const b = e.target.closest('[data-xoa-tk]');
                if (!b || !(await xacNhan('Xóa thiết kế này?'))) return;
                const { error: loi } = await db.from('thiet_ke_nha').delete().eq('id', b.dataset.xoaTk);
                if (loi) return baoLoi(loi, 'Xóa lỗi');
                toast('Đã xóa thiết kế');
                veLai();
            };
        }
    });

    return {
        khoiDong, dangKyTab, moModal, dongModal, xacNhan, oDaNgonNgu, docForm, oChonAnh, taiAnhLen, capNhatCham,
        veLai, capNhatDem, moTab, toast, baoLoi, m, ngay, ngayGio, co, so, NHOM, ANH_CO_SAN
    };
})();
