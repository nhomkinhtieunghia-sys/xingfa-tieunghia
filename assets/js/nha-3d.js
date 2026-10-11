// Mô hình nhà lắp ráp panel 3D – Three.js 0.160.0 + OrbitControls
// Đơn vị: 1 = 1 mét. Trục x = chiều dài, z = chiều rộng (mặt trước là +z), y = chiều cao.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const MAU_VACH = { 'trang-kem': '#F2EFE6', 'xam-ghi': '#9AA3AD', 'xanh-ngoc': '#2C7A7B', 'van-go': '#A0703C' };
const MAU_MAI = { 'do-do': '#8B1E1E', 'xanh-duong': '#1F4E8C', 'xam-ghi': '#6B7280', 'trang': '#E5E7EB' };
const CAO_SAN = 0.15;      // sàn bê tông
const MAI_DUA = 0.3;       // mái đua ra mỗi bên
const DOC = { '1-mai': 10, '2-mai': 15 };

let renderer, scene, camera, controls, khung;
let nhom = null;           // THREE.Group chứa ngôi nhà
let nenCo, matBong;        // nền cỏ + mặt hứng bóng (dùng khi chụp nền trong suốt)
let den;                   // đèn chiếu có bóng đổ
let cauHinh = null;
let kichThuocNha = 10;

// ---------- Tiện ích vẽ texture bằng canvas ----------
function chinhSang(hex, heSo) {
    const c = new THREE.Color(hex);
    c.offsetHSL(0, 0, heSo);
    return '#' + c.getHexString();
}

function textureVach(mau) {
    const cv = document.createElement('canvas');
    cv.width = 128; cv.height = 256;
    const g = cv.getContext('2d');
    if (mau === 'van-go') {
        g.fillStyle = '#A8763F';
        g.fillRect(0, 0, 128, 256);
        for (let i = 0; i < 70; i++) {
            const x = Math.random() * 128;
            g.strokeStyle = `rgba(${90 + Math.random() * 40},${50 + Math.random() * 25},${20 + Math.random() * 15},${0.25 + Math.random() * 0.35})`;
            g.lineWidth = 0.6 + Math.random() * 1.8;
            g.beginPath();
            g.moveTo(x, 0);
            for (let y = 0; y <= 256; y += 16) g.lineTo(x + Math.sin(y / 30 + i) * 2.5, y);
            g.stroke();
        }
        // ván ghép ngang mỗi 1/2 tấm
        g.fillStyle = 'rgba(60,35,15,.35)';
        g.fillRect(64, 0, 1.5, 256);
    } else {
        g.fillStyle = MAU_VACH[mau] || MAU_VACH['trang-kem'];
        g.fillRect(0, 0, 128, 256);
        // gân sóng nhẹ của tôn mặt panel
        g.fillStyle = 'rgba(0,0,0,.035)';
        for (let x = 16; x < 128; x += 32) g.fillRect(x, 0, 6, 256);
    }
    // đường ron ghép tấm panel (mép trái mỗi tấm 1 m)
    g.fillStyle = mau === 'van-go' ? 'rgba(40,22,8,.75)' : chinhSang(MAU_VACH[mau] || '#F2EFE6', -0.28);
    g.fillRect(0, 0, 3, 256);
    const tx = new THREE.CanvasTexture(cv);
    tx.colorSpace = THREE.SRGBColorSpace;
    tx.wrapS = tx.wrapT = THREE.RepeatWrapping;
    tx.anisotropy = 4;
    return tx;
}

function textureMai(mau) {
    const cv = document.createElement('canvas');
    cv.width = 64; cv.height = 8;
    const g = cv.getContext('2d');
    const goc = MAU_MAI[mau] || MAU_MAI['do-do'];
    const grad = g.createLinearGradient(0, 0, 64, 0);
    grad.addColorStop(0, chinhSang(goc, -0.12));
    grad.addColorStop(0.25, chinhSang(goc, 0.10));
    grad.addColorStop(0.5, chinhSang(goc, -0.12));
    grad.addColorStop(0.75, chinhSang(goc, -0.04));
    grad.addColorStop(1, chinhSang(goc, -0.12));
    g.fillStyle = grad;
    g.fillRect(0, 0, 64, 8);
    const tx = new THREE.CanvasTexture(cv);
    tx.colorSpace = THREE.SRGBColorSpace;
    tx.wrapS = tx.wrapT = THREE.RepeatWrapping;
    return tx;
}

