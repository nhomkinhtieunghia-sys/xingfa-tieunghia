// KỊCH BẢN TRỢ LÝ TƯ VẤN – sửa nội dung trả lời ở file này (không cần đụng tro-ly.js)
// NODE  = 1 lượt trợ lý nói: chu (3 ngôn ngữ), nut (nút trả lời nhanh), nhom (gợi ý sản phẩm), hanhDong (nút cuối), congNang (gợi ý cho trang 3D)
// NUT   = 1 nút trả lời nhanh: nhan (3 ngôn ngữ) + toi (node kế tiếp)
// TU_KHOA = câu khách tự gõ → node phù hợp (không dấu, không phân biệt hoa thường; tiếng Trung so khớp trực tiếp)
// Nguyên tắc: hỏi giá luôn trả lời "báo giá miễn phí sau khảo sát" + hotline; KHÔNG ghi số năm bảo hành.
window.TRO_LY = {
    ten: { vi: 'Trợ lý Tiếu Nghĩa', en: 'Tiếu Nghĩa Assistant', zh: 'Tiếu Nghĩa 助手' },
    trangThai: { vi: 'Trả lời tự động · 24/7', en: 'Automatic replies · 24/7', zh: '自动回复 · 全天候' },
    oNhap: { vi: 'Nhập câu hỏi của bạn...', en: 'Type your question...', zh: '请输入您的问题...' },
    moChat: { vi: 'Cần tư vấn?', en: 'Need advice?', zh: '需要咨询？' },
    goiYSanPham: { vi: 'Mẫu gợi ý cho bạn:', en: 'Suggested products:', zh: '为您推荐：' },
    hanhDong: {
        xemChiTiet: { vi: 'Xem chi tiết', en: 'Details', zh: '查看详情' },
        '3d': { vi: '🏠 Thiết kế 3D', en: '🏠 3D design', zh: '🏠 3D设计' },
        datLich: { vi: '📅 Đặt lịch khảo sát', en: '📅 Book a survey', zh: '📅 预约勘察' },
        goi: { vi: '📞 Gọi 0976 224 875', en: '📞 Call 0976 224 875', zh: '📞 致电 0976 224 875' },
        zalo: { vi: '💬 Nhắn Zalo', en: '💬 Zalo chat', zh: '💬 Zalo 聊天' },
        batDauLai: { vi: '↺ Hỏi việc khác', en: '↺ Ask something else', zh: '↺ 咨询其他' }
    },

    NUT: {
        cua:       { nhan: { vi: '🚪 Tôi cần làm cửa', en: '🚪 I need doors', zh: '🚪 我需要做门窗' }, toi: 'hoi-cua' },
        panel:     { nhan: { vi: '🏠 Tôi cần nhà panel', en: '🏠 I need a panel house', zh: '🏠 我需要夹芯板房' }, toi: 'hoi-panel' },
        maiTuBep:  { nhan: { vi: '⛱️ Mái che / tủ bếp', en: '⛱️ Canopy / kitchen', zh: '⛱️ 雨棚 / 橱柜' }, toi: 'hoi-mai-tu' },
        baoTri:    { nhan: { vi: '🔧 Sửa chữa – bảo trì', en: '🔧 Repair – maintenance', zh: '🔧 维修保养' }, toi: 'hoi-bao-tri' },
        thongTin:  { nhan: { vi: 'ℹ️ Hỏi thông tin', en: 'ℹ️ General info', zh: 'ℹ️ 咨询信息' }, toi: 'hoi-thong-tin' },

        cuaNhom:   { nhan: { vi: 'Cửa nhôm Xingfa', en: 'Xingfa aluminium', zh: '兴发铝合金门窗' }, toi: 'hoi-loai-nhom' },
        cuaSat:    { nhan: { vi: 'Cửa sắt / cổng / lan can', en: 'Steel door / gate / railing', zh: '铁门 / 大门 / 栏杆' }, toi: 'kq-cua-sat' },
        cuaKinh:   { nhan: { vi: 'Cửa kính cường lực', en: 'Tempered glass door', zh: '钢化玻璃门' }, toi: 'kq-cua-kinh' },
        nhomNK:    { nhan: { vi: 'Xingfa nhập khẩu', en: 'Imported Xingfa', zh: '进口兴发' }, toi: 'kq-cua-nhom' },
        nhomVN:    { nhan: { vi: 'Xingfa Việt Nam', en: 'Vietnam Xingfa', zh: '越南兴发' }, toi: 'kq-cua-nhom' },
        nhomChuaRo:{ nhan: { vi: 'Chưa rõ, cần tư vấn', en: 'Not sure yet', zh: '还不确定' }, toi: 'tl-xingfa' },

        pnO:       { nhan: { vi: 'Nhà ở / homestay', en: 'Home / homestay', zh: '住宅 / 民宿' }, toi: 'kq-panel-o' },
        pnTro:     { nhan: { vi: 'Nhà trọ', en: 'Rental rooms', zh: '出租屋' }, toi: 'kq-panel-tro' },
        pnKho:     { nhan: { vi: 'Kho – xưởng', en: 'Warehouse – workshop', zh: '仓库 – 厂房' }, toi: 'kq-panel-kho' },
        pnVP:      { nhan: { vi: 'Văn phòng', en: 'Office', zh: '办公室' }, toi: 'kq-panel-vp' },


        maiChe:    { nhan: { vi: 'Mái che sân, cổng, nhà xe', en: 'Yard / gate / carport canopy', zh: '庭院 / 大门 / 车棚雨棚' }, toi: 'kq-mai-che' },
        tuBep:     { nhan: { vi: 'Tủ bếp & nội thất nhôm', en: 'Aluminium kitchen & furniture', zh: '铝合金橱柜与家具' }, toi: 'kq-tu-bep' },

        btCua:     { nhan: { vi: 'Cửa nhôm, cửa kính', en: 'Aluminium / glass doors', zh: '铝门 / 玻璃门' }, toi: 'kq-bao-tri' },
        btSat:     { nhan: { vi: 'Cửa sắt, cổng', en: 'Steel doors, gates', zh: '铁门、大门' }, toi: 'kq-bao-tri' },
        btMai:     { nhan: { vi: 'Mái che, mái tôn', en: 'Canopy, metal roof', zh: '雨棚、铁皮屋顶' }, toi: 'kq-bao-tri' },

        ttGia:     { nhan: { vi: '💰 Giá bao nhiêu?', en: '💰 How much?', zh: '💰 价格多少？' }, toi: 'tl-gia' },
        ttBaoHanh: { nhan: { vi: '🛡️ Bảo hành', en: '🛡️ Warranty', zh: '🛡️ 保修' }, toi: 'tl-bao-hanh' },
        ttKhuVuc:  { nhan: { vi: '📍 Khu vực thi công', en: '📍 Service area', zh: '📍 施工范围' }, toi: 'tl-khu-vuc' },
        ttDiaChi:  { nhan: { vi: '🏢 Địa chỉ & giờ làm việc', en: '🏢 Address & hours', zh: '🏢 地址与营业时间' }, toi: 'tl-dia-chi' },
        ttEpsPu:   { nhan: { vi: '🧱 Panel EPS hay PU?', en: '🧱 EPS or PU panel?', zh: '🧱 EPS还是PU板？' }, toi: 'tl-eps-pu' },
        ttXingfa:  { nhan: { vi: '🪟 Xingfa nhập khẩu hay VN?', en: '🪟 Imported or VN Xingfa?', zh: '🪟 进口还是越南兴发？' }, toi: 'tl-xingfa' },
        ttThoiGian:{ nhan: { vi: '⏱️ Thi công bao lâu?', en: '⏱️ How long to build?', zh: '⏱️ 施工多久？' }, toi: 'tl-thoi-gian' },
        ttTienDo:  { nhan: { vi: '📋 Theo dõi tiến độ', en: '📋 Track progress', zh: '📋 查询进度' }, toi: 'tl-tien-do' }
    },

    NODE: {
        'chao': {
            chu: {
                vi: 'Xin chào 👋 Mình là trợ lý của Xingfa Tiếu Nghĩa. Anh/chị đang cần làm gì ạ?',
                en: 'Hello 👋 I am the Xingfa Tiếu Nghĩa assistant. What can I help you with?',
                zh: '您好 👋 我是 Xingfa Tiếu Nghĩa 的助手。请问您需要什么服务？'
            },
            nut: ['cua', 'panel', 'maiTuBep', 'baoTri', 'thongTin']
        },
        'hoi-cua': {
            chu: { vi: 'Anh/chị cần loại cửa nào ạ?', en: 'Which type of door do you need?', zh: '您需要哪种门？' },
            nut: ['cuaNhom', 'cuaSat', 'cuaKinh']
        },
        'hoi-loai-nhom': {
            chu: {
                vi: 'Công ty làm cả nhôm Xingfa nhập khẩu và Xingfa Việt Nam. Anh/chị muốn dòng nào?',
                en: 'We work with both imported Xingfa and Vietnam-made Xingfa. Which do you prefer?',
                zh: '我们提供进口兴发和越南兴发两种铝材。您倾向哪种？'
            },
            nut: ['nhomNK', 'nhomVN', 'nhomChuaRo']
        },
        'hoi-panel': {
            chu: { vi: 'Nhà panel dùng để làm gì ạ?', en: 'What will the panel house be used for?', zh: '夹芯板房用于什么用途？' },
            nut: ['pnO', 'pnTro', 'pnKho', 'pnVP']
        },
        'hoi-mai-tu': {
            chu: { vi: 'Anh/chị quan tâm hạng mục nào?', en: 'Which one are you interested in?', zh: '您对哪项感兴趣？' },
            nut: ['maiChe', 'tuBep']
        },
        'hoi-bao-tri': {
            chu: { vi: 'Anh/chị cần sửa chữa hạng mục nào?', en: 'What needs repairing?', zh: '需要维修哪一项？' },
            nut: ['btCua', 'btSat', 'btMai']
        },
        'hoi-thong-tin': {
            chu: { vi: 'Anh/chị muốn hỏi thông tin gì ạ?', en: 'What would you like to know?', zh: '您想了解什么？' },
            nut: ['ttGia', 'ttBaoHanh', 'ttKhuVuc', 'ttDiaChi', 'ttEpsPu', 'ttXingfa', 'ttThoiGian', 'ttTienDo']
        },

        // ---- Kết thúc nhánh: gợi ý sản phẩm + nút ----
        'kq-cua-nhom': {
            chu: {
                vi: 'Cửa nhôm Xingfa kín khít, cách âm tốt, nhiều mẫu cửa đi, cửa sổ, cửa lùa. Kỹ thuật viên sẽ đo tận nơi và tư vấn dòng nhôm hợp ngân sách.',
                en: 'Xingfa aluminium doors seal well, reduce noise and come in many styles. Our technician will measure on site and suggest the right range for your budget.',
                zh: '兴发铝合金门窗密封好、隔音佳，款式多样。技术人员会上门测量，按预算推荐合适型材。'
            },
            nhom: 'cua-nhom', hanhDong: ['datLich', 'goi']
        },
        'kq-cua-kinh': {
            chu: {
                vi: 'Cửa kính cường lực sáng, hiện đại, hợp mặt tiền và văn phòng. Công ty khảo sát miễn phí để chọn độ dày kính và phụ kiện phù hợp.',
                en: 'Tempered glass doors are bright and modern, ideal for shopfronts and offices. We survey for free to choose the right glass and fittings.',
                zh: '钢化玻璃门明亮现代，适合店面和办公室。我们免费勘察，选择合适的玻璃厚度和配件。'
            },
            nhom: 'cua-nhom', hanhDong: ['datLich', 'goi']
        },
        'kq-cua-sat': {
            chu: {
                vi: 'Xưởng gia công cửa sắt, cổng sắt mỹ thuật, lan can, cầu thang theo kích thước thực tế, sơn tĩnh điện bền màu.',
                en: 'Our workshop makes steel doors, decorative gates, railings and stairs to measure, with durable powder coating.',
                zh: '我们的工厂按实际尺寸加工铁门、艺术大门、栏杆和楼梯，静电喷涂持久耐用。'
            },
            nhom: 'cua-sat', hanhDong: ['datLich', 'goi']
        },
        'kq-panel-o': {
            chu: {
                vi: 'Nhà ở / homestay thường dùng panel PU hoặc vân gỗ cho mát và đẹp. Anh/chị có thể tự thiết kế 3D, xem diện tích và số tấm panel ngay trên web.',
                en: 'Homes and homestays usually use PU or wood-grain panels for comfort and looks. Try our 3D designer to see the area and panel count instantly.',
                zh: '住宅和民宿常用PU板或木纹板，舒适美观。您可在网站上自行3D设计，立即查看面积和板材数量。'
            },
            nhom: 'nha-panel', congNang: 'nha-o', hanhDong: ['3d', 'datLich', 'goi']
        },
        'kq-panel-tro': {
            chu: {
                vi: 'Nhà trọ panel lắp nhanh, tiết kiệm, có thể chia nhiều phòng. Thử thiết kế 3D mẫu "Nhà trọ" để xem trước nhé.',
                en: 'Panel rental rooms are quick to build, economical and easy to divide. Try the "Rental rooms" preset in the 3D designer.',
                zh: '夹芯板出租屋安装快、经济、易分隔。可在3D设计中试试“出租屋”方案。'
            },
            nhom: 'nha-panel', congNang: 'nha-tro', hanhDong: ['3d', 'datLich', 'goi']
        },
        'kq-panel-kho': {
            chu: {
                vi: 'Kho – xưởng nên dùng panel PU dày để cách nhiệt tốt. Kỹ thuật viên sẽ khảo sát mặt bằng và báo giá chi tiết.',
                en: 'Warehouses and workshops are best with thick PU panels for insulation. Our technician will survey the site and give a detailed quote.',
                zh: '仓库和厂房建议使用较厚的PU板以获得良好隔热。技术人员将勘察场地并详细报价。'
            },
            nhom: 'nha-panel', congNang: 'kho-xuong', hanhDong: ['3d', 'datLich', 'goi']
        },
        'kq-panel-vp': {
            chu: {
                vi: 'Văn phòng panel gọn, lắp nhanh, kết hợp cửa nhôm kính cho sáng. Thử mẫu "Văn phòng" trong trang thiết kế 3D nhé.',
                en: 'Panel offices are neat and quick to install, with aluminium-glass doors for light. Try the "Office" preset in the 3D designer.',
                zh: '夹芯板办公室整洁、安装快，搭配铝合金玻璃门更明亮。可在3D设计中试试“办公室”方案。'
            },
            nhom: 'nha-panel', congNang: 'van-phong', hanhDong: ['3d', 'datLich', 'goi']
        },
        'kq-mai-che': {
            chu: {
                vi: 'Mái che hiện đại cho sân, cổng, nhà xe: che nắng mưa, nhiều kiểu khung và tấm lợp. Khảo sát miễn phí để chọn kiểu phù hợp.',
                en: 'Modern canopies for yards, gates and carports keep out sun and rain, with many frame and roofing options. Free survey to choose the right one.',
                zh: '现代雨棚适用于庭院、大门、车棚，遮阳挡雨，框架和屋面多种可选。免费勘察帮您选择。'
            },
            nhom: 'mai-che', hanhDong: ['datLich', 'goi']
        },
        'kq-tu-bep': {
            chu: {
                vi: 'Tủ bếp & nội thất nhôm không sợ mối mọt, ẩm mốc, dễ lau chùi. Thiết kế theo kích thước căn bếp thực tế.',
                en: 'Aluminium kitchens and furniture resist termites and moisture and are easy to clean. Made to fit your actual kitchen.',
                zh: '铝合金橱柜和家具防虫防潮、易清洁，按实际厨房尺寸定制。'
            },
            nhom: 'tu-bep', hanhDong: ['datLich', 'goi']
        },
        'kq-bao-tri': {
            chu: {
                vi: 'Công ty nhận sửa chữa, bảo trì cửa, cổng, mái che: thay phụ kiện, chỉnh cánh, sơn lại... Gọi hoặc đặt lịch để kỹ thuật viên đến kiểm tra.',
                en: 'We repair and maintain doors, gates and canopies: replacing fittings, realigning, repainting... Call or book and our technician will come to check.',
                zh: '我们提供门、大门、雨棚的维修保养：更换配件、调整门扇、重新喷漆等。请致电或预约，技术人员将上门检查。'
            },
            nhom: 'bao-tri', hanhDong: ['datLich', 'goi']
        },

        // ---- Trả lời thông tin ----
        'tl-gia': {
            chu: {
                vi: 'Giá phụ thuộc kích thước, vật liệu và hiện trạng công trình nên công ty **báo giá miễn phí sau khi khảo sát** đo đạc tận nơi. Anh/chị đặt lịch hoặc gọi hotline 0976 224 875 để được báo giá nhanh nhé.',
                en: 'Prices depend on size, materials and site conditions, so we give a **free quote after an on-site survey**. Book a survey or call 0976 224 875 for a quick quote.',
                zh: '价格取决于尺寸、材料和现场情况，因此我们在**上门勘察后免费报价**。请预约或致电 0976 224 875 快速获取报价。'
            },
            hanhDong: ['datLich', 'goi', 'batDauLai']
        },
        'tl-bao-hanh': {
            chu: {
                vi: 'Sản phẩm được bảo hành theo chính sách của công ty, thời hạn cụ thể ghi rõ trong báo giá và hợp đồng cho từng hạng mục. Trong quá trình sử dụng có vấn đề cứ gọi hotline để được hỗ trợ.',
                en: 'Products are covered under our company warranty policy; the exact terms for each item are stated in the quote and contract. Call our hotline any time you need support.',
                zh: '产品按公司保修政策提供保修，具体期限在每项报价和合同中写明。使用中如有问题，请随时致电热线。'
            },
            hanhDong: ['goi', 'batDauLai']
        },
        'tl-khu-vuc': {
            chu: {
                vi: 'Công ty khảo sát và thi công tại **Tây Ninh** và các khu vực lân cận. Anh/chị cho biết địa chỉ khi đặt lịch, kỹ thuật viên sẽ liên hệ xác nhận.',
                en: 'We survey and install in **Tây Ninh** and nearby areas. Give us your address when booking and our technician will confirm.',
                zh: '我们在**西宁省（Tây Ninh）**及周边地区勘察施工。预约时请提供地址，技术人员会与您确认。'
            },
            hanhDong: ['datLich', 'goi', 'batDauLai']
        },
        'tl-dia-chi': {
            chu: {
                vi: 'Công ty TNHH Cơ Khí Tiếu Nghĩa – 12 Ấp An Thuận, xã An Ninh, tỉnh Tây Ninh. Giờ làm việc 8:00 – 17:00, thứ Hai đến Chủ nhật. Hotline 0976 224 875.',
                en: 'Tiếu Nghĩa Mechanical Co., Ltd – 12 An Thuận Hamlet, An Ninh Commune, Tây Ninh. Open 8:00 – 17:00, Monday to Sunday. Hotline 0976 224 875.',
                zh: 'Tiếu Nghĩa 机械有限公司 – 西宁省安宁乡安顺邑12号。营业时间：周一至周日 8:00 – 17:00。热线 0976 224 875。'
            },
            hanhDong: ['goi', 'zalo', 'batDauLai'], banDo: true
        },
        'tl-eps-pu': {
            chu: {
                vi: '**EPS** (xốp) nhẹ, tiết kiệm chi phí, hợp nhà trọ, nhà tạm. **PU** cách nhiệt, cách âm tốt hơn, hợp nhà ở, văn phòng, kho lạnh. Kỹ thuật viên sẽ tư vấn loại và độ dày phù hợp.',
                en: '**EPS** foam is light and economical – good for rental rooms and temporary buildings. **PU** insulates heat and sound better – good for homes, offices and cold rooms. We will advise the right type and thickness.',
                zh: '**EPS**泡沫板轻便经济，适合出租屋和临时建筑。**PU**板隔热隔音更好，适合住宅、办公室和冷库。技术人员会推荐合适的类型和厚度。'
            },
            hanhDong: ['3d', 'datLich', 'batDauLai']
        },
        'tl-xingfa': {
            chu: {
                vi: 'Công ty làm cả **Xingfa nhập khẩu** (thanh nhôm dày, bền, cao cấp) và **Xingfa Việt Nam** (giá mềm hơn, vẫn chắc chắn). Kỹ thuật viên sẽ tư vấn theo vị trí lắp và ngân sách.',
                en: 'We offer both **imported Xingfa** (thicker, more durable, premium) and **Vietnam Xingfa** (more affordable, still sturdy). We will advise based on location and budget.',
                zh: '我们提供**进口兴发**（型材更厚、更耐用、高端）和**越南兴发**（价格更实惠、依然牢固）。技术人员会根据安装位置和预算推荐。'
            },
            nhom: 'cua-nhom', hanhDong: ['datLich', 'goi', 'batDauLai']
        },
        'tl-thoi-gian': {
            chu: {
                vi: 'Thời gian gia công và lắp đặt **tùy quy mô công trình**, công ty sẽ báo cụ thể sau khi khảo sát. Anh/chị có thể theo dõi tiến độ trực tuyến bằng mã lịch.',
                en: 'Fabrication and installation time **depends on the project size**; we will give exact timing after the survey. You can track progress online with your booking code.',
                zh: '加工和安装时间**取决于工程规模**，勘察后我们会告知具体时间。您可用预约码在线查询进度。'
            },
            hanhDong: ['datLich', 'batDauLai']
        },
        'tl-tien-do': {
            chu: {
                vi: 'Sau khi đặt lịch, anh/chị nhận **mã lịch** (vd TN-4821). Vào trang "Đặt lịch & Tiến độ" → tab "Tra cứu", nhập mã + số điện thoại để xem từng bước: khảo sát, báo giá, gia công, lắp đặt, bàn giao.',
                en: 'After booking you receive a **booking code** (e.g. TN-4821). Open "Booking & Progress" → "Track progress", enter the code and phone number to follow each step.',
                zh: '预约后您将获得**预约码**（如 TN-4821）。进入“预约与进度”→“查询进度”，输入预约码和电话即可查看每个步骤。'
            },
            hanhDong: ['datLich', 'batDauLai']
        },
        'tl-dat-lich': {
            chu: {
                vi: 'Khảo sát, đo đạc tận nơi **miễn phí**. Anh/chị bấm "Đặt lịch khảo sát", chọn ngày và buổi, sau khi gửi sẽ nhận mã lịch để theo dõi tiến độ.',
                en: 'On-site survey and measurement are **free**. Press "Book a survey", choose a date and time slot, and you will get a code to track progress.',
                zh: '上门勘察测量**免费**。点击“预约勘察”，选择日期和时段，提交后即可获得预约码查询进度。'
            },
            hanhDong: ['datLich', 'goi', 'batDauLai']
        },
        'khong-hieu': {
            chu: {
                vi: 'Xin lỗi, mình chưa hiểu rõ câu hỏi 🙏 Anh/chị gọi hotline 0976 224 875 hoặc nhắn Zalo để được tư vấn trực tiếp, hoặc chọn một chủ đề bên dưới.',
                en: 'Sorry, I did not quite understand 🙏 Please call 0976 224 875 or message us on Zalo for direct advice, or pick a topic below.',
                zh: '抱歉，我没太明白您的问题 🙏 请致电 0976 224 875 或通过 Zalo 联系我们直接咨询，或选择下方话题。'
            },
            hanhDong: ['goi', 'zalo'], nut: ['cua', 'panel', 'maiTuBep', 'baoTri', 'thongTin']
        }
    },

    // Từ khóa viết KHÔNG DẤU (tiếng Việt) hoặc nguyên văn (tiếng Anh, tiếng Trung). Mục đứng trước được ưu tiên.
    TU_KHOA: [
        { tu: ['gia', 'bao nhieu tien', 'bao nhieu', 'chi phi', 'bao gia', 'price', 'cost', 'how much', 'quote', '价格', '多少钱', '报价', '费用'], toi: 'tl-gia' },
        { tu: ['bao hanh', 'warranty', 'guarantee', '保修', '质保'], toi: 'tl-bao-hanh' },
        { tu: ['tien do', 'ma lich', 'tra cuu', 'track', 'progress', 'status', '进度', '查询'], toi: 'tl-tien-do' },
        { tu: ['dat lich', 'hen lich', 'khaosat', 'mien phi', 'book', 'booking', 'survey', 'appointment', '预约', '勘察', '免费'], toi: 'tl-dat-lich' },
        { tu: ['bao lau', 'mat bao lau', 'thoi gian thicong', 'may ngay', 'how long', 'duration', 'lead time', '多久', '几天', '工期'], toi: 'tl-thoi-gian' },
        { tu: ['dia chi', 'o dau', 'gio lam', 'mo cua', 'address', 'where', 'opening hours', 'location', '地址', '在哪', '营业时间'], toi: 'tl-dia-chi' },
        { tu: ['khu vuc', 'tinh nao', 'co lam o', 'co nhan', 'service area', 'do you serve', 'area', '范围', '地区', '施工区域'], toi: 'tl-khu-vuc' },
        { tu: ['eps', 'pu', 'xop', 'cach nhiet', 'insulation', '隔热', '泡沫'], toi: 'tl-eps-pu' },
        { tu: ['nhap khau', 'xingfa viet nam', 'xingfa vn', 'imported', 'genuine xingfa', '进口', '越南兴发'], toi: 'tl-xingfa' },
        { tu: ['nha tro', 'phong tro', 'rental', '出租'], toi: 'kq-panel-tro' },
        { tu: ['kho', 'xuong', 'nha xuong', 'warehouse', 'workshop', 'factory', '仓库', '厂房'], toi: 'kq-panel-kho' },
        { tu: ['van phong', 'office', '办公'], toi: 'kq-panel-vp' },
        { tu: ['homestay', 'nha o', '民宿', '住宅'], toi: 'kq-panel-o' },
        { tu: ['panel', 'lap rap', 'nha lap ghep', 'tien che', 'prefab', 'container', '夹芯板', '板房', '装配'], toi: 'hoi-panel' },
        { tu: ['tu bep', 'noi that', 'kitchen', 'cabinet', 'furniture', 'wardrobe', '橱柜', '厨房', '家具', '衣柜'], toi: 'kq-tu-bep' },
        { tu: ['mai che', 'mai ton', 'mai hien', 'nha xe', 'canopy', 'awning', 'carport', 'roof', '雨棚', '车棚', '屋顶'], toi: 'kq-mai-che' },
        { tu: ['kinh', 'cuong luc', 'glass', 'tempered', '玻璃', '钢化'], toi: 'kq-cua-kinh' },
        { tu: ['nhom', 'xingfa', 'aluminium', 'aluminum', 'window', '铝', '兴发', '窗'], toi: 'hoi-loai-nhom' },
        { tu: ['sat', 'cong', 'lan can', 'cau thang', 'hang rao', 'steel', 'iron', 'gate', 'railing', 'stair', 'fence', '铁', '大门', '栏杆', '楼梯'], toi: 'kq-cua-sat' },
        { tu: ['sua', 'bao tri', 'hong', 'thay', 'repair', 'fix', 'broken', 'maintenance', '维修', '保养', '坏'], toi: 'hoi-bao-tri' },
        { tu: ['cua', 'door', '门'], toi: 'hoi-cua' },
        { tu: ['xin chao', 'chao', 'alo', 'hello', 'hi', 'hey', '你好', '您好'], toi: 'chao' }
    ]
};
