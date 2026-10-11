-- =====================================================================
-- seed.sql – Dữ liệu mẫu: 15 sản phẩm, 10 công trình minh họa, 3 đánh giá thật + bản dịch Anh/Trung
-- Chạy SAU schema.sql, CHỈ CHẠY 1 LẦN (chạy lại sẽ bị trùng dữ liệu).
-- Giá luôn để "Liên hệ" (giống website thật).
-- =====================================================================

-- ===================== 1. SẢN PHẨM =====================
insert into san_pham (ten, nhom, mo_ta_ngan, mo_ta_chi_tiet, vat_lieu, uu_diem, hinh_anh, noi_bat, thu_tu) values

-- ===== Cửa sắt – Cổng – Lan can =====
('Cổng sắt mỹ thuật', 'cua-sat',
 'Cổng sắt hoa văn mỹ thuật, gia công theo kích thước và mẫu khách chọn.',
 'Cổng sắt mỹ thuật được thiết kế theo yêu cầu, phù hợp nhà phố, nhà vườn và biệt thự. Khung chắc chắn, hoa văn sắc nét, sơn tĩnh điện chống gỉ, giữ màu bền lâu dưới nắng mưa Tây Ninh.',
 'Sắt hộp, sắt đặc, sơn tĩnh điện',
 'Chắc chắn, an toàn;Hoa văn theo yêu cầu;Sơn tĩnh điện chống gỉ;Bền màu ngoài trời',
 'assets/images/cua-sat.jpg', true, 1),

('Cửa sắt – cửa rào', 'cua-sat',
 'Cửa sắt, cửa rào, cửa kéo cho nhà ở, cửa hàng, nhà xưởng.',
 'Gia công cửa sắt một cánh, hai cánh, cửa rào và cửa kéo theo đúng kích thước thực tế công trình. Thợ khảo sát tận nơi, lắp đặt gọn gàng, đảm bảo an ninh cho ngôi nhà.',
 'Sắt hộp mạ kẽm, sơn chống gỉ',
 'Đo đạc tận nơi;Nhiều kiểu dáng;Giá hợp lý;Lắp đặt nhanh',
 'assets/images/cua-sat.jpg', false, 2),

('Lan can – cầu thang sắt', 'cua-sat',
 'Lan can ban công, cầu thang sắt chắc chắn, an toàn, hiện đại.',
 'Thi công lan can ban công, lan can cầu thang, cầu thang sắt cho nhà ở và nhà xưởng. Kết cấu vững chắc, mối hàn kỹ, có thể kết hợp tay vịn gỗ hoặc kính cường lực.',
 'Sắt hộp, sắt đặc, có thể kết hợp kính cường lực',
 'An toàn cho gia đình;Thiết kế hiện đại;Mối hàn chắc chắn;Kết hợp kính hoặc gỗ',
 'assets/images/cua-sat.jpg', false, 3),

-- ===== Cửa nhôm Xingfa =====
('Cửa đi nhôm Xingfa 4 cánh', 'cua-nhom',
 'Cửa chính 4 cánh nhôm Xingfa cao cấp, sang trọng cho mặt tiền.',
 'Cửa đi 4 cánh nhôm Xingfa kết hợp kính an toàn, phù hợp cửa chính nhà phố và biệt thự. Hệ nhôm dày, phụ kiện đồng bộ, đóng mở êm, cách âm cách nhiệt tốt. Có cả nhôm Xingfa nhập khẩu và Xingfa Việt Nam để khách lựa chọn.',
 'Nhôm Xingfa (nhập khẩu hoặc Việt Nam), kính an toàn, phụ kiện đồng bộ',
 'Sang trọng, hiện đại;Cách âm, cách nhiệt;Không cong vênh, mối mọt;Nhiều màu sắc',
 'assets/images/cua-nhom-4-canh.jpg', true, 4),

('Cửa sổ nhôm Xingfa', 'cua-nhom',
 'Cửa sổ mở quay, mở hất, cửa lùa nhôm Xingfa kín khít.',
 'Cửa sổ nhôm Xingfa với nhiều kiểu mở: mở quay, mở hất, mở trượt. Gioăng kín khít chống bụi, chống nước mưa tạt, lấy sáng tốt cho phòng ngủ và phòng khách.',
 'Nhôm Xingfa, kính an toàn, gioăng EPDM',
 'Kín khít chống nước;Lấy sáng tự nhiên;Nhiều kiểu mở;Dễ vệ sinh',
 'assets/images/cua-nhom-xingfa.jpg', false, 5),

('Vách kính – cửa kính cường lực', 'cua-nhom',
 'Vách ngăn, cửa kính cường lực khung nhôm cho văn phòng, cửa hàng.',
 'Thi công vách kính, cửa kính cường lực kết hợp khung nhôm cho mặt tiền cửa hàng, showroom, văn phòng và vách tắm. Không gian thoáng, hiện đại, an toàn khi sử dụng.',
 'Kính cường lực, khung nhôm Xingfa, phụ kiện inox',
 'Không gian thoáng sáng;An toàn khi va đập;Hiện đại, sang trọng;Thi công nhanh',
 'assets/images/cua-nhom-xingfa.jpg', false, 6),

