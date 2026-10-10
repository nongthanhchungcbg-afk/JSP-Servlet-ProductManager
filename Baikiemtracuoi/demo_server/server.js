const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const querystring = require('querystring');

const PORT = 8080;

// Initial products dataset from database.sql
let products = [
    { id: 1, name: 'iPhone 15 Pro Max 256GB', price: 1299.99, quantity: 15 },
    { id: 2, name: 'MacBook Pro M3 Max 16-inch', price: 2499.00, quantity: 8 },
    { id: 3, name: 'Tai nghe Sony WH-1000XM5', price: 349.50, quantity: 25 },
    { id: 4, name: 'Chuột không dây Logitech MX Master 3S', price: 99.00, quantity: 42 },
    { id: 5, name: 'Bàn phím cơ Keychron K2 V2 Pro', price: 119.00, quantity: 18 },
    { id: 6, name: 'Màn hình Dell UltraSharp U2723QE 4K', price: 579.00, quantity: 5 },
    { id: 7, name: 'Tai nghe Apple AirPods Pro Gen 2', price: 249.00, quantity: 30 },
    { id: 8, name: 'Máy tính bảng iPad Air M2 11-inch', price: 699.00, quantity: 4 }
];

let nextId = 9;

// Helper: Format Currency
function formatCurrency(amount) {
    return '$' + Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Helper: Get stock badge class and status text
function getStockBadgeInfo(quantity) {
    if (quantity === 0) {
        return { badgeClass: 'badge-out-of-stock', text: 'Hết hàng' };
    } else if (quantity < 10) {
        return { badgeClass: 'badge-low-stock', text: `Sắp hết (${quantity})` };
    } else {
        return { badgeClass: 'badge-in-stock', text: `Còn hàng (${quantity})` };
    }
}

// Render Header & Layout
function renderHeader(title) {
    return `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} | Final Exam Demo Server</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <link rel="stylesheet" href="/css/style.css">
</head>
<body>
    <nav class="navbar">
        <div class="app-container navbar-content">
            <a href="/products" class="brand-logo">
                <div class="logo-icon">
                    <i class="fa-solid fa-boxes-stacked"></i>
                </div>
                <div>
                    <div class="brand-title">ProductManager</div>
                    <span class="brand-tag">JSP & Servlet Exam Demo</span>
                </div>
            </a>
            <div>
                <a href="/products?action=new" class="btn btn-primary">
                    <i class="fa-solid fa-plus"></i> Thêm sản phẩm mới
                </a>
            </div>
        </div>
    </nav>
    <main class="app-container">`;
}

function renderFooter() {
    return `
        <footer class="app-footer">
            <p>Bài Kiểm Tra Cuối Module - Phát Triển Ứng Dụng Web với JSP &amp; Servlet (Demo Live Server)</p>
        </footer>
    </main>
    <script src="/js/script.js"></script>
</body>
</html>`;
}

// Render Toast Notification
function renderToast(msg, type) {
    if (!msg) return '';
    const isError = type === 'error';
    const iconClass = isError ? 'fa-circle-exclamation' : 'fa-circle-check';
    const iconColor = isError ? 'var(--accent-rose)' : 'var(--accent-emerald)';
    const toastClass = isError ? 'toast-error' : 'toast-success';
    
    return `
    <div id="toast" class="toast-container">
        <div class="toast ${toastClass}">
            <i class="fa-solid ${iconClass}" style="color: ${iconColor}; font-size: 18px;"></i>
            <span>${escapeHtml(msg)}</span>
        </div>
    </div>`;
}

function escapeHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Route Handlers
function handleListProducts(req, res, query) {
    const searchQuery = query.q ? query.q.trim().toLowerCase() : '';
    const msg = query.msg || '';
    const msgType = query.type || 'success';

    let filtered = products;
    if (searchQuery) {
        filtered = products.filter(p => p.name.toLowerCase().includes(searchQuery));
    }

    const totalCount = products.length;
    const totalValue = products.reduce((acc, p) => acc + (p.price * p.quantity), 0);
    const lowStockCount = products.filter(p => p.quantity < 10).length;

    let rowsHtml = '';
    if (filtered.length > 0) {
        filtered.forEach(p => {
            const stock = getStockBadgeInfo(p.quantity);
            rowsHtml += `
            <tr>
                <td class="product-id">#${p.id}</td>
                <td class="product-name">
                    <span class="product-title">${escapeHtml(p.name)}</span>
                </td>
                <td class="product-price">${formatCurrency(p.price)}</td>
                <td><strong style="font-size: 15px;">${p.quantity}</strong></td>
                <td><span class="badge ${stock.badgeClass}">${stock.text}</span></td>
                <td style="text-align: right;">
                    <div class="action-buttons" style="justify-content: flex-end;">
                        <a href="/products?action=edit&id=${p.id}" class="btn btn-secondary btn-sm" title="Chỉnh sửa">
                            <i class="fa-solid fa-pen-to-square"></i> Sửa
                        </a>
                        <button type="button" onclick="confirmDelete(${p.id}, '${escapeHtml(p.name).replace(/'/g, "\\'")}')" class="btn btn-danger btn-sm" title="Xóa">
                            <i class="fa-solid fa-trash-can"></i> Xóa
                        </button>
                    </div>
                </td>
            </tr>`;
        });
    } else {
        rowsHtml = `
        <tr>
            <td colspan="6">
                <div class="empty-state">
                    <div class="empty-icon"><i class="fa-solid fa-box-open"></i></div>
                    <h4>Chưa có sản phẩm nào</h4>
                    <p>Không tìm thấy sản phẩm phù hợp trong cơ sở dữ liệu.</p>
                </div>
            </td>
        </tr>`;
    }

    const html = renderHeader('Danh Sách Sản Phẩm') + `
        ${renderToast(msg, msgType)}
        
        <section class="stats-grid">
            <div class="stat-card">
                <div class="stat-info">
                    <h3>Tổng số sản phẩm</h3>
                    <div class="stat-value">${totalCount}</div>
                </div>
                <div class="stat-icon icon-blue"><i class="fa-solid fa-box-archive"></i></div>
            </div>
            <div class="stat-card">
                <div class="stat-info">
                    <h3>Tổng giá trị kho hàng</h3>
                    <div class="stat-value">${formatCurrency(totalValue)}</div>
                </div>
                <div class="stat-icon icon-emerald"><i class="fa-solid fa-sack-dollar"></i></div>
            </div>
            <div class="stat-card">
                <div class="stat-info">
                    <h3>Sản phẩm sắp hết hàng</h3>
                    <div class="stat-value">${lowStockCount}</div>
                </div>
                <div class="stat-icon icon-amber"><i class="fa-solid fa-triangle-exclamation"></i></div>
            </div>
        </section>

        <section class="controls-bar">
            <form action="/products" method="get" class="search-box">
                <input type="hidden" name="action" value="list">
                <i class="fa-solid fa-magnifying-glass search-icon"></i>
                <input type="text" id="tableSearch" name="q" class="search-input" 
                       placeholder="Tìm kiếm sản phẩm theo tên..." value="${escapeHtml(query.q || '')}">
            </form>
            <div style="font-size: 13px; color: var(--text-secondary);">
                Hiển thị <strong>${filtered.length}</strong> sản phẩm
            </div>
        </section>

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
                        ${rowsHtml}
                    </tbody>
                </table>
            </div>
        </section>

        <div id="deleteModal" class="modal-overlay">
            <div class="modal-card">
                <div class="modal-icon"><i class="fa-solid fa-triangle-exclamation"></i></div>
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
    ` + renderFooter();

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
}

function handleProductForm(req, res, query) {
    const isEdit = query.action === 'edit';
    let product = null;

    if (isEdit && query.id) {
        product = products.find(p => p.id === parseInt(query.id));
        if (!product) {
            res.writeHead(302, { 'Location': '/products?msg=' + encodeURIComponent('Sản phẩm không tồn tại!') + '&type=error' });
            return res.end();
        }
    }

    const pageTitle = isEdit ? 'Sửa Thông Tin Sản Phẩm' : 'Thêm Sản Phẩm Mới';
    const formAction = isEdit ? 'update' : 'insert';

    const html = renderHeader(pageTitle) + `
        <div class="form-card">
            <div class="form-header">
                <h2>
                    ${isEdit ? '<i class="fa-solid fa-pen-to-square" style="color: var(--primary);"></i> Chỉnh Sửa Sản Phẩm' 
                             : '<i class="fa-solid fa-square-plus" style="color: var(--accent-emerald);"></i> Thêm Sản Phẩm Mới'}
                </h2>
                <p>
                    ${isEdit ? `Cập nhật thông tin chi tiết cho sản phẩm ID <strong>#${product.id}</strong>`
                             : 'Nhập đầy đủ thông tin bên dưới để khởi tạo sản phẩm mới trong cơ sở dữ liệu.'}
                </p>
            </div>

            <form action="/products" method="post" onsubmit="return validateProductForm()">
                <input type="hidden" name="action" value="${formAction}">
                ${isEdit ? `<input type="hidden" name="id" value="${product.id}">` : ''}

                <div class="form-group">
                    <label for="productName" class="form-label">Tên sản phẩm <span style="color: var(--accent-rose);">*</span></label>
                    <input type="text" id="productName" name="name" class="form-input" 
                           placeholder="Ví dụ: Laptop Dell XPS 15..." 
                           value="${product ? escapeHtml(product.name) : ''}" required>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="productPrice" class="form-label">Đơn giá ($ USD) <span style="color: var(--accent-rose);">*</span></label>
                        <input type="number" id="productPrice" name="price" step="0.01" min="0" class="form-input" 
                               placeholder="0.00" value="${product ? product.price : ''}" required>
                    </div>

                    <div class="form-group">
                        <label for="productQuantity" class="form-label">Số lượng trong kho <span style="color: var(--accent-rose);">*</span></label>
                        <input type="number" id="productQuantity" name="quantity" min="0" class="form-input" 
                               placeholder="0" value="${product ? product.quantity : ''}" required>
                    </div>
                </div>

                <div class="form-actions">
                    <a href="/products" class="btn btn-secondary">Hủy bỏ</a>
                    <button type="submit" class="btn btn-primary">
                        ${isEdit ? '<i class="fa-solid fa-floppy-disk"></i> Lưu Cập Nhật' 
                                 : '<i class="fa-solid fa-plus"></i> Thêm Sản Phẩm'}
                    </button>
                </div>
            </form>
        </div>
    ` + renderFooter();

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
}

// Server Request Dispatcher
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;

    // Serve Static Files from src/main/webapp
    if (pathname.startsWith('/css/') || pathname.startsWith('/js/')) {
        const filePath = path.join(__dirname, '../src/main/webapp', pathname);
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('File not found');
            } else {
                const ext = path.extname(filePath);
                const contentType = ext === '.css' ? 'text/css' : ext === '.js' ? 'application/javascript' : 'text/plain';
                res.writeHead(200, { 'Content-Type': contentType + '; charset=utf-8' });
                res.end(data);
            }
        });
        return;
    }

    // Redirect root to /products
    if (pathname === '/' || pathname === '') {
        res.writeHead(302, { 'Location': '/products' });
        return res.end();
    }

    if (pathname === '/products') {
        if (req.method === 'GET') {
            const action = query.action || 'list';
            if (action === 'new' || action === 'edit') {
                handleProductForm(req, res, query);
            } else if (action === 'delete') {
                const id = parseInt(query.id);
                products = products.filter(p => p.id !== id);
                res.writeHead(302, { 'Location': '/products?msg=' + encodeURIComponent('Đã xóa sản phẩm khỏi cơ sở dữ liệu!') + '&type=success' });
                res.end();
            } else {
                handleListProducts(req, res, query);
            }
        } else if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => body += chunk.toString());
            req.on('end', () => {
                const postData = querystring.parse(body);
                const action = postData.action;

                if (action === 'insert') {
                    const newProd = {
                        id: nextId++,
                        name: postData.name.trim(),
                        price: parseFloat(postData.price) || 0,
                        quantity: parseInt(postData.quantity) || 0
                    };
                    products.unshift(newProd);
                    res.writeHead(302, { 'Location': '/products?msg=' + encodeURIComponent('Thêm sản phẩm thành công!') + '&type=success' });
                    res.end();
                } else if (action === 'update') {
                    const id = parseInt(postData.id);
                    const prod = products.find(p => p.id === id);
                    if (prod) {
                        prod.name = postData.name.trim();
                        prod.price = parseFloat(postData.price) || 0;
                        prod.quantity = parseInt(postData.quantity) || 0;
                        res.writeHead(302, { 'Location': '/products?msg=' + encodeURIComponent('Cập nhật thông tin sản phẩm thành công!') + '&type=success' });
                    } else {
                        res.writeHead(302, { 'Location': '/products?msg=' + encodeURIComponent('Không tìm thấy sản phẩm!') + '&type=error' });
                    }
                    res.end();
                }
            });
        }
    } else {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>404 Not Found</h1><p><a href="/products">Quay lại danh sách sản phẩm</a></p>');
    }
});

server.listen(PORT, () => {
    console.log(`\n==================================================`);
    console.log(`🚀 DEMO SERVER DỰ ÁN JSP/SERVLET ĐANG CHẠY TẠI:`);
    console.log(`👉 http://localhost:${PORT}/products`);
    console.log(`==================================================\n`);
});