// ---------- Dọn bộ nhớ ----------
function donNhom(g) {
    g.traverse(o => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) {
            (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => {
                if (m.map) m.map.dispose();
                m.dispose();
            });
        }
    });
}

function hop(w, h, d, vatLieu) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), vatLieu);
    m.castShadow = true;
    m.receiveShadow = true;
    return m;
}

// ---------- Cửa đi / cửa sổ ----------
function taoCuaDi(loai, vlVach) {
    const g = new THREE.Group();
    const vlKhung = new THREE.MeshStandardMaterial({ color: 0x4B5563, metalness: 0.5, roughness: 0.4 });
    const khungCua = hop(1.0, 2.25, 0.08, vlKhung);
    khungCua.position.y = 2.25 / 2;
    g.add(khungCua);
    if (loai === 'nhom-xingfa') {
        const vlKinh = new THREE.MeshStandardMaterial({ color: 0x9EC9E6, transparent: true, opacity: 0.7, metalness: 0.2, roughness: 0.05 });
        [-0.205, 0.205].forEach(x => {
            const kinh = hop(0.37, 2.05, 0.02, vlKinh);
            kinh.position.set(x, 1.1, 0.04);
            g.add(kinh);
        });
        const tay = hop(0.03, 0.25, 0.04, new THREE.MeshStandardMaterial({ color: 0xD1D5DB, metalness: 0.8, roughness: 0.3 }));
        tay.position.set(0.05, 1.05, 0.07);
        g.add(tay);
    } else {
        const canh = hop(0.86, 2.1, 0.02, new THREE.MeshStandardMaterial({ color: chinhSang(vlVach.userData.mau, -0.1), roughness: 0.6, metalness: 0.1 }));
        canh.position.set(0, 1.08, 0.045);
        g.add(canh);
        const tay = hop(0.12, 0.03, 0.04, new THREE.MeshStandardMaterial({ color: 0x374151, metalness: 0.7 }));
        tay.position.set(0.3, 1.05, 0.07);
        g.add(tay);
    }
    return g;
}

function taoCuaSo() {
    const g = new THREE.Group();
    const vlKhung = new THREE.MeshStandardMaterial({ color: 0x4B5563, metalness: 0.5, roughness: 0.4 });
    const vlKinh = new THREE.MeshStandardMaterial({ color: 0x9EC9E6, transparent: true, opacity: 0.65, metalness: 0.2, roughness: 0.05 });
    const khungNgoai = hop(1.28, 1.28, 0.08, vlKhung);
    g.add(khungNgoai);
    const kinh = hop(1.14, 1.14, 0.02, vlKinh);
    kinh.position.z = 0.04;
    g.add(kinh);
    const doc = hop(0.04, 1.14, 0.03, vlKhung);
    doc.position.z = 0.05;
    g.add(doc);
    const bauCua = hop(1.36, 0.05, 0.14, new THREE.MeshStandardMaterial({ color: 0xD1D5DB }));
    bauCua.position.set(0, -0.66, 0.04);
    g.add(bauCua);
    g.position.y = CAO_SAN + 0.9 + 0.6;
    return g;
}

// Chia đều các vật (cửa) trên 1 bức tường dài L. Trả về toạ độ tâm.
function chiaDeu(soLuong, L) {
    const arr = [];
    for (let i = 0; i < soLuong; i++) arr.push(-L / 2 + L * (i + 1) / (soLuong + 1));
    return arr;
}