-- ===== Nhà lắp ráp panel =====
('Nhà lắp ráp panel EPS', 'nha-panel',
 'Nhà panel EPS nhẹ, thi công nhanh, tiết kiệm chi phí.',
 'Nhà lắp ráp panel EPS phù hợp nhà ở tạm, nhà trọ, văn phòng công trường, nhà kho nhỏ. Tấm panel nhẹ, cách nhiệt tốt, lắp dựng nhanh, có thể tháo dời khi cần.',
 'Tấm panel EPS, khung thép',
 'Thi công nhanh;Chi phí tiết kiệm;Cách nhiệt tốt;Tháo dời được',
 'assets/images/nha-panel-dan-dung.jpg', true, 7),

('Nhà lắp ráp panel PU', 'nha-panel',
 'Nhà panel PU cách nhiệt cao cho nhà xưởng, kho lạnh.',
 'Nhà lắp ráp panel PU có khả năng cách nhiệt, cách âm vượt trội, phù hợp nhà xưởng, kho bảo quản, phòng sạch và nhà ở cần mát quanh năm.',
 'Tấm panel PU, khung thép',
 'Cách nhiệt vượt trội;Cách âm tốt;Độ bền cao;Phù hợp nhà xưởng, kho',
 'assets/images/banner.jpg', false, 8),

('Nhà panel vân gỗ dân dụng', 'nha-panel',
 'Nhà panel mặt vân gỗ, đẹp như nhà gỗ, dùng làm nhà ở, homestay.',
 'Nhà lắp ráp panel mặt ngoài vân gỗ, thẩm mỹ như nhà gỗ nhưng không mối mọt, thi công nhanh. Phù hợp nhà ở nông thôn, nhà vườn, homestay, quán cà phê.',
 'Tấm panel vân gỗ, khung thép',
 'Thẩm mỹ như nhà gỗ;Không mối mọt;Mát mẻ;Thi công nhanh',
 'assets/images/nha-panel-mau-go.jpg', false, 9),

-- ===== Tủ bếp & nội thất nhôm =====
('Tủ bếp nhôm kính hiện đại', 'tu-bep',
 'Tủ bếp nhôm kính chống ẩm, chống mối mọt, nhiều màu sắc.',
 'Thiết kế, thi công tủ bếp nhôm kính theo kích thước gian bếp. Nhôm không ngấm nước, không mối mọt, dễ lau chùi; mặt cánh kính nhiều màu, phù hợp mọi không gian bếp hiện đại.',
 'Nhôm hệ tủ bếp, kính màu, phụ kiện bản lề giảm chấn',
 'Chống ẩm, chống mối mọt;Dễ vệ sinh;Nhiều màu sắc;Thiết kế theo yêu cầu',
 'assets/images/tu-bep-nhom.jpg', true, 10),

('Tủ quần áo – nội thất nhôm', 'tu-bep',
 'Tủ quần áo, kệ, tủ giày bằng nhôm kính bền đẹp.',
 'Gia công nội thất nhôm: tủ quần áo, tủ giày, kệ trang trí, tủ lavabo. Bền với khí hậu nóng ẩm, không cong vênh, thiết kế theo không gian từng gia đình.',
 'Nhôm định hình, kính, phụ kiện',
 'Bền với khí hậu ẩm;Không cong vênh;Thiết kế theo yêu cầu;Hiện đại',
 'assets/images/tu-bep-tieu-nghia.jpg', false, 11),

-- ===== Mái che =====
('Mái che polycarbonate', 'mai-che',
 'Mái che sân, giếng trời bằng tấm polycarbonate lấy sáng.',
 'Thi công mái che sân trước, sân sau, giếng trời, nhà xe bằng khung sắt/nhôm kết hợp tấm polycarbonate. Lấy sáng tốt, chống mưa, giảm nắng gắt.',
 'Khung sắt hoặc nhôm, tấm polycarbonate',
 'Lấy sáng tự nhiên;Chống mưa nắng;Nhẹ, bền;Nhiều màu tấm lợp',
 'assets/images/mai-che.jpg', true, 12),

('Mái hiên di động – mái bạt', 'mai-che',
 'Mái hiên bạt kéo, xếp di động cho nhà ở và cửa hàng.',
 'Lắp đặt mái hiên di động, mái bạt kéo tay hoặc xếp lượn sóng cho cửa hàng, quán ăn, sân nhà. Kéo ra khi nắng mưa, thu gọn khi không dùng.',
 'Khung nhôm/sắt, bạt chống thấm',
 'Kéo ra thu vào linh hoạt;Chống nắng mưa;Tiết kiệm diện tích;Giá hợp lý',
 'assets/images/mai-che.jpg', false, 13),

