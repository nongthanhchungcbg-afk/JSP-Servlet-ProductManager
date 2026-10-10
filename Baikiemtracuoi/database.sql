-- =========================================================
-- BÀI KIỂM TRA CUỐI MODULE: PHÁT TRIỂN ỨNG DỤNG WEB JSP & SERVLET
-- CƠ SỞ DỮ LIỆU: QUẢN LÝ SẢN PHẨM (product_db)
-- =========================================================

-- 1. Tạo cơ sở dữ liệu (Nếu chưa tồn tại)
CREATE DATABASE IF NOT EXISTS product_db
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- 2. Chọn cơ sở dữ liệu để làm việc
USE product_db;

-- 3. Xóa bảng cũ nếu muốn làm sạch dữ liệu
DROP TABLE IF EXISTS products;

-- 4. Tạo bảng `products` theo đúng yêu cầu đề bài
-- Các cột: id (PRIMARY KEY, AUTO_INCREMENT), name, price, quantity
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DOUBLE NOT NULL CHECK (price >= 0),
    quantity INT NOT NULL CHECK (quantity >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Chèn dữ liệu mẫu ban đầu để kiểm thử ứng dụng
INSERT INTO products (name, price, quantity) VALUES
('iPhone 15 Pro Max 256GB', 1299.99, 15),
('MacBook Pro M3 Max 16-inch', 2499.00, 8),
('Tai nghe Sony WH-1000XM5', 349.50, 25),
('Chuột không dây Logitech MX Master 3S', 99.00, 42),
('Bàn phím cơ Keychron K2 V2 Pro', 119.00, 18),
('Màn hình Dell UltraSharp U2723QE 4K', 579.00, 5),
('Tai nghe Apple AirPods Pro Gen 2', 249.00, 30),
('Máy tính bảng iPad Air M2 11-inch', 699.00, 4);

-- 6. Truy vấn kiểm tra dữ liệu vừa khởi tạo
SELECT * FROM products;