// ---------- Dựng ngôi nhà ----------
function dungNha(c) {
    const g = new THREE.Group();
    const dai = c.dai, rong = c.rong, cao = c.cao;
    const day = Math.max(0.05, c.do_day / 1000);
    const doc = THREE.MathUtils.degToRad(DOC[c.kieu_mai] || 15);
    const yDinhTuong = CAO_SAN + cao;

    // Sàn bê tông
    const san = hop(dai + 0.3, CAO_SAN, rong + 0.3, new THREE.MeshStandardMaterial({ color: 0xA3A3A3, roughness: 0.9 }));
    san.position.y = CAO_SAN / 2;
    g.add(san);

    // Vật liệu vách (texture lặp theo khổ 1 m)
    const taoVlVach = (lapX, lapY) => {
        const tx = textureVach(c.mau_vach);
        tx.repeat.set(lapX, lapY);
        const vl = new THREE.MeshStandardMaterial({ map: tx, roughness: c.mau_vach === 'van-go' ? 0.75 : 0.55, metalness: c.mau_vach === 'van-go' ? 0 : 0.15 });
        vl.userData.mau = MAU_VACH[c.mau_vach] || '#F2EFE6';
        return vl;
    };
    const vlTruoc = taoVlVach(dai, 1);
    const vlBen = taoVlVach(rong, 1);

    // 4 bức vách
    const truoc = hop(dai, cao, day, vlTruoc);
    truoc.position.set(0, CAO_SAN + cao / 2, rong / 2 - day / 2);
    const sau = hop(dai, cao, day, vlTruoc);
    sau.position.set(0, CAO_SAN + cao / 2, -rong / 2 + day / 2);
    const trai = hop(day, cao, rong - 2 * day, vlBen);
    trai.position.set(-dai / 2 + day / 2, CAO_SAN + cao / 2, 0);
    const phai = trai.clone();
    phai.position.x = dai / 2 - day / 2;
    g.add(truoc, sau, trai, phai);

    // Đầu hồi + mái
    const txMai = textureMai(c.mau_mai);
    const vlMai = new THREE.MeshStandardMaterial({ map: txMai, metalness: 0.35, roughness: 0.45 });
    const vlDiem = new THREE.MeshStandardMaterial({ color: chinhSang(MAU_MAI[c.mau_mai] || '#8B1E1E', -0.12), metalness: 0.3, roughness: 0.5 });
    const daiMai = dai + 2 * MAI_DUA;
    txMai.repeat.set(daiMai / 0.25, 1);
    const dayMai = 0.05;

    const themDauHoi = (diem) => {
        const hinh = new THREE.Shape();
        hinh.moveTo(diem[0][0], diem[0][1]);
        diem.slice(1).forEach(p => hinh.lineTo(p[0], p[1]));
        hinh.closePath();
        const geo = new THREE.ExtrudeGeometry(hinh, { depth: day, bevelEnabled: false });
        // UV của ExtrudeGeometry tính theo toạ độ thật (m) → texture lặp đúng khổ 1 m
        const tx = textureVach(c.mau_vach);
        tx.repeat.set(1, 1 / cao);
        const vl = new THREE.MeshStandardMaterial({ map: tx, roughness: 0.6, metalness: c.mau_vach === 'van-go' ? 0 : 0.15 });
        [-1, 1].forEach(ben => {
            const m = new THREE.Mesh(geo, vl);
            m.rotation.y = Math.PI / 2;
            m.position.set(ben * (dai / 2) - (ben > 0 ? day : 0), yDinhTuong, 0);
            m.castShadow = m.receiveShadow = true;
            g.add(m);
        });
    };

    if (c.kieu_mai === '1-mai') {
        const h = rong * Math.tan(doc);
        // tam giác vuông: cao ở phía sau (z = -rong/2), thấp ở phía trước
        themDauHoi([[rong / 2, 0], [-rong / 2, 0], [rong / 2, h]]);
        // dải vách nâng phía sau cho kín mái
        const dai2 = hop(dai, h, day, taoVlVach(dai, h / cao));
        dai2.position.set(0, yDinhTuong + h / 2, -rong / 2 + day / 2);
        g.add(dai2);
        const beRong = (rong + 2 * MAI_DUA) / Math.cos(doc);
        const tam = hop(daiMai, dayMai, beRong, vlMai);
        tam.rotation.x = doc;
        tam.position.set(0, yDinhTuong + h / 2 + dayMai, 0);
        g.add(tam);
        // diềm mái 2 đầu thấp/cao
        [[1, -MAI_DUA * Math.tan(doc)], [-1, h + MAI_DUA * Math.tan(doc)]].forEach(([ben, dy]) => {
            const diem = hop(daiMai, 0.14, 0.04, vlDiem);
            diem.position.set(0, yDinhTuong + dy - 0.03, ben * (rong / 2 + MAI_DUA));
            g.add(diem);
        });
    } else {
        const h = (rong / 2) * Math.tan(doc);
        themDauHoi([[rong / 2, 0], [-rong / 2, 0], [0, h]]);
        const beRong = (rong / 2 + MAI_DUA) / Math.cos(doc);
        [-1, 1].forEach(ben => {
            const tam = hop(daiMai, dayMai, beRong, vlMai);
            tam.rotation.x = ben * doc;
            const zGiua = ben * (rong / 2 + MAI_DUA) / 2;
            const yGiua = yDinhTuong + h - ((rong / 2 + MAI_DUA) / 2) * Math.tan(doc);
            tam.position.set(0, yGiua + dayMai, zGiua);
            g.add(tam);
            const diem = hop(daiMai, 0.14, 0.04, vlDiem);
            diem.position.set(0, yDinhTuong - MAI_DUA * Math.tan(doc) - 0.03, ben * (rong / 2 + MAI_DUA));
            g.add(diem);
        });
        // úp nóc
        const noc = hop(daiMai, 0.08, 0.3, vlDiem);
        noc.position.set(0, yDinhTuong + h + 0.06, 0);
        g.add(noc);
    }

    // Cửa đi + cửa sổ
    const soCuaDi = c.so_cua_di, soCuaSo = c.so_cua_so;
    const sucChuaBen = Math.max(0, Math.floor((rong - 0.8) / 1.8));
    let soBen = Math.min(2 * sucChuaBen, Math.floor(soCuaSo / 2));
    let soTruocCuaSo = soCuaSo - soBen;
    let soSau = 0;
    const sucChuaTruoc = Math.max(1, Math.floor((dai - 0.4) / 1.5));
    if (soCuaDi + soTruocCuaSo > sucChuaTruoc) {
        soSau = Math.min(soTruocCuaSo, soCuaDi + soTruocCuaSo - sucChuaTruoc);
        soTruocCuaSo -= soSau;
    }
    // mặt trước: xen kẽ cửa đi giữa các cửa sổ
    const tong = soCuaDi + soTruocCuaSo;
    const viTri = chiaDeu(tong, dai);
    const laCuaDi = new Array(tong).fill(false);
    for (let i = 0; i < soCuaDi; i++) laCuaDi[Math.round((i + 0.5) * tong / soCuaDi - 0.5)] = true;
    viTri.forEach((x, i) => {
        const m = laCuaDi[i] ? taoCuaDi(c.loai_cua, vlTruoc) : taoCuaSo();
        if (laCuaDi[i]) m.position.y = CAO_SAN;
        m.position.x = x;
        m.position.z = rong / 2 + 0.005;
        g.add(m);
    });
    // mặt sau
    chiaDeu(soSau, dai).forEach(x => {
        const m = taoCuaSo();
        m.position.set(x, m.position.y, -rong / 2 - 0.005);
        m.rotation.y = Math.PI;
        g.add(m);
    });
    // 2 mặt bên
    const soTrai = Math.ceil(soBen / 2), soPhai = Math.floor(soBen / 2);
    chiaDeu(soTrai, rong).forEach(z => {
        const m = taoCuaSo();
        m.position.set(-dai / 2 - 0.005, m.position.y, z);
        m.rotation.y = -Math.PI / 2;
        g.add(m);
    });
    chiaDeu(soPhai, rong).forEach(z => {
        const m = taoCuaSo();
        m.position.set(dai / 2 + 0.005, m.position.y, z);
        m.rotation.y = Math.PI / 2;
        g.add(m);
    });
    return g;
}

