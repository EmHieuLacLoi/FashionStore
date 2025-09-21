# HỆ THỐNG QUẢN LÝ CỬA HÀNG THỜI TRANG (FASHION STORE)
# Đồ án tốt nghiệp của Hiếu

# 1. Giới thiệu
Đồ án này được thực hiện nhằm xây dựng một hệ thống quản lý cửa hàng thời trang trực tuyến với đầy đủ các chức năng cần thiết cho người dùng và quản trị viên.

Hệ thống bao gồm hai phần chính:

* Ứng dụng Web (Frontend): Giao diện tương tác dành cho khách hàng và quản trị viên.

* Hệ thống API (Backend): Cung cấp các dịch vụ và xử lý logic, dữ liệu.

# 2. Demo trực tuyến
* Web Application (Frontend): https://fashion-store.emhieulacloi.io.vn

* RESTful API (Backend): https://api.emhieulacloi.io.vn

# 3. Công nghệ sử dụng
* Backend (API)
   - Framework: Java Spring Boot

   - Security: Spring Security (JWT Authentication)

   - Database: Spring Data JPA, Hibernate, MySQL

   - Migration: Liquibase (Quản lý và versioning schema cơ sở dữ liệu)

   - Deployment: Docker & Docker Compose

   - Proxy: Nginx Reverse Proxy

* Frontend (App)
   - Framework/Library: React + TypeScript

   - UI: Ant Design

   - State Management: React Query

   - Styling: TailwindCSS / SCSS

   - Multi-language: i18next

* DevOps & Triển khai

   - Container Registry: Docker Hub

* Server: VPS Ubuntu

* Proxy & SSL: Nginx Proxy Manager & Let’s Encrypt

# 4. Chức năng chính
* Người dùng (Customer)
   - Xác thực: Đăng ký, đăng nhập (Username/Password).

   - Sản phẩm: Xem, tìm kiếm, và lọc sản phẩm theo danh mục.

   - Giỏ hàng: Thêm sản phẩm vào giỏ hàng.

   - Thanh toán: Quy trình thanh toán.

   - Tài khoản: Quản lý thông tin tài khoản cá nhân.

* Quản trị viên (Admin)
   - Quản lý người dùng: CRUD thông tin người dùng.

   - Quản lý sản phẩm: Thêm, sửa, xóa sản phẩm và danh mục.

   - Quản lý đơn hàng: Xem và cập nhật trạng thái đơn hàng.

   - Phân quyền: Quản lý vai trò (Admin / User).

# 5. Cấu trúc dự án
fashion-store/


├── fashion-store-api/      # Backend Spring Boot


└── fashion-store-app/      # Frontend React

# 6. Tác giả
Sinh viên thực hiện: Võ Trung Hiếu – EmHieuLacLoi
