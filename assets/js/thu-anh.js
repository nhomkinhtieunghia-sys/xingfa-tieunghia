// Tab "Thử lên ảnh đất nhà bạn": ghép ảnh ngôi nhà 3D (nền trong suốt) lên ảnh khu đất của khách.
// Ảnh chỉ xử lý trên máy (FileReader + canvas), không tải lên mạng.
(function () {
    const $ = id => document.getElementById(id);
    // Vị trí tâm ngôi nhà (tỉ lệ 0..1 theo khung ảnh), độ rộng nhà (% bề rộng ảnh), lật ngang
    const trangThai = { x: 0.5, y: 0.62, co: 45, lat: false, coAnhDat: false, coAnhNha: false, cauHinhDaChup: '' };
    let tiLeNha = 1; // cao / rộng của ảnh nhà sau khi cắt

    // Cắt bỏ phần trong suốt xung quanh ảnh nhà để kéo / co giãn cho chuẩn
    function catVienTrong(dataUrl) {
        return new Promise(resolve => {
            const img = new Image();
            img.onload = () => {
                const cv = document.createElement('canvas');
                cv.width = img.width;
                cv.height = img.height;
                const g = cv.getContext('2d');
                g.drawImage(img, 0, 0);
                const { data, width, height } = g.getImageData(0, 0, cv.width, cv.height);
                let x0 = width, y0 = height, x1 = -1, y1 = -1;
                for (let y = 0; y < height; y += 2) {
                    for (let x = 0; x < width; x += 2) {
                        if (data[(y * width + x) * 4 + 3] > 8) {
                            if (x < x0) x0 = x;
                            if (x > x1) x1 = x;
                            if (y < y0) y0 = y;
                            if (y > y1) y1 = y;
                        }
                    }
                }
                if (x1 < 0) { resolve({ url: dataUrl, tiLe: img.height / img.width }); return; }
                const w = x1 - x0 + 2, h = y1 - y0 + 2;
                const ra = document.createElement('canvas');
                ra.width = w;
                ra.height = h;
                ra.getContext('2d').drawImage(cv, x0, y0, w, h, 0, 0, w, h);
                resolve({ url: ra.toDataURL('image/png'), tiLe: h / w });
            };
            img.src = dataUrl;
        });
    }

    async function chupNha() {
        if (!window.ThietKe3D || !window.ThietKe3D.sanSang()) return false;
        const goc = window.ThietKe3D.chupAnh({ nenTrongSuot: true });
        if (!goc) return false;
        const { url, tiLe } = await catVienTrong(goc);
        tiLeNha = tiLe;
        $('anh-nha').src = url;
        trangThai.coAnhNha = true;
        trangThai.cauHinhDaChup = JSON.stringify(window.ThietKe3D.layCauHinh());
        veViTri();
        return true;
    }

    function veViTri() {
        const nha = $('anh-nha');
        nha.style.left = (trangThai.x * 100) + '%';
        nha.style.top = (trangThai.y * 100) + '%';
        nha.style.width = trangThai.co + '%';
        nha.style.transform = `translate(-50%, -50%) scaleX(${trangThai.lat ? -1 : 1})`;
    }

    function hienAnhDat(file) {
        if (!file || !/^image\/(jpeg|png)$/.test(file.type)) {
            TieuNghia.toast(t('thietKe.loiAnh'), 'loi');
            return;
        }
        const doc = new FileReader();
        doc.onload = async () => {
            const anh = $('anh-dat');
            anh.onload = async () => {
                $('san-khau-anh').style.aspectRatio = `${anh.naturalWidth} / ${anh.naturalHeight}`;
                $('vung-tha-anh').hidden = true;
                $('san-khau-anh').hidden = false;
                $('dieu-khien-anh').hidden = false;
                $('meo-keo').hidden = false;
                trangThai.coAnhDat = true;
                if (!(await chupNha())) TieuNghia.toast(t('thietKe.khongCo3D'), 'loi');
            };
            anh.src = doc.result;
        };
        doc.readAsDataURL(file);
    }

    // Kéo thả ngôi nhà bằng chuột / ngón tay
    function ganKeoNha() {
        const nha = $('anh-nha');
        const sanKhau = $('san-khau-anh');
        let dangKeo = null;
        nha.addEventListener('pointerdown', e => {
            e.preventDefault();
            nha.setPointerCapture(e.pointerId);
            const r = sanKhau.getBoundingClientRect();
            dangKeo = { dx: e.clientX - (r.left + trangThai.x * r.width), dy: e.clientY - (r.top + trangThai.y * r.height) };
            nha.classList.add('dang-keo');
        });
        nha.addEventListener('pointermove', e => {
            if (!dangKeo) return;
            const r = sanKhau.getBoundingClientRect();
            trangThai.x = Math.min(1, Math.max(0, (e.clientX - dangKeo.dx - r.left) / r.width));
            trangThai.y = Math.min(1, Math.max(0, (e.clientY - dangKeo.dy - r.top) / r.height));
            veViTri();
        });
        const tha = () => { dangKeo = null; nha.classList.remove('dang-keo'); };
        nha.addEventListener('pointerup', tha);
        nha.addEventListener('pointercancel', tha);
    }

    function luuAnhGhep() {
        const anhDat = $('anh-dat');
        const anhNha = $('anh-nha');
        const W = anhDat.naturalWidth, H = anhDat.naturalHeight;
        // giới hạn 3000px cạnh dài để file không quá nặng
        const tl = Math.min(1, 3000 / Math.max(W, H));
        const cv = document.createElement('canvas');
        cv.width = Math.round(W * tl);
        cv.height = Math.round(H * tl);
        const g = cv.getContext('2d');
        g.drawImage(anhDat, 0, 0, cv.width, cv.height);
        const w = cv.width * trangThai.co / 100;
        const h = w * tiLeNha;
        g.save();
        g.translate(trangThai.x * cv.width, trangThai.y * cv.height);
        if (trangThai.lat) g.scale(-1, 1);
        g.drawImage(anhNha, -w / 2, -h / 2, w, h);
        g.restore();
        // dấu nhỏ góc dưới
        const co = Math.max(14, Math.round(cv.width / 60));
        g.font = `600 ${co}px "Be Vietnam Pro", sans-serif`;
        g.fillStyle = 'rgba(255,255,255,.85)';
        g.shadowColor = 'rgba(0,0,0,.6)';
        g.shadowBlur = 4;
        g.textAlign = 'right';
        g.fillText('Xingfa Tiếu Nghĩa · 0976 224 875', cv.width - co, cv.height - co);
        const a = document.createElement('a');
        a.href = cv.toDataURL('image/jpeg', 0.9);
        a.download = 'thiet-ke-tieu-nghia.jpg';
        document.body.appendChild(a);
        a.click();
        a.remove();
        TieuNghia.toast(t('thietKe.daLuuAnh'), 'thanh-cong');
    }

    function khoiDong() {
        const vung = $('vung-tha-anh');
        $('chon-anh-dat').addEventListener('change', e => hienAnhDat(e.target.files[0]));
        ['dragenter', 'dragover'].forEach(ev => vung.addEventListener(ev, e => { e.preventDefault(); vung.classList.add('dang-tha'); }));
        ['dragleave', 'drop'].forEach(ev => vung.addEventListener(ev, e => { e.preventDefault(); vung.classList.remove('dang-tha'); }));
        vung.addEventListener('drop', e => hienAnhDat(e.dataTransfer.files[0]));

        ganKeoNha();
        $('co-nha').addEventListener('input', e => { trangThai.co = Number(e.target.value); veViTri(); });
        $('nut-lat').addEventListener('click', () => { trangThai.lat = !trangThai.lat; veViTri(); });
        $('nut-doi-anh').addEventListener('click', () => $('chon-anh-dat').click());
        $('nut-luu-ghep').addEventListener('click', luuAnhGhep);

        // Chụp lại góc nhìn: sang tab 3D, khách xoay xong bấm nút nổi để quay lại
        $('nut-chup-lai').addEventListener('click', () => {
            $('nut-dung-goc').hidden = false;
            window.ThietKe3D.moTab('3d');
            TieuNghia.toast(t('thietKe.huongDanChupLai'), 'info');
        });
        $('nut-dung-goc').addEventListener('click', async () => {
            $('nut-dung-goc').hidden = true;
            await chupNha();
            window.ThietKe3D.moTab('anh');
        });

        // Vào lại tab ảnh mà thiết kế đã đổi → tự chụp lại
        document.addEventListener('tk-doi-tab', e => {
            if (e.detail !== '3d') $('nut-dung-goc').hidden = true;
            if (e.detail === 'anh' && trangThai.coAnhDat && window.ThietKe3D &&
                JSON.stringify(window.ThietKe3D.layCauHinh()) !== trangThai.cauHinhDaChup) {
                chupNha();
            }
        });
        veViTri();
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', khoiDong);
    else khoiDong();
})();