// ---------- Camera ----------
function dieuChinhCamera(c) {
    kichThuocNha = Math.max(c.dai, c.rong, c.cao * 2.2);
    controls.target.set(0, (CAO_SAN + c.cao) / 2 + 0.3, 0);
    controls.minDistance = kichThuocNha * 0.6;
    controls.maxDistance = kichThuocNha * 4;
    const r = Math.max(c.dai, c.rong) * 1.2 + 6;
    nenCo.scale.setScalar(r);
    matBong.scale.setScalar(r);
    const bong = den.shadow.camera;
    const s = kichThuocNha * 0.9 + 2;
    bong.left = -s; bong.right = s; bong.top = s; bong.bottom = -s;
    bong.far = kichThuocNha * 6;
    bong.updateProjectionMatrix();
    den.position.set(kichThuocNha * 0.8, kichThuocNha * 1.5, kichThuocNha * 1.1);
}

export function datGocNhin(goc) {
    if (!camera) return;
    // màn hình dọc (điện thoại) cần lùi camera xa hơn để thấy trọn ngôi nhà
    const heSoDoc = camera.aspect < 1.25 ? Math.min(2.3, 1.25 / camera.aspect) : 1;
    const d = kichThuocNha * 1.55 * heSoDoc;
    const tg = controls.target;
    const vt = {
        truoc: [0, tg.y + d * 0.18, d],
        ben: [d, tg.y + d * 0.18, 0],
        tren: [0.001, d * 1.25, 0.001],
        goc: [d * 0.72, tg.y + d * 0.42, d * 0.78]
    }[goc] || [d * 0.72, tg.y + d * 0.42, d * 0.78];
    camera.position.set(...vt);
    controls.update();
}

// ---------- API ----------
export function hoTroWebGL() {
    try {
        const cv = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && (cv.getContext('webgl2') || cv.getContext('webgl')));
    } catch (e) {
        return false;
    }
}

