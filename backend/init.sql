---- This file can help you to set up some mock data at the begining

DROP TABLE IF EXISTS user_items;
DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS favorites;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS friends;

-- Create the users table with auth_method
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    image VARCHAR(255), -- New column for user image
    password_hash VARCHAR(255), -- Allow NULL for Google users
    auth_method VARCHAR(10) DEFAULT 'local', -- New column to track auth method
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the items table
CREATE TABLE items (
    item_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the user_items table to link users with their items
CREATE TABLE user_items (
    user_id INT NOT NULL,
    item_id INT NOT NULL,
    quantity INT DEFAULT 1, -- Number of this item in the user's bag
    PRIMARY KEY (user_id, item_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES items(item_id) ON DELETE CASCADE
);

-- Create the favorites table
CREATE TABLE favorites (
    user_id INT NOT NULL,
    pokemon_id INT NOT NULL,
    PRIMARY KEY (user_id, pokemon_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Create the friends table
CREATE TABLE friends (
    user_id INT NOT NULL,
    friend_id INT NOT NULL,
    PRIMARY KEY (user_id, friend_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (friend_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Insert fake users
INSERT INTO users (username, email, password_hash, auth_method) VALUES
('trainer1', 'example1@gmail.com', 'hashed_password1', 'local'),
('trainer2', 'example2@gmail.com', 'hashed_password2', 'local');

-- Insert fake items
INSERT INTO items (name, description) VALUES
('Potion', 'Heals 20 HP'),
('Super Potion', 'Heals 50 HP');

-- Insert fake user items (user_id, item_id, quantity)
INSERT INTO user_items (user_id, item_id, quantity) VALUES
(1, 1, 2), -- trainer1 has 2 Potions
(1, 2, 1), -- trainer1 has 1 Super Potion
(2, 1, 3); -- trainer2 has 3 Potions

-- Insert fake favorites for users (example PokeAPI IDs)
INSERT INTO favorites (user_id, pokemon_id) VALUES
(1, 1), -- trainer1 favorites Bulbasaur (PokeAPI ID 1)
(1, 4), -- trainer1 favorites Charmander (PokeAPI ID 4)
(2, 7); -- trainer2 favorites Squirtle (PokeAPI ID 7)

-- Insert fake friendships
INSERT INTO friends (user_id, friend_id) VALUES
(1, 2), -- trainer1 is friends with trainer2
(2, 1); -- trainer2 is friends with trainer1
