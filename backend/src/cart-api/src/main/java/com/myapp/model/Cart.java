package com.myapp.model;

import java.util.HashMap;
import java.util.Map;

public class Cart {
    private int userId; // Unique identifier for the user
    private Map<Integer, Integer> items; // Map of itemId to quantity

    public Cart(int userId) {
        this.userId = userId;
        this.items = new HashMap<>();
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public Map<Integer, Integer> getItems() {
        return items;
    }

    public void setItems(Map<Integer, Integer> items) {
        this.items = items;
    }

    public void addItem(int itemId, int quantity) {
        items.put(itemId, items.getOrDefault(itemId, 0) + quantity);
    }

    public void removeItem(int itemId) {
        items.remove(itemId);
    }

    public void updateItem(int itemId, int quantity) {
        if (quantity <= 0) {
            items.remove(itemId);
        } else {
            items.put(itemId, quantity);
        }
    }

    public void clearCart() {
        items.clear();
    }

    @Override
    public String toString() {
        return "Cart{" +
                "userId=" + userId +
                ", items=" + items +
                '}';
    }
}