export function khoiTao(phanTu) {
    khung = phanTu;
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0x000000, 0);
    khung.appendChild(renderer.domElement);

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(40, 4 / 3, 0.1, 500);
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.maxPolarAngle = Math.PI / 2 - 0.03;
    controls.autoRotateSpeed = 1.2;

    scene.add(new THREE.HemisphereLight(0xffffff, 0x9bb58a, 1.4));
    den = new THREE.DirectionalLight(0xffffff, 2.2);
    den.castShadow = true;
    den.shadow.mapSize.set(2048, 2048);
    den.shadow.radius = 4;
    den.shadow.bias = -0.0005;
    scene.add(den);

    nenCo = new THREE.Mesh(new THREE.CircleGeometry(1, 64), new THREE.MeshStandardMaterial({ color: 0xCFE3C0, roughness: 1 }));
    nenCo.rotation.x = -Math.PI / 2;
    nenCo.receiveShadow = true;
    scene.add(nenCo);
    matBong = new THREE.Mesh(new THREE.CircleGeometry(1, 64), new THREE.ShadowMaterial({ opacity: 0.25 }));
    matBong.rotation.x = -Math.PI / 2;
    matBong.position.y = 0.002;
    matBong.receiveShadow = true;
    matBong.visible = false;
    scene.add(matBong);

    const doiCo = () => {
        const w = khung.clientWidth, h = khung.clientHeight;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    };
    renderer.setSize(800, 600, false);
    new ResizeObserver(doiCo).observe(khung);
    doiCo();

    const vongLap = () => {
        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(vongLap);
    };
    vongLap();
    // Người dùng tự kéo xoay → tắt tự xoay
    controls.addEventListener('start', () => {
        if (controls.autoRotate) {
            controls.autoRotate = false;
            khung.dispatchEvent(new CustomEvent('tat-tu-xoay', { bubbles: true }));
        }
    });
}

export function capNhat(c) {
    const lanDau = !cauHinh;
    const doiKichThuoc = !cauHinh || cauHinh.dai !== c.dai || cauHinh.rong !== c.rong || cauHinh.cao !== c.cao;
    cauHinh = { ...c };
    if (nhom) {
        scene.remove(nhom);
        donNhom(nhom);
    }
    nhom = dungNha(c);
    scene.add(nhom);
    if (doiKichThuoc) {
        dieuChinhCamera(c);
        if (lanDau) datGocNhin('goc');
    }
    // hiệu ứng "mọc" nhẹ khi dựng lại
    nhom.scale.set(1, 0.96, 1);
    const batDau = performance.now();
    const moc = (tg) => {
        const p = Math.min(1, (tg - batDau) / 220);
        nhom.scale.y = 0.96 + 0.04 * (1 - Math.pow(1 - p, 3));
        if (p < 1) requestAnimationFrame(moc);
    };
    requestAnimationFrame(moc);
}

export function batTuXoay(bat) {
    if (controls) controls.autoRotate = !!bat;
}

// Chụp ảnh mô hình. nenTrongSuot: bỏ nền cỏ, giữ bóng đổ → dùng ghép lên ảnh đất.
export function chupAnh({ nenTrongSuot = false } = {}) {
    if (!renderer) return null;
    if (nhom) nhom.scale.y = 1;
    const tiLeCu = renderer.getPixelRatio();
    renderer.setPixelRatio(2);
    if (nenTrongSuot) {
        nenCo.visible = false;
        matBong.visible = true;
    }
    renderer.render(scene, camera);
    let url;
    if (nenTrongSuot) {
        url = renderer.domElement.toDataURL('image/png');
        nenCo.visible = true;
        matBong.visible = false;
    } else {
        // ghép nền trời xanh nhạt phía sau
        const cv = document.createElement('canvas');
        cv.width = renderer.domElement.width;
        cv.height = renderer.domElement.height;
        const g = cv.getContext('2d');
        const grad = g.createLinearGradient(0, 0, 0, cv.height);
        grad.addColorStop(0, '#CFE6FA');
        grad.addColorStop(1, '#FFFFFF');
        g.fillStyle = grad;
        g.fillRect(0, 0, cv.width, cv.height);
        g.drawImage(renderer.domElement, 0, 0);
        url = cv.toDataURL('image/png');
    }
    renderer.setPixelRatio(tiLeCu);
    const w = khung.clientWidth, h = khung.clientHeight;
    if (w && h) renderer.setSize(w, h, false);
    renderer.render(scene, camera);
    return url;
}
