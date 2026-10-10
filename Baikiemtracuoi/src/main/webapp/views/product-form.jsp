<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/javaee" prefix="c" %>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>
        <c:choose>
            <c:when test="${product != null}">Sửa Thông Tin Sản Phẩm</c:when>
            <c:otherwise>Thêm Sản Phẩm Mới</c:otherwise>
        </c:choose> | Final Exam
    </title>
    <!-- Font Awesome Icons CDN -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <!-- Custom CSS -->
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/style.css">
</head>
<body>

    <!-- NAVBAR HEADER -->
    <nav class="navbar">
        <div class="app-container navbar-content">
            <a href="${pageContext.request.contextPath}/products" class="brand-logo">
                <div class="logo-icon">
                    <i class="fa-solid fa-boxes-stacked"></i>
                </div>
                <div>
                    <div class="brand-title">ProductManager</div>
                    <span class="brand-tag">JSP & Servlet Exam</span>
                </div>
            </a>
            <div>
                <a href="${pageContext.request.contextPath}/products" class="btn btn-secondary">
                    <i class="fa-solid fa-arrow-left"></i> Quay lại danh sách
                </a>
            </div>
        </div>
    </nav>

    <!-- FORM CONTAINER -->
    <main class="app-container">
        <div class="form-card">
            <div class="form-header">
                <h2>
                    <c:choose>
                        <c:when test="${product != null}">
                            <i class="fa-solid fa-pen-to-square" style="color: var(--primary);"></i> Chỉnh Sửa Sản Phẩm
                        </c:when>
                        <c:otherwise>
                            <i class="fa-solid fa-square-plus" style="color: var(--accent-emerald);"></i> Thêm Sản Phẩm Mới
                        </c:otherwise>
                    </c:choose>
                </h2>
                <p>
                    <c:choose>
                        <c:when test="${product != null}">
                            Cập nhật thông tin chi tiết cho sản phẩm ID <strong>#<c:out value="${product.id}" /></strong>
                        </c:when>
                        <c:otherwise>
                            Nhập đầy đủ thông tin bên dưới để khởi tạo sản phẩm mới trong cơ sở dữ liệu.
                        </c:otherwise>
                    </c:choose>
                </p>
            </div>

            <!-- FORM START -->
            <form action="${pageContext.request.contextPath}/products" 
                  method="post" 
                  onsubmit="return validateProductForm()">

                <c:choose>
                    <c:when test="${product != null}">
                        <input type="hidden" name="action" value="update">
                        <input type="hidden" name="id" value="<c:out value='${product.id}' />">
                    </c:when>
                    <c:otherwise>
                        <input type="hidden" name="action" value="insert">
                    </c:otherwise>
                </c:choose>

                <!-- TÊN SẢN PHẨM -->
                <div class="form-group">
                    <label for="productName" class="form-label">Tên sản phẩm <span style="color: var(--accent-rose);">*</span></label>
                    <input type="text" 
                           id="productName" 
                           name="name" 
                           class="form-input" 
                           placeholder="Ví dụ: Laptop Dell XPS 15..." 
                           value="<c:out value='${product != null ? product.name : ""}' />" 
                           required>
                </div>

                <div class="form-row">
                    <!-- GIÁ SẢN PHẨM -->
                    <div class="form-group">
                        <label for="productPrice" class="form-label">Đơn giá ($ USD) <span style="color: var(--accent-rose);">*</span></label>
                        <input type="number" 
                               id="productPrice" 
                               name="price" 
                               step="0.01" 
                               min="0" 
                               class="form-input" 
                               placeholder="0.00" 
                               value="<c:out value='${product != null ? product.price : ""}' />" 
                               required>
                    </div>

                    <!-- SỐ LƯỢNG -->
                    <div class="form-group">
                        <label for="productQuantity" class="form-label">Số lượng trong kho <span style="color: var(--accent-rose);">*</span></label>
                        <input type="number" 
                               id="productQuantity" 
                               name="quantity" 
                               min="0" 
                               class="form-input" 
                               placeholder="0" 
                               value="<c:out value='${product != null ? product.quantity : ""}' />" 
                               required>
                    </div>
                </div>

                <!-- FORM BUTTONS -->
                <div class="form-actions">
                    <a href="${pageContext.request.contextPath}/products" class="btn btn-secondary">Hủy bỏ</a>
                    <button type="submit" class="btn btn-primary">
                        <c:choose>
                            <c:when test="${product != null}">
                                <i class="fa-solid fa-floppy-disk"></i> Lưu Cập Nhật
                            </c:when>
                            <c:otherwise>
                                <i class="fa-solid fa-plus"></i> Thêm Sản Phẩm
                            </c:otherwise>
                        </c:choose>
                    </button>
                </div>
            </form>
        </div>
    </main>

    <!-- Custom JS -->
    <script src="${pageContext.request.contextPath}/js/script.js"></script>
</body>
</html>
