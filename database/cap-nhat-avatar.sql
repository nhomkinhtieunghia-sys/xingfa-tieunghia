-- Thêm cột ảnh minh họa vào bảng đánh giá
ALTER TABLE danh_gia ADD COLUMN IF NOT EXISTS anh_minh_hoa text;

-- Gắn 3 ảnh MINH HỌA (tạo bằng AI, không phải ảnh thật của khách) cho 3 đánh giá thật lấy từ website công ty
UPDATE danh_gia SET anh_minh_hoa = 'assets/images/avatar-minh-hoa-1.jpg' WHERE ho_ten = 'Chú 9';
UPDATE danh_gia SET anh_minh_hoa = 'assets/images/avatar-minh-hoa-2.jpg' WHERE ho_ten = 'Hồ Văn Luân';
UPDATE danh_gia SET anh_minh_hoa = 'assets/images/avatar-minh-hoa-3.jpg' WHERE ho_ten = 'Chị 7';