-- ===== Bảo trì & sửa chữa =====
('Bảo trì – sửa chữa cửa nhôm, cửa kính', 'bao-tri',
 'Sửa cửa nhôm kẹt, xệ cánh, thay gioăng, thay phụ kiện tận nơi.',
 'Dịch vụ bảo trì, sửa chữa cửa nhôm và cửa kính: chỉnh cánh xệ, thay bản lề, khóa, tay nắm, gioăng cao su, bánh xe cửa lùa. Thợ đến tận nơi, xử lý nhanh, giá hợp lý.',
 'Phụ kiện thay thế chính hãng',
 'Đến tận nơi;Xử lý nhanh;Giá hợp lý;Phụ kiện chính hãng',
 'assets/images/bao-tri.jpg', true, 14),

('Sửa chữa cổng sắt, nhà panel', 'bao-tri',
 'Hàn, sơn lại cổng sắt, sửa mái, thay tấm panel hư hỏng.',
 'Sửa chữa cổng sắt, cửa sắt bị gỉ sét, xệ cánh; sơn lại; sửa mái tôn, mái che; thay tấm panel hư hỏng. Khảo sát và báo giá miễn phí.',
 'Sắt, sơn chống gỉ, tấm panel thay thế',
 'Khảo sát miễn phí;Làm nhanh gọn;Sơn lại như mới;Giá minh bạch',
 'assets/images/bao-tri.jpg', false, 15);


-- ===================== 2. CÔNG TRÌNH (dữ liệu minh họa – sửa lại trong trang Quản trị) =====================
insert into cong_trinh (ten, hang_muc, dia_diem, vi_do, kinh_do, nam, mo_ta, hinh_anh, thu_tu) values
('Nhà xưởng panel PU', 'nha-panel', 'Khu vực xã An Ninh, Tây Ninh', 10.9405, 106.3920, 2025,
 'Nhà xưởng khung thép, vách và mái panel PU cách nhiệt.', 'assets/images/banner.jpg', 1),
('Cửa đi nhôm Xingfa 4 cánh nhà phố', 'cua-nhom', 'Khu vực Hậu Nghĩa, Tây Ninh', 10.8890, 106.3920, 2025,
 'Cửa chính 4 cánh nhôm Xingfa kính an toàn cho mặt tiền nhà phố.', 'assets/images/cua-nhom-4-canh.jpg', 2),
('Cổng sắt mỹ thuật nhà vườn', 'cua-sat', 'Khu vực Đức Hòa, Tây Ninh', 10.8740, 106.4280, 2024,
 'Cổng sắt hoa văn 4 cánh, sơn tĩnh điện.', 'assets/images/cua-sat.jpg', 3),
('Mái che polycarbonate sân trước', 'mai-che', 'Khu vực Tân An, Tây Ninh', 10.5350, 106.4130, 2025,
 'Mái che khung sắt, tấm polycarbonate lấy sáng.', 'assets/images/mai-che.jpg', 4),
('Nhà panel vân gỗ homestay', 'nha-panel', 'Khu vực Tân Ninh, Tây Ninh', 11.3100, 106.1000, 2025,
 'Nhà panel mặt vân gỗ làm homestay, thi công nhanh.', 'assets/images/nha-panel-mau-go.jpg', 5),
('Tủ bếp nhôm kính hiện đại', 'tu-bep', 'Khu vực Trảng Bàng, Tây Ninh', 11.0300, 106.3600, 2025,
 'Tủ bếp trên dưới nhôm kính chống ẩm, chống mối mọt.', 'assets/images/tu-bep-nhom.jpg', 6),
('Vách kính cường lực cửa hàng', 'cua-nhom', 'Khu vực Gò Dầu, Tây Ninh', 11.0800, 106.2600, 2024,
 'Mặt tiền cửa hàng vách kính cường lực khung nhôm.', 'assets/images/cua-nhom-xingfa.jpg', 7),
('Nhà kho panel EPS', 'nha-panel', 'Khu vực Bến Lức, Tây Ninh', 10.6400, 106.4900, 2024,
 'Nhà kho panel EPS khung thép, tiết kiệm chi phí.', 'assets/images/nha-panel-dan-dung.jpg', 8),
('Tủ quần áo nội thất nhôm', 'tu-bep', 'Khu vực Hòa Thành, Tây Ninh', 11.2800, 106.1300, 2025,
 'Tủ quần áo và kệ nhôm kính theo kích thước phòng.', 'assets/images/tu-bep-tieu-nghia.jpg', 9),
('Bảo trì hệ cửa nhôm văn phòng', 'bao-tri', 'Khu vực Mỹ Hạnh, Tây Ninh', 10.8700, 106.4700, 2025,
 'Chỉnh cánh, thay gioăng và phụ kiện cửa nhôm.', 'assets/images/bao-tri.jpg', 10);

-- ===================== 3. ĐÁNH GIÁ (nội dung thật trên xingfatieunghia.com, đã duyệt) =====================
insert into danh_gia (ho_ten, so_sao, noi_dung, dich_vu, da_duyet) values
('Chú 9', 5, 'Cửa nhôm Xingfa lắp cho nhà tôi rất chắc chắn, thợ làm cẩn thận, đúng hẹn. Rất hài lòng với dịch vụ của Cơ Khí Tiếu Nghĩa.', 'cua-nhom', true),
('Hồ Văn Luân', 5, 'Đội ngũ tư vấn nhiệt tình, thi công nhà panel nhanh gọn cho xưởng của tôi. Giá cả hợp lý, chất lượng tốt.', 'nha-panel', true),
('Chị 7', 5, 'Cửa sắt cổng nhà tôi làm rất đẹp và bền, dùng nhiều năm vẫn chắc chắn. Sẽ giới thiệu cho bạn bè.', 'cua-sat', true);

