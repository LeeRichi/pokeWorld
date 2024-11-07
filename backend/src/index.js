require('dotenv').config();
const express = require('express');
const app = express();
const pool = require('./db');

const cors = require('cors');
app.use(cors());

const { register } = require('./auth/register');
const { login } = require('./auth/login');
const { authenticateToken } = require('./auth/authMiddleware');
const { getPokemonsQuantity, getPokemons } = require('./pokemon/pokemon')
const { getUserById, getAllUsers, getUserFavorites, addFavoritePokemon, removeFavoritePokemon, editUserInfo, changePassword, searchUser } = require('./user/user');

app.use(express.json())

app.get('/api/pokemonsquantity', getPokemonsQuantity);
app.get('/api/pokemons', getPokemons);

app.post('/api/register', register);
app.post('/api/login', login);
app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({ message: 'This is a protected route.', user: req.user });
});

app.get('/api/users', getAllUsers);
app.get('/api/users/:id', getUserById);
app.get('/api/users/:id/favorites', getUserFavorites);
app.post('/api/users/favorites', addFavoritePokemon);
app.delete('/api/users/favorites', removeFavoritePokemon);
app.put('/api/users/:id', editUserInfo);
app.post('/api/users/change_password', changePassword);

app.get('/api/users-search/search', searchUser);

pool.connect()
  .then(client => {
    console.log('Database connected successfully');
    client.release();
  })
  .catch(err => {
    console.error('Database connection error:', err.message);
  });

app.listen(process.env.BACKEND_PORT, () => {
  console.log(`Server running on port ${process.env.BACKEND_PORT}`);
});
