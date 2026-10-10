package com.productmanager.utils;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * Utility class for establishing JDBC connection to MySQL Database.
 */
public class DBContext {

    // MySQL Database Configuration
    private static final String DB_HOST = "localhost";
    private static final String DB_PORT = "3306";
    private static final String DB_NAME = "product_db";
    private static final String DB_USER = "root";
    private static final String DB_PASS = "root"; // Update this password according to your local MySQL settings

    // JDBC Driver & URL with UTF-8 character encoding
    private static final String DRIVER = "com.mysql.cj.jdbc.Driver";
    private static final String URL = "jdbc:mysql://" + DB_HOST + ":" + DB_PORT + "/" + DB_NAME 
            + "?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC&useUnicode=true&characterEncoding=UTF-8";

    /**
     * Get a connection to the MySQL database.
     * @return Connection object
     * @throws SQLException if connection fails
     * @throws ClassNotFoundException if JDBC driver class is missing
     */
    public static Connection getConnection() throws SQLException, ClassNotFoundException {
        // Register MySQL JDBC Driver
        Class.forName(DRIVER);
        
        // Return Connection
        return DriverManager.getConnection(URL, DB_USER, DB_PASS);
    }

    /**
     * Close connection safely
     */
    public static void closeConnection(Connection conn) {
        if (conn != null) {
            try {
                conn.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }
}
