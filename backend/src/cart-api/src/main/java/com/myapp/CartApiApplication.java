package com.myapp;

import com.myapp.controller.CartController;
import com.myapp.database.DatabaseConnection;
import java.sql.SQLException;
import com.myapp.model.Cart;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class CartApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(CartApiApplication.class, args);
	}

}
