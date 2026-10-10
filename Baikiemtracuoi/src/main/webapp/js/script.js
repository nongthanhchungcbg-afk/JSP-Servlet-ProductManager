/**
 * Product Management System - Client Side Interactive Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Auto-dismiss toast notifications after 4 seconds
    const toast = document.getElementById('toast');
    if (toast) {
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-20px)';
            toast.style.transition = 'all 0.4s ease';
            setTimeout(() => toast.remove(), 400);
        }, 4000);
    }

    // 2. Client-side instant live search filter on product table
    const tableSearch = document.getElementById('tableSearch');
    if (tableSearch) {
        tableSearch.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase().trim();
            const rows = document.querySelectorAll('#productTableBody tr');

            rows.forEach(row => {
                const nameCell = row.querySelector('.product-name');
                if (nameCell) {
                    const text = nameCell.textContent.toLowerCase();
                    if (text.includes(term)) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                }
            });
        });
    }
});

// 3. Delete Confirmation Modal Controller
let targetDeleteId = null;

function confirmDelete(id, name) {
    targetDeleteId = id;
    const modal = document.getElementById('deleteModal');
    const nameSpan = document.getElementById('deleteProductName');
    
    if (nameSpan) {
        nameSpan.textContent = name;
    }
    
    if (modal) {
        modal.classList.add('active');
    }
}

function closeDeleteModal() {
    const modal = document.getElementById('deleteModal');
    if (modal) {
        modal.classList.remove('active');
    }
    targetDeleteId = null;
}

function executeDelete() {
    if (targetDeleteId) {
        window.location.href = `products?action=delete&id=${targetDeleteId}`;
    }
}

// Close modal when clicking outside of modal card
window.addEventListener('click', (e) => {
    const modal = document.getElementById('deleteModal');
    if (e.target === modal) {
        closeDeleteModal();
    }
});

// 4. Client-side Form Validation
function validateProductForm() {
    const nameInput = document.getElementById('productName');
    const priceInput = document.getElementById('productPrice');
    const quantityInput = document.getElementById('productQuantity');

    if (!nameInput || !nameInput.value.trim()) {
        alert('Vui lòng nhập tên sản phẩm!');
        nameInput.focus();
        return false;
    }

    const price = parseFloat(priceInput.value);
    if (isNaN(price) || price <= 0) {
        alert('Giá sản phẩm phải là một số lớn hơn 0!');
        priceInput.focus();
        return false;
    }

    const quantity = parseInt(quantityInput.value);
    if (isNaN(quantity) || quantity < 0) {
        alert('Số lượng sản phẩm không được là số âm!');
        quantityInput.focus();
        return false;
    }

    return true;
}