-- ===================== 4. BẢN DỊCH TIẾNG ANH (_en) & TIẾNG TRUNG GIẢN THỂ (_zh) =====================
-- Khớp theo cột thu_tu. Muốn sửa câu dịch: sửa ở đây hoặc trong trang Quản trị.

-- ---- 4.1 Sản phẩm ----
update san_pham set
 ten_en='Decorative Wrought-Iron Gate', ten_zh='艺术铁门',
 mo_ta_ngan_en='Decorative patterned iron gates, made to your size and chosen design.',
 mo_ta_ngan_zh='花纹艺术铁门，按客户尺寸和款式定制。',
 mo_ta_chi_tiet_en='Decorative iron gates designed to order for townhouses, garden homes and villas. Sturdy frame, crisp patterns and powder coating that resists rust and keeps its colour under the Tay Ninh sun and rain.',
 mo_ta_chi_tiet_zh='艺术铁门按需设计，适用于联排住宅、花园住宅和别墅。框架坚固，花纹清晰，静电喷涂防锈，在西宁的日晒雨淋下依然持久保色。',
 vat_lieu_en='Box steel, solid steel bars, powder coating', vat_lieu_zh='方管钢、实心钢、静电喷涂',
 uu_diem_en='Sturdy and secure;Patterns made to order;Rust-proof powder coating;Long-lasting colour outdoors',
 uu_diem_zh='坚固安全;花纹按需定制;静电喷涂防锈;户外持久保色'
where thu_tu=1;

update san_pham set
 ten_en='Steel Doors & Fence Gates', ten_zh='铁门与围栏门',
 mo_ta_ngan_en='Steel doors, fence gates and sliding grilles for homes, shops and factories.',
 mo_ta_ngan_zh='适用于住宅、店铺和厂房的铁门、围栏门和伸缩门。',
 mo_ta_chi_tiet_en='Single and double steel doors, fence gates and folding grille doors made to the exact size of your building. Our team surveys on site and installs neatly to keep your home secure.',
 mo_ta_chi_tiet_zh='按工程实际尺寸加工单开、双开铁门、围栏门和折叠伸缩门。师傅上门测量，安装整洁，保障房屋安全。',
 vat_lieu_en='Galvanised box steel, anti-rust paint', vat_lieu_zh='镀锌方管钢、防锈漆',
 uu_diem_en='On-site measuring;Many styles;Reasonable price;Fast installation',
 uu_diem_zh='上门测量;款式多样;价格合理;安装快速'
where thu_tu=2;

update san_pham set
 ten_en='Steel Railings & Staircases', ten_zh='铁栏杆与铁楼梯',
 mo_ta_ngan_en='Strong, safe and modern balcony railings and steel staircases.',
 mo_ta_ngan_zh='坚固、安全、现代的阳台栏杆和铁楼梯。',
 mo_ta_chi_tiet_en='Balcony railings, stair railings and steel staircases for homes and factories. Solid structure, careful welding, and optional wooden handrails or tempered glass.',
 mo_ta_chi_tiet_zh='为住宅和厂房施工阳台栏杆、楼梯栏杆和铁楼梯。结构稳固，焊接仔细，可搭配木扶手或钢化玻璃。',
 vat_lieu_en='Box steel, solid steel, optional tempered glass', vat_lieu_zh='方管钢、实心钢，可搭配钢化玻璃',
 uu_diem_en='Safe for the family;Modern design;Strong welds;Combine with glass or wood',
 uu_diem_zh='家人使用安全;现代设计;焊接牢固;可搭配玻璃或木材'
where thu_tu=3;

update san_pham set
 ten_en='4-Panel Xingfa Aluminium Entrance Door', ten_zh='兴发铝合金四扇入户门',
 mo_ta_ngan_en='Premium 4-panel Xingfa aluminium main door, elegant for any façade.',
 mo_ta_ngan_zh='高档兴发铝合金四扇主门，让门面更显大气。',
 mo_ta_chi_tiet_en='A 4-panel Xingfa aluminium door with safety glass, ideal as the main door of townhouses and villas. Thick profiles, matching hardware, smooth operation and good sound and heat insulation. Both imported Xingfa and Vietnamese Xingfa profiles are available.',
 mo_ta_chi_tiet_zh='兴发铝合金四扇门搭配安全玻璃，适合联排住宅和别墅的主门。型材厚实，五金配套，开关顺滑，隔音隔热效果好。提供进口兴发和越南兴发两种型材供选择。',
 vat_lieu_en='Xingfa aluminium (imported or Vietnamese), safety glass, matching hardware', vat_lieu_zh='兴发铝材（进口或越南产）、安全玻璃、配套五金',
 uu_diem_en='Elegant and modern;Sound and heat insulation;No warping or termites;Many colours',
 uu_diem_zh='大气现代;隔音隔热;不变形不虫蛀;多种颜色'
