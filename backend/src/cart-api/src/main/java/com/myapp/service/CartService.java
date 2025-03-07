package com.myapp.service;

import com.myapp.dao.CartDao;
import com.myapp.model.Cart;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CartService {
    private final CartDao cartDao;

    @Autowired
    public CartService(CartDao cartDao) {
        this.cartDao = cartDao;
    }

    public Cart getCart(int userId) {
        return cartDao.getCartForUser(userId);
    }

    public void addItem(int userId, int itemId, int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be a positive number");
        }
        cartDao.addItemToCart(userId, itemId, quantity);
    }

    public void removeItem(int userId, int itemId) {
        cartDao.removeItemFromCart(userId, itemId);
    }

    public void updateItem(int userId, int itemId, int quantity) {
        if (quantity <= 0) {
            cartDao.removeItemFromCart(userId, itemId); // Remove if quantity is 0 or negative
        } else {
            cartDao.updateItemInCart(userId, itemId, quantity);
        }
    }

    public void clearCart(int userId) {
        Cart cart = cartDao.getCartForUser(userId);
        cart.clearCart();
    }

    public Cart viewCart(int userId) {
        return cartDao.getCartForUser(userId);
    }
}
