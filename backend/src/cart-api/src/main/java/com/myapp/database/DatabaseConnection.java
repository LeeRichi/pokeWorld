
package com.myapp.database;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DatabaseConnection {
    private static Connection connection;

    // Private constructor to prevent instantiation
    private DatabaseConnection() {}

    // Get a database connection (singleton pattern)
    public static Connection getConnection() throws SQLException {
        if (connection == null || connection.isClosed()) {
            String url = "jdbc:postgresql://localhost:5432/pokemon_db";
            String user = "youruser";
            String password = "yourpassword";
            connection = DriverManager.getConnection(url, user, password);
        }
        return connection;
    }

    // Close the database connection
    public static void closeConnection() {
        if (connection != null) {
            try {
                connection.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }
}