where thu_tu=4;

update san_pham set
 ten_en='Xingfa Aluminium Windows', ten_zh='兴发铝合金窗',
 mo_ta_ngan_en='Casement, top-hung and sliding Xingfa aluminium windows with a tight seal.',
 mo_ta_ngan_zh='平开、上悬和推拉式兴发铝合金窗，密封严实。',
 mo_ta_chi_tiet_en='Xingfa aluminium windows in casement, top-hung or sliding styles. Tight gaskets keep out dust and driving rain while letting plenty of daylight into bedrooms and living rooms.',
 mo_ta_chi_tiet_zh='兴发铝合金窗提供平开、上悬、推拉多种开启方式。密封胶条防尘防雨，为卧室和客厅带来充足采光。',
 vat_lieu_en='Xingfa aluminium, safety glass, EPDM gaskets', vat_lieu_zh='兴发铝材、安全玻璃、EPDM密封胶条',
 uu_diem_en='Watertight seal;Natural daylight;Many opening styles;Easy to clean',
 uu_diem_zh='密封防水;自然采光;多种开启方式;易于清洁'
where thu_tu=5;

update san_pham set
 ten_en='Glass Partitions & Tempered Glass Doors', ten_zh='玻璃隔断与钢化玻璃门',
 mo_ta_ngan_en='Aluminium-framed tempered glass partitions and doors for offices and shops.',
 mo_ta_ngan_zh='适用于办公室、店铺的铝框钢化玻璃隔断和玻璃门。',
 mo_ta_chi_tiet_en='Glass partitions and tempered glass doors with aluminium frames for shop fronts, showrooms, offices and shower screens. Bright, open, modern and safe to use.',
 mo_ta_chi_tiet_zh='为店面、展厅、办公室和淋浴房施工铝框钢化玻璃隔断与玻璃门。空间通透明亮，现代美观，使用安全。',
 vat_lieu_en='Tempered glass, Xingfa aluminium frame, stainless steel fittings', vat_lieu_zh='钢化玻璃、兴发铝框、不锈钢配件',
 uu_diem_en='Bright, open space;Impact safe;Modern and elegant;Quick installation',
 uu_diem_zh='空间通透明亮;抗冲击安全;现代美观;施工快速'
where thu_tu=6;

update san_pham set
 ten_en='EPS Sandwich Panel Prefab House', ten_zh='EPS夹芯板装配式房屋',
 mo_ta_ngan_en='Lightweight EPS panel houses, quick to build and cost-saving.',
 mo_ta_ngan_zh='EPS夹芯板房屋轻便，施工快，节省成本。',
 mo_ta_chi_tiet_en='EPS panel prefab houses suit temporary housing, rental rooms, site offices and small warehouses. Light panels with good insulation, fast to erect and easy to relocate when needed.',
 mo_ta_chi_tiet_zh='EPS夹芯板装配式房屋适用于临时住房、出租房、工地办公室和小型仓库。板材轻便，隔热性好，搭建快速，需要时可拆迁。',
 vat_lieu_en='EPS sandwich panels, steel frame', vat_lieu_zh='EPS夹芯板、钢结构',
 uu_diem_en='Fast construction;Cost-saving;Good insulation;Relocatable',
 uu_diem_zh='施工快速;节省成本;隔热良好;可拆迁'
where thu_tu=7;

update san_pham set
 ten_en='PU Sandwich Panel Prefab House', ten_zh='PU夹芯板装配式房屋',
 mo_ta_ngan_en='Highly insulated PU panel buildings for factories and cold storage.',
 mo_ta_ngan_zh='PU夹芯板房屋隔热性能高，适用于厂房和冷库。',
 mo_ta_chi_tiet_en='PU panel prefab buildings offer outstanding heat and sound insulation, ideal for factories, storage rooms, clean rooms and homes that need to stay cool all year.',
 mo_ta_chi_tiet_zh='PU夹芯板装配式房屋隔热隔音性能出色，适用于厂房、仓储、洁净室以及需要常年凉爽的住宅。',
 vat_lieu_en='PU sandwich panels, steel frame', vat_lieu_zh='PU夹芯板、钢结构',
 uu_diem_en='Outstanding insulation;Good soundproofing;High durability;Ideal for factories and warehouses',
 uu_diem_zh='隔热出色;隔音良好;耐用性高;适合厂房和仓库'
where thu_tu=8;

update san_pham set
 ten_en='Wood-Grain Panel House', ten_zh='木纹夹芯板房屋',
 mo_ta_ngan_en='Wood-grain panel houses that look like timber, for homes and homestays.',
 mo_ta_ngan_zh='外观如木屋的木纹板房屋，适合住宅和民宿。',
 mo_ta_chi_tiet_en='Prefab houses with a wood-grain finish: the look of a timber house without termites, and quick to build. Ideal for countryside homes, garden houses, homestays and cafés.',
 mo_ta_chi_tiet_zh='外层木纹饰面的装配式房屋，拥有木屋般的美观却不怕虫蛀，施工快速。适合乡村住宅、花园小屋、民宿和咖啡馆。',
 vat_lieu_en='Wood-grain sandwich panels, steel frame', vat_lieu_zh='木纹夹芯板、钢结构',
 uu_diem_en='Looks like a timber house;Termite-free;Stays cool;Fast construction',
 uu_diem_zh='外观如木屋;不怕虫蛀;凉爽舒适;施工快速'
