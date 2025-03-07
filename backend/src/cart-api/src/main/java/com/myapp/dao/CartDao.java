package com.myapp.dao;

import com.myapp.model.Cart;
import com.myapp.database.DatabaseConnection;
import org.springframework.stereotype.Repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

@Repository
public class CartDao {

    public Cart getCartForUser(int userId) {
        Cart cart = new Cart(userId);
        String query = "SELECT item_id, quantity FROM user_items WHERE user_id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setInt(1, userId);
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                int itemId = rs.getInt("item_id");
                int quantity = rs.getInt("quantity");
                cart.addItem(itemId, quantity);
            }
        } catch (SQLException e) {
            throw new RuntimeException("Failed to fetch cart for user: " + userId, e);
        }

        return cart;
    }

    public void addItemToCart(int userId, int itemId, int quantity) {
        String query = "INSERT INTO user_items (user_id, item_id, quantity) " +
                      "VALUES (?, ?, ?) " +
                      "ON CONFLICT (user_id, item_id) DO UPDATE " +
                      "SET quantity = user_items.quantity + EXCLUDED.quantity";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setInt(1, userId);
            stmt.setInt(2, itemId);
            stmt.setInt(3, quantity);
            stmt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException("Failed to add item to cart for user: " + userId, e);
        }
    }

    public void updateItemInCart(int userId, int itemId, int quantity) {
        if (quantity <= 0) {
            removeItemFromCart(userId, itemId); // Remove if quantity is 0 or negative
        } else {
            String query = "UPDATE user_items SET quantity = ? WHERE user_id = ? AND item_id = ?";

            try (Connection conn = DatabaseConnection.getConnection();
                 PreparedStatement stmt = conn.prepareStatement(query)) {
                stmt.setInt(1, quantity);
                stmt.setInt(2, userId);
                stmt.setInt(3, itemId);
                stmt.executeUpdate();
            } catch (SQLException e) {
                throw new RuntimeException("Failed to update item in cart for user: " + userId, e);
            }
        }
    }

    public void removeItemFromCart(int userId, int itemId) {
        String query = "DELETE FROM user_items WHERE user_id = ? AND item_id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setInt(1, userId);
            stmt.setInt(2, itemId);
            stmt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException("Failed to remove item from cart for user: " + userId, e);
        }
    }
}
