# 📦 HỆ THỐNG QUẢN LÝ SẢN PHẨM (PRODUCT MANAGEMENT SYSTEM)
### Bài Kiểm Tra Cuối Module: Phát Triển Ứng Dụng Web với JSP & Servlet

---

## 🌟 1. GIỚI THIỆU TỔNG QUAN
Dự án được xây dựng dựa trên kiến trúc **MVC (Model - View - Controller)** chuẩn cho nền tảng **Java Web (Servlet & JSP)** kết hợp với **JDBC** và cơ sở dữ liệu **MySQL**. Hệ thống cung cấp đầy đủ các tính năng quản lý sản phẩm (CRUD) với giao diện người dùng **Glassmorphic** hiện đại, mượt mà và trực quan.

---

## ✨ 2. CÁC TÍNH NĂNG CHÍNH
- 📊 **Dashboard Thống Kê KPI (Bonus):** Hiển thị tổng số lượng sản phẩm, tổng giá trị tài sản kho hàng ($) và số sản phẩm sắp hết hàng (< 10 sản phẩm).
- 📋 **Hiển Thị Danh Sách Sản Phẩm:** Liệt kê toàn bộ sản phẩm dưới dạng bảng với thông tin ID, Tên, Giá, Số lượng và Badge trạng thái tồn kho.
- ➕ **Thêm Sản Phẩm Mới:** Biểu mẫu cho phép nhập Tên sản phẩm, Giá và Số lượng có kiểm tra dữ liệu đầu vào (Form Validation).
- ✏️ **Sửa Thông Tin Sản Phẩm:** Chọn sản phẩm từ danh sách và cập nhật lại thông tin (Form tự động điền sẵn dữ liệu cũ).
- 🗑️ **Xóa Sản Phẩm:** Hỗ trợ hộp thoại xác nhận xóa (Custom Animated Modal Dialog) trước khi thực thi lệnh xóa khỏi CSDL.
- 🔍 **Tìm Kiếm Sản Phẩm:** Tìm kiếm sản phẩm theo tên tức thì (Live client-side & server-side filter).
- 🔔 **Thông Báo Trạng Thái:** Toast notification hiển thị phản hồi ngay sau mỗi thao tác Thêm / Sửa / Xóa.

---

## 🛠️ 3. CÔNG NGHỆ SỬ DỤNG
- **Backend:** Java Servlet 4.0, Java standard (JDK 11/17)
- **Frontend:** JSP (JavaServer Pages), JSTL, HTML5, Vanilla CSS3 (Custom Glassmorphism & Animated Theme), FontAwesome 6
- **Database:** MySQL Server (Thông qua JDBC Driver `com.mysql.cj.jdbc.Driver`)
- **Quản lý dự án:** Apache Maven (`pom.xml`)
- **Web Server:** Apache Tomcat 9.x / 10.x

---

## 📁 4. CẤU TRÚC DỰ ÁN
```text
ProductManager/
├── pom.xml                                   # File cấu hình Maven Dependencies & Plugins
├── database.sql                              # Script khởi tạo Database & Dữ liệu mẫu CSDL
├── README.md                                 # Hướng dẫn chi tiết dự án
└── src/
    └── main/
        ├── java/
        │   └── com/
        │       └── productmanager/
        │           ├── model/
        │           │   └── Product.java      # Model Entity đại diện cho Sản phẩm
        │           ├── dao/
        │           │   └── ProductDAO.java   # Data Access Object xử lý CRUD với CSDL
        │           ├── utils/
        │           │   └── DBContext.java    # Xử lý kết nối JDBC MySQL
        │           └── controller/
        │               └── ProductServlet.java # Servlet điều hướng & xử lý các request
        └── webapp/
            ├── WEB-INF/
            │   └── web.xml                   # Cấu hình Web Application Deployment Descriptor
            ├── css/
            │   └── style.css                 # File giao diện CSS Glassmorphic
            ├── js/
            │   └── script.js                 # File xử lý sự kiện UI, Modal & Validation
            ├── views/
            │   ├── product-list.jsp          # Trang hiển thị danh sách sản phẩm & thống kê
            │   └── product-form.jsp          # Trang biểu mẫu Thêm / Sửa sản phẩm
            └── index.jsp                     # Trang chuyển hướng mặc định
```

---

## 🚀 5. HƯỚNG DẪN CÀI ĐẶT VÀ CHẠY DỰ ÁN

### Bước 1: Khởi tạo Cơ sở dữ liệu MySQL
1. Mở **MySQL Workbench**, **phpMyAdmin** hoặc MySQL Command Line Client.
2. Mở file `database.sql` đi kèm trong dự án và thực thi toàn bộ script.
3. Script sẽ tự động:
   - Tạo cơ sở dữ liệu `product_db`.
   - Tạo bảng `products` gồm các cột `id`, `name`, `price`, `quantity`.
   - Chèn sẵn 8 sản phẩm mẫu để phục vụ việc kiểm thử.

### Bước 2: Cấu hình Kết nối CSDL trong Dự án
Mở file `src/main/java/com/productmanager/utils/DBContext.java` và chỉnh sửa các thông số theo môi trường MySQL local của bạn (nếu có thay đổi):
```java
private static final String DB_HOST = "localhost";
private static final String DB_PORT = "3306";
private static final String DB_NAME = "product_db";
private static final String DB_USER = "root";     // Username MySQL của bạn
private static final String DB_PASS = "root";     // Mật khẩu MySQL của bạn
```

### Bước 3: Biên dịch và Chạy ứng dụng trên Apache Tomcat
#### Cách A: Sử dụng Eclipse / IntelliJ IDEA / NetBeans (Khuyên dùng)
1. Chọn **Open Project / Import Existing Maven Project** và trỏ đến thư mục chứa nguồn dự án.
2. Thêm **Apache Tomcat Server** vào môi trường IDE.
3. Nhấp chuột phải vào dự án -> **Run As** -> **Run on Server** (Chọn Apache Tomcat).
4. Truy cập trình duyệt qua địa chỉ: `http://localhost:8080/ProductManager/`

#### Cách B: Build file WAR đóng gói thủ công
1. Chạy lệnh Maven đóng gói dự án:
   ```bash
   mvn clean package
   ```
2. File `ProductManager.war` sẽ được sinh ra trong thư mục `target/`.
3. Copy file `ProductManager.war` thả vào thư mục `webapps/` của Apache Tomcat.
4. Khởi động Tomcat (`bin/startup.bat`) và truy cập `http://localhost:8080/ProductManager/`.

---

## 📝 6. FILE NỘP BÀI KIỂM TRA
File zip đã được đóng gói chuẩn cấu trúc chứa toàn bộ mã nguồn + file SQL:
- Tên file zip: `[Mã_số_sinh_viên]_FinalExam.zip` (Hoặc `ProductManager_FinalExam.zip`).