where thu_tu=9;

update san_pham set
 ten_en='Modern Aluminium & Glass Kitchen Cabinets', ten_zh='现代铝合金玻璃橱柜',
 mo_ta_ngan_en='Moisture-proof, termite-proof aluminium kitchen cabinets in many colours.',
 mo_ta_ngan_zh='防潮防虫的铝合金橱柜，多种颜色可选。',
 mo_ta_chi_tiet_en='Aluminium and glass kitchen cabinets designed and built to fit your kitchen. Aluminium does not absorb water or attract termites and is easy to wipe clean; coloured glass doors suit any modern kitchen.',
 mo_ta_chi_tiet_zh='按厨房尺寸设计施工铝合金玻璃橱柜。铝材不吸水、不虫蛀，易于擦洗；彩色玻璃柜门适合各种现代厨房。',
 vat_lieu_en='Kitchen-cabinet aluminium profiles, coloured glass, soft-close hinges', vat_lieu_zh='橱柜专用铝型材、彩色玻璃、阻尼铰链',
 uu_diem_en='Moisture and termite proof;Easy to clean;Many colours;Custom design',
 uu_diem_zh='防潮防虫;易于清洁;多种颜色;按需设计'
where thu_tu=10;

update san_pham set
 ten_en='Aluminium Wardrobes & Furniture', ten_zh='铝合金衣柜与家具',
 mo_ta_ngan_en='Durable aluminium and glass wardrobes, shelves and shoe cabinets.',
 mo_ta_ngan_zh='耐用的铝合金玻璃衣柜、置物架和鞋柜。',
 mo_ta_chi_tiet_en='Aluminium furniture: wardrobes, shoe cabinets, display shelves and vanity cabinets. Withstands the hot, humid climate without warping, designed for each family''s space.',
 mo_ta_chi_tiet_zh='铝合金家具：衣柜、鞋柜、装饰架、浴室柜。耐湿热气候，不变形，按每个家庭的空间设计。',
 vat_lieu_en='Aluminium profiles, glass, hardware', vat_lieu_zh='铝型材、玻璃、五金配件',
 uu_diem_en='Handles humid climate;No warping;Custom design;Modern look',
 uu_diem_zh='耐潮湿气候;不变形;按需设计;现代美观'
where thu_tu=11;

update san_pham set
 ten_en='Polycarbonate Canopy', ten_zh='阳光板雨棚',
 mo_ta_ngan_en='Light-transmitting polycarbonate canopies for yards and skylights.',
 mo_ta_ngan_zh='采光阳光板雨棚，适用于庭院和天井。',
 mo_ta_chi_tiet_en='Canopies for front and back yards, skylights and carports using steel or aluminium frames with polycarbonate sheets. Lets in daylight, keeps out rain and softens harsh sun.',
 mo_ta_chi_tiet_zh='为前后院、天井、车棚施工钢或铝框架搭配阳光板的雨棚。采光好，挡雨，减弱强烈日晒。',
 vat_lieu_en='Steel or aluminium frame, polycarbonate sheets', vat_lieu_zh='钢或铝框架、阳光板',
 uu_diem_en='Natural daylight;Rain and sun protection;Light and durable;Many sheet colours',
 uu_diem_zh='自然采光;遮阳挡雨;轻便耐用;多种板材颜色'
where thu_tu=12;

update san_pham set
 ten_en='Retractable Awnings', ten_zh='伸缩遮阳篷',
 mo_ta_ngan_en='Pull-out and folding fabric awnings for homes and shops.',
 mo_ta_ngan_zh='适用于住宅和店铺的拉伸、折叠遮阳篷。',
 mo_ta_chi_tiet_en='Retractable, hand-pulled or wave-folding fabric awnings for shops, restaurants and courtyards. Extend them in sun or rain and fold them away when not needed.',
 mo_ta_chi_tiet_zh='为店铺、餐馆、庭院安装手拉式或波浪折叠式伸缩遮阳篷。晴雨时拉开，不用时收起。',
 vat_lieu_en='Aluminium/steel frame, waterproof fabric', vat_lieu_zh='铝/钢框架、防水篷布',
 uu_diem_en='Flexible pull-out and retract;Sun and rain protection;Space-saving;Reasonable price',
 uu_diem_zh='灵活伸缩;遮阳挡雨;节省空间;价格合理'
where thu_tu=13;

