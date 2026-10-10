package com.productmanager.controller;

import com.productmanager.dao.ProductDAO;
import com.productmanager.model.Product;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

/**
 * Controller Servlet handling HTTP requests for Product Management.
 * Maps to /products and / root path.
 */
@WebServlet(name = "ProductServlet", urlPatterns = {"/products", ""})
public class ProductServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private ProductDAO productDAO;

    @Override
    public void init() {
        productDAO = new ProductDAO();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        request.setCharacterEncoding("UTF-8");
        response.setCharacterEncoding("UTF-8");

        String action = request.getParameter("action");
        if (action == null) {
            action = "list";
        }

        try {
            switch (action) {
                case "new":
                    showNewForm(request, response);
                    break;
                case "edit":
                    showEditForm(request, response);
                    break;
                case "delete":
                    deleteProduct(request, response);
                    break;
                case "list":
                default:
                    listProducts(request, response);
                    break;
            }
        } catch (Exception ex) {
            throw new ServletException(ex);
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        request.setCharacterEncoding("UTF-8");
        response.setCharacterEncoding("UTF-8");

        String action = request.getParameter("action");
        if (action == null) {
            action = "list";
        }

        try {
            switch (action) {
                case "insert":
                    insertProduct(request, response);
                    break;
                case "update":
                    updateProduct(request, response);
                    break;
                case "delete":
                    deleteProduct(request, response);
                    break;
                default:
                    listProducts(request, response);
                    break;
            }
        } catch (Exception ex) {
            throw new ServletException(ex);
        }
    }

    /**
     * Display list of products, with optional search query & summary statistics.
     */
    private void listProducts(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        String searchQuery = request.getParameter("q");
        List<Product> listProducts;

        if (searchQuery != null && !searchQuery.trim().isEmpty()) {
            listProducts = productDAO.searchProducts(searchQuery.trim());
            request.setAttribute("searchQuery", searchQuery);
        } else {
            listProducts = productDAO.selectAllProducts();
        }

        // Summary Statistics for KPI Dashboard
        int totalCount = productDAO.getTotalProductCount();
        double totalValue = productDAO.getTotalInventoryValue();
        int lowStockCount = productDAO.getLowStockCount();

        request.setAttribute("listProducts", listProducts);
        request.setAttribute("totalCount", totalCount);
        request.setAttribute("totalValue", totalValue);
        request.setAttribute("lowStockCount", lowStockCount);

        RequestDispatcher dispatcher = request.getRequestDispatcher("/views/product-list.jsp");
        dispatcher.forward(request, response);
    }

    /**
     * Show form for adding a new product.
     */
    private void showNewForm(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        RequestDispatcher dispatcher = request.getRequestDispatcher("/views/product-form.jsp");
        dispatcher.forward(request, response);
    }

    /**
     * Show pre-filled form for editing an existing product.
     */
    private void showEditForm(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String idStr = request.getParameter("id");
        if (idStr != null) {
            try {
                int id = Integer.parseInt(idStr);
                Product existingProduct = productDAO.selectProductById(id);
                if (existingProduct != null) {
                    request.setAttribute("product", existingProduct);
                    RequestDispatcher dispatcher = request.getRequestDispatcher("/views/product-form.jsp");
                    dispatcher.forward(request, response);
                    return;
                }
            } catch (NumberFormatException e) {
                e.printStackTrace();
            }
        }
        // If ID invalid or product not found, redirect to list
        response.sendRedirect(request.getContextPath() + "/products?msg=" + URLEncoder.encode("Sản phẩm không tồn tại!", StandardCharsets.UTF_8.name()) + "&type=error");
    }

    /**
     * Action: Insert a new product into database.
     */
    private void insertProduct(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        try {
            String name = request.getParameter("name");
            double price = Double.parseDouble(request.getParameter("price"));
            int quantity = Integer.parseInt(request.getParameter("quantity"));

            Product newProduct = new Product(name, price, quantity);
            boolean success = productDAO.insertProduct(newProduct);

            if (success) {
                String msg = URLEncoder.encode("Thêm sản phẩm thành công!", StandardCharsets.UTF_8.name());
                response.sendRedirect(request.getContextPath() + "/products?msg=" + msg + "&type=success");
            } else {
                String msg = URLEncoder.encode("Không thể thêm sản phẩm, vui lòng thử lại!", StandardCharsets.UTF_8.name());
                response.sendRedirect(request.getContextPath() + "/products?msg=" + msg + "&type=error");
            }
        } catch (Exception e) {
            e.printStackTrace();
            String msg = URLEncoder.encode("Dữ liệu nhập vào không hợp lệ!", StandardCharsets.UTF_8.name());
            response.sendRedirect(request.getContextPath() + "/products?msg=" + msg + "&type=error");
        }
    }

    /**
     * Action: Update existing product info in database.
     */
    private void updateProduct(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        try {
            int id = Integer.parseInt(request.getParameter("id"));
            String name = request.getParameter("name");
            double price = Double.parseDouble(request.getParameter("price"));
            int quantity = Integer.parseInt(request.getParameter("quantity"));

            Product product = new Product(id, name, price, quantity);
            boolean success = productDAO.updateProduct(product);

            if (success) {
                String msg = URLEncoder.encode("Cập nhật thông tin sản phẩm thành công!", StandardCharsets.UTF_8.name());
                response.sendRedirect(request.getContextPath() + "/products?msg=" + msg + "&type=success");
            } else {
                String msg = URLEncoder.encode("Cập nhật thất bại!", StandardCharsets.UTF_8.name());
                response.sendRedirect(request.getContextPath() + "/products?msg=" + msg + "&type=error");
            }
        } catch (Exception e) {
            e.printStackTrace();
            String msg = URLEncoder.encode("Lỗi cập nhật dữ liệu!", StandardCharsets.UTF_8.name());
            response.sendRedirect(request.getContextPath() + "/products?msg=" + msg + "&type=error");
        }
    }

    /**
     * Action: Delete product by ID.
     */
    private void deleteProduct(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        try {
            int id = Integer.parseInt(request.getParameter("id"));
            boolean success = productDAO.deleteProduct(id);

            if (success) {
                String msg = URLEncoder.encode("Đã xóa sản phẩm khỏi cơ sở dữ liệu!", StandardCharsets.UTF_8.name());
                response.sendRedirect(request.getContextPath() + "/products?msg=" + msg + "&type=success");
            } else {
                String msg = URLEncoder.encode("Không thể xóa sản phẩm!", StandardCharsets.UTF_8.name());
                response.sendRedirect(request.getContextPath() + "/products?msg=" + msg + "&type=error");
            }
        } catch (Exception e) {
            e.printStackTrace();
            String msg = URLEncoder.encode("Lỗi khi xóa sản phẩm!", StandardCharsets.UTF_8.name());
            response.sendRedirect(request.getContextPath() + "/products?msg=" + msg + "&type=error");
        }
    }
}
