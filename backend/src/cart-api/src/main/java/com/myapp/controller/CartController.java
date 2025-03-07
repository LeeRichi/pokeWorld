package com.myapp.controller;

import com.myapp.service.CartService;
import com.myapp.model.Cart;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cart")
@CrossOrigin(origins = "http://localhost:3000")
public class CartController {
    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping("/{userId}")
    public Cart getCart(@PathVariable int userId) {
        return cartService.getCart(userId);
    }

    @PostMapping("/{userId}/add")
    public String addItem(@PathVariable int userId, @RequestParam int itemId, @RequestParam int quantity) {
        cartService.addItem(userId, itemId, quantity);
        return "Item added to cart.";
    }

    @PutMapping("/{userId}/update")
    public String updateItem(@PathVariable int userId, @RequestParam int itemId, @RequestParam int quantity) {
        cartService.updateItem(userId, itemId, quantity);
        return "Cart updated.";
    }

    @DeleteMapping("/{userId}/remove")
    public String removeItem(@PathVariable int userId, @RequestParam int itemId) {
        cartService.removeItem(userId, itemId);
        return "Item removed from cart.";
    }
}