update san_pham set
 ten_en='Aluminium & Glass Door Maintenance and Repair', ten_zh='铝门与玻璃门维修保养',
 mo_ta_ngan_en='On-site fixes for stuck or sagging aluminium doors, gaskets and hardware.',
 mo_ta_ngan_zh='上门修理卡顿、下垂的铝门，更换密封条和五金。',
 mo_ta_chi_tiet_en='Maintenance and repair of aluminium and glass doors: adjusting sagging sashes, replacing hinges, locks, handles, rubber gaskets and sliding-door rollers. We come to you and fix it fast at a fair price.',
 mo_ta_chi_tiet_zh='铝门和玻璃门维修保养：调整下垂门扇，更换合页、门锁、把手、橡胶密封条和推拉门滑轮。师傅上门，处理快速，价格合理。',
 vat_lieu_en='Genuine replacement parts', vat_lieu_zh='原厂替换配件',
 uu_diem_en='We come to you;Fast service;Fair price;Genuine parts',
 uu_diem_zh='上门服务;处理快速;价格合理;原厂配件'
where thu_tu=14;

update san_pham set
 ten_en='Steel Gate & Panel House Repair', ten_zh='铁门与夹芯板房维修',
 mo_ta_ngan_en='Welding and repainting gates, roof repairs and damaged panel replacement.',
 mo_ta_ngan_zh='铁门焊接翻新、屋顶维修、更换损坏夹芯板。',
 mo_ta_chi_tiet_en='Repairs for rusty or sagging steel gates and doors, repainting, metal roof and canopy repairs, and replacement of damaged sandwich panels. Free survey and quotation.',
 mo_ta_chi_tiet_zh='修理生锈、下垂的铁门，重新喷漆，维修铁皮屋顶和雨棚，更换损坏的夹芯板。免费勘察和报价。',
 vat_lieu_en='Steel, anti-rust paint, replacement panels', vat_lieu_zh='钢材、防锈漆、替换夹芯板',
 uu_diem_en='Free survey;Quick and tidy;Repainted like new;Transparent pricing',
 uu_diem_zh='免费勘察;快速整洁;翻新如新;价格透明'
where thu_tu=15;

-- ---- 4.2 Công trình (minh họa) ----
update cong_trinh set ten_en='PU panel factory building', ten_zh='PU夹芯板厂房', dia_diem_en='An Ninh commune area, Tay Ninh', dia_diem_zh='西宁省安宁乡一带',
 mo_ta_en='Steel-frame factory with PU insulated panel walls and roof.', mo_ta_zh='钢结构厂房，墙体和屋顶采用PU隔热夹芯板。' where thu_tu=1;
update cong_trinh set ten_en='4-panel Xingfa aluminium door for a townhouse', ten_zh='联排住宅兴发铝合金四扇门', dia_diem_en='Hau Nghia area, Tay Ninh', dia_diem_zh='西宁省后义一带',
 mo_ta_en='4-panel Xingfa aluminium main door with safety glass for a townhouse façade.', mo_ta_zh='联排住宅门面安装兴发铝合金四扇安全玻璃主门。' where thu_tu=2;
update cong_trinh set ten_en='Decorative iron gate for a garden home', ten_zh='花园住宅艺术铁门', dia_diem_en='Duc Hoa area, Tay Ninh', dia_diem_zh='西宁省德和一带',
 mo_ta_en='4-leaf patterned iron gate with powder coating.', mo_ta_zh='四扇花纹铁门，静电喷涂。' where thu_tu=3;
update cong_trinh set ten_en='Polycarbonate front-yard canopy', ten_zh='前院阳光板雨棚', dia_diem_en='Tan An area, Tay Ninh', dia_diem_zh='西宁省新安一带',
 mo_ta_en='Steel-frame canopy with light-transmitting polycarbonate sheets.', mo_ta_zh='钢框架搭配采光阳光板的雨棚。' where thu_tu=4;
update cong_trinh set ten_en='Wood-grain panel homestay', ten_zh='木纹夹芯板民宿', dia_diem_en='Tan Ninh area, Tay Ninh', dia_diem_zh='西宁省新宁一带',
 mo_ta_en='Wood-grain panel house used as a homestay, built quickly.', mo_ta_zh='木纹夹芯板房屋用作民宿，施工快速。' where thu_tu=5;
update cong_trinh set ten_en='Modern aluminium & glass kitchen', ten_zh='现代铝合金玻璃橱柜', dia_diem_en='Trang Bang area, Tay Ninh', dia_diem_zh='西宁省庄棚一带',
 mo_ta_en='Upper and lower aluminium-glass cabinets, moisture and termite proof.', mo_ta_zh='上下铝合金玻璃橱柜，防潮防虫。' where thu_tu=6;
update cong_trinh set ten_en='Tempered glass shop front', ten_zh='店铺钢化玻璃门面', dia_diem_en='Go Dau area, Tay Ninh', dia_diem_zh='西宁省鹅油一带',
 mo_ta_en='Shop front with aluminium-framed tempered glass partitions.', mo_ta_zh='铝框钢化玻璃隔断店铺门面。' where thu_tu=7;
update cong_trinh set ten_en='EPS panel warehouse', ten_zh='EPS夹芯板仓库', dia_diem_en='Ben Luc area, Tay Ninh', dia_diem_zh='西宁省滨沥一带',
 mo_ta_en='Steel-frame warehouse with EPS panels, cost-saving.', mo_ta_zh='钢结构EPS夹芯板仓库，节省成本。' where thu_tu=8;
