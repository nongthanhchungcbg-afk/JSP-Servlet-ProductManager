package com.productmanager.model;

import java.io.Serializable;
import java.text.NumberFormat;
import java.util.Locale;

/**
 * Entity class representing a Product in the system.
 */
public class Product implements Serializable {
    private static final long serialVersionUID = 1L;

    private int id;
    private String name;
    private double price;
    private int quantity;

    // Default Constructor
    public Product() {
    }

    // Constructor without ID (used for inserting a new product)
    public Product(String name, double price, int quantity) {
        this.name = name;
        this.price = price;
        this.quantity = quantity;
    }

    // Full Constructor (used for retrieving from database)
    public Product(int id, String name, double price, int quantity) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.quantity = quantity;
    }

    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    // Helper methods for presentation layer
    public String getFormattedPrice() {
        NumberFormat currencyFormat = NumberFormat.getCurrencyInstance(Locale.US);
        return currencyFormat.format(this.price);
    }

    public double getTotalValue() {
        return this.price * this.quantity;
    }

    public String getFormattedTotalValue() {
        NumberFormat currencyFormat = NumberFormat.getCurrencyInstance(Locale.US);
        return currencyFormat.format(getTotalValue());
    }

    public String getStockBadgeClass() {
        if (this.quantity == 0) {
            return "badge-out-of-stock";
        } else if (this.quantity < 10) {
            return "badge-low-stock";
        } else {
            return "badge-in-stock";
        }
    }

    public String getStockStatusText() {
        if (this.quantity == 0) {
            return "Hết hàng";
        } else if (this.quantity < 10) {
            return "Sắp hết (" + this.quantity + ")";
        } else {
            return "Còn hàng (" + this.quantity + ")";
        }
    }

    @Override
    public String toString() {
        return "Product{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", price=" + price +
                ", quantity=" + quantity +
                '}';
    }
}
