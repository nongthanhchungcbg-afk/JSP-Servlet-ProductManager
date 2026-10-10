<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/javaee" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hệ Thống Quản Lý Sản Phẩm | Final Exam</title>
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
                <a href="${pageContext.request.contextPath}/products?action=new" class="btn btn-primary">
                    <i class="fa-solid fa-plus"></i> Thêm sản phẩm mới
                </a>
            </div>
        </div>
    </nav>

    <!-- MAIN CONTAINER -->
    <main class="app-container">

        <!-- TOAST NOTIFICATION -->
        <c:if test="${not empty param.msg}">
            <div id="toast" class="toast-container">
                <div class="toast ${param.type == 'error' ? 'toast-error' : 'toast-success'}">
                    <i class="fa-solid ${param.type == 'error' ? 'fa-circle-exclamation' : 'fa-circle-check'}" 
                       style="color: ${param.type == 'error' ? 'var(--accent-rose)' : 'var(--accent-emerald)'}; font-size: 18px;"></i>
                    <span><c:out value="${param.msg}" /></span>
                </div>
            </div>
        </c:if>

        <!-- ANALYTICS DASHBOARD STATS CARDS -->
        <section class="stats-grid">
            <div class="stat-card">
                <div class="stat-info">
                    <h3>Tổng số sản phẩm</h3>
                    <div class="stat-value"><c:out value="${totalCount != null ? totalCount : 0}" /></div>
                </div>
                <div class="stat-icon icon-blue">
                    <i class="fa-solid fa-box-archive"></i>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-info">
                    <h3>Tổng giá trị kho hàng</h3>
                    <div class="stat-value">
                        $<fmt:formatNumber value="${totalValue != null ? totalValue : 0}" pattern="#,##0.00" />
                    </div>
                </div>
                <div class="stat-icon icon-emerald">
                    <i class="fa-solid fa-sack-dollar"></i>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-info">
                    <h3>Sản phẩm sắp hết hàng</h3>
                    <div class="stat-value"><c:out value="${lowStockCount != null ? lowStockCount : 0}" /></div>
                </div>
                <div class="stat-icon icon-amber">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                </div>
            </div>
        </section>

        <!-- CONTROLS BAR: SEARCH & FILTER -->
        <section class="controls-bar">
            <form action="${pageContext.request.contextPath}/products" method="get" class="search-box">
                <input type="hidden" name="action" value="list">
                <i class="fa-solid fa-magnifying-glass search-icon"></i>
                <input type="text" id="tableSearch" name="q" class="search-input" 
                       placeholder="Tìm kiếm sản phẩm theo tên..." 
                       value="${searchQuery != null ? searchQuery : ''}">
            </form>
            <div style="font-size: 13px; color: var(--text-secondary);">
                Hiển thị <strong><c:out value="${listProducts.size()}" /></strong> sản phẩm
            </div>
        </section>

        <!-- PRODUCT LIST DATA TABLE -->
        <section class="table-card">
            <div class="table-wrapper">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th style="width: 80px;">ID</th>
                            <th>Tên Sản Phẩm</th>
                            <th style="width: 160px;">Đơn Giá ($)</th>
                            <th style="width: 140px;">Số Lượng</th>
                            <th style="width: 160px;">Trạng Thái Kho</th>
                            <th style="width: 160px; text-align: right;">Thao Tác</th>
                        </tr>
                    </thead>
                    <tbody id="productTableBody">
                        <c:choose>
                            <c:when test="${not empty listProducts}">
                                <c:forEach var="prod" items="${listProducts}">
                                    <tr>
                                        <td class="product-id">#<c:out value="${prod.id}" /></td>
                                        <td class="product-name">
                                            <span class="product-title"><c:out value="${prod.name}" /></span>
                                        </td>
                                        <td class="product-price">
                                            $<fmt:formatNumber value="${prod.price}" pattern="#,##0.00" />
                                        </td>
                                        <td>
                                            <strong style="font-size: 15px;"><c:out value="${prod.quantity}" /></strong>
                                        </td>
                                        <td>
                                            <span class="badge ${prod.stockBadgeClass}">
                                                <c:out value="${prod.stockStatusText}" />
                                            </span>
                                        </td>
                                        <td style="text-align: right;">
                                            <div class="action-buttons" style="justify-content: flex-end;">
                                                <a href="${pageContext.request.contextPath}/products?action=edit&id=${prod.id}" 
                                                   class="btn btn-secondary btn-sm" title="Chỉnh sửa">
                                                    <i class="fa-solid fa-pen-to-square"></i> Sửa
                                                </a>
                                                <button type="button" 
                                                        onclick="confirmDelete(${prod.id}, '<c:out value="${prod.name}" />')" 
                                                        class="btn btn-danger btn-sm" title="Xóa">
                                                    <i class="fa-solid fa-trash-can"></i> Xóa
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                </c:forEach>
                            </c:when>
                            <c:otherwise>
                                <tr>
                                    <td colspan="6">
                                        <div class="empty-state">
                                            <div class="empty-icon"><i class="fa-solid fa-box-open"></i></div>
                                            <h4>Chưa có sản phẩm nào</h4>
                                            <p>Không tìm thấy sản phẩm phù hợp trong cơ sở dữ liệu.</p>
                                        </div>
                                    </td>
                                </tr>
                            </c:otherwise>
                        </c:choose>
                    </tbody>
                </table>
            </div>
        </section>

        <!-- FOOTER -->
        <footer class="app-footer">
            <p>Bài Kiểm Tra Cuối Module - Phát Triển Ứng Dụng Web với JSP &amp; Servlet</p>
        </footer>

    </main>

    <!-- CONFIRMATION MODAL FOR DELETION -->
    <div id="deleteModal" class="modal-overlay">
        <div class="modal-card">
            <div class="modal-icon">
                <i class="fa-solid fa-triangle-exclamation"></i>
            </div>
            <h3 class="modal-title">Xác nhận xóa sản phẩm</h3>
            <p class="modal-text">
                Bạn có chắc chắn muốn xóa sản phẩm <strong id="deleteProductName" style="color: var(--text-primary);"></strong> khỏi hệ thống? Hành động này không thể hoàn tác!
            </p>
            <div class="modal-actions">
                <button type="button" class="btn btn-secondary" onclick="closeDeleteModal()">Hủy bỏ</button>
                <button type="button" class="btn btn-danger" onclick="executeDelete()">
                    <i class="fa-solid fa-trash-can"></i> Xác Nhận Xóa
                </button>
            </div>
        </div>
    </div>

    <!-- Custom JS -->
    <script src="${pageContext.request.contextPath}/js/script.js"></script>
</body>
</html>