update cong_trinh set ten_en='Aluminium wardrobe', ten_zh='铝合金衣柜', dia_diem_en='Hoa Thanh area, Tay Ninh', dia_diem_zh='西宁省和城一带',
 mo_ta_en='Aluminium-glass wardrobe and shelves made to fit the room.', mo_ta_zh='按房间尺寸定制的铝合金玻璃衣柜和置物架。' where thu_tu=9;
update cong_trinh set ten_en='Office aluminium door maintenance', ten_zh='办公室铝门维修保养', dia_diem_en='My Hanh area, Tay Ninh', dia_diem_zh='西宁省美幸一带',
 mo_ta_en='Sash adjustment, gasket and hardware replacement for aluminium doors.', mo_ta_zh='调整门扇，更换铝门密封条和五金。' where thu_tu=10;

-- ===================== 5. BÀI VIẾT MẪU (chỉ tiếng Việt – dùng để thử nút "Dịch bằng AI" trong trang Quản trị) =====================
insert into bai_viet (slug, chuyen_muc, tieu_de, tom_tat, noi_dung, anh_dai_dien, da_dang, noi_bat) values
('nha-panel-eps-hay-pu', 'kien-thuc',
 'Nhà lắp ráp panel EPS hay PU: nên chọn loại nào?',
 'So sánh nhanh hai loại panel phổ biến nhất để chọn đúng cho nhà ở, nhà trọ, kho xưởng.',
 E'Khi làm nhà lắp ráp panel, câu hỏi đầu tiên khách thường hỏi là **nên dùng panel EPS hay PU**. Mỗi loại có ưu điểm riêng.\n\n## Panel EPS\n- Lõi xốp EPS nhẹ, giá thành tiết kiệm.\n- Thi công nhanh, phù hợp nhà ở tạm, nhà trọ, văn phòng công trường, kho nhỏ.\n\n## Panel PU\n- Lõi PU cách nhiệt, cách âm tốt hơn.\n- Phù hợp nhà xưởng, kho bảo quản, nhà ở cần mát quanh năm.\n\n## Nên chọn loại nào?\nNếu cần tiết kiệm chi phí và dựng nhanh, chọn **EPS**. Nếu ưu tiên mát và yên tĩnh lâu dài, chọn **PU**. Độ dày panel (50, 75, 100 mm) cũng ảnh hưởng tới khả năng cách nhiệt.\n\nBạn có thể **tự thiết kế nhà panel 3D** trên website để xem trước diện tích và số tấm panel, sau đó gửi thiết kế để Xingfa Tiếu Nghĩa báo giá miễn phí.',
 'assets/images/nha-panel-dan-dung.jpg', true, true),

('quy-trinh-bao-gia-thi-cong', 'tin-cong-ty',
 'Quy trình báo giá và thi công cửa sắt, cửa nhôm Xingfa tại Tây Ninh',
 '5 bước từ khi liên hệ đến khi bàn giao – và cách theo dõi tiến độ công trình ngay trên website.',
 E'Xingfa Tiếu Nghĩa làm việc theo quy trình 5 bước rõ ràng:\n\n1. **Tiếp nhận yêu cầu** – qua hotline 097-622-4875, Zalo hoặc website.\n2. **Khảo sát đo đạc** – thợ đến tận công trình đo kích thước thực tế.\n3. **Báo giá** – báo giá minh bạch, không phát sinh chi phí ẩn.\n4. **Gia công & lắp đặt** – sản xuất tại xưởng, lắp đặt gọn gàng.\n5. **Bàn giao & bảo hành** – kiểm tra kỹ trước khi bàn giao, bảo hành theo chính sách công ty.\n\nSau khi đặt lịch khảo sát trên website, bạn nhận được **mã lịch** để tự theo dõi công trình đang ở bước nào.',
 'assets/images/cua-nhom-4-canh.jpg', true, false),

('phong-thuy-cua-chinh', 'kien-thuc',
 'Phong thủy cửa chính nhà ở: những điều nên lưu ý',
 'Cửa chính là nơi đón khí vào nhà. Một vài lưu ý khi chọn kiểu dáng, kích thước và chất liệu.',
 E'Trong quan niệm phong thủy, **cửa chính** là nơi đón khí vào nhà nên được nhiều gia đình quan tâm.\n\n## Một vài lưu ý phổ biến\n- Cửa chính nên cân đối với mặt tiền, không quá nhỏ so với ngôi nhà.\n- Ưu tiên cửa chắc chắn, đóng mở êm, không kẹt.\n- Giữ khu vực trước cửa thông thoáng, sạch sẽ.\n\n## Chọn chất liệu\nCửa nhôm Xingfa 4 cánh được nhiều gia đình chọn làm cửa chính vì sang trọng, bền, không cong vênh, nhiều màu sắc. Cửa sắt mỹ thuật phù hợp nhà vườn, biệt thự.\n\nLiên hệ Xingfa Tiếu Nghĩa để được tư vấn mẫu cửa phù hợp với ngôi nhà của bạn.',
 'assets/images/cua-nhom-xingfa.jpg', true, false);
