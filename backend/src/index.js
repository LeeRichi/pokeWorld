require('dotenv').config();
const express = require('express');
const app = express();
const axios = require('axios');
const pool = require('./db');

//This will allow you make the api call in frontend
const cors = require('cors');
app.use(cors());

const { register } = require('./auth/register');
const { login } = require('./auth/login');
const { authenticateToken } = require('./auth/authMiddleware');

const { getUserById, getAllUsers, getUserFavorites, addFavoritePokemon, removeFavoritePokemon, editUserInfo, changePassword, searchUser } = require('./user/user');

app.use(express.json())

app.get('/api/pokemons', async (req, res) => {
  try {
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 20;

    // Fetch data from the PokeAPI
		const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
		// res.json(response.data.results);

		const pokemonDetailsPromises = response.data.results.map(async (pokemon) =>
		{
			const pokemonResponse = await axios.get(pokemon.url);
			return pokemonResponse.data;
		});
		const detailedPokemons = await Promise.all(pokemonDetailsPromises);

		res.json({ likes: 0, detailedPokemons })
  } catch (error) {
    console.error("Error fetching Pokémon data:", error);
    res.status(500).json({ error: 'Failed to fetch Pokémon data', details: error.message });
  }
});

app.get('/api/pokemons_with_likes', async (req, res) => {
  try {
    const offset = req.query.offset || 0;
    const limit = req.query.limit || 20;

    // Fetch Pokémon data
    const pokemonsResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
		const pokemons = pokemonsResponse.data.results;

    // Fetch likes data
    const likesResult = await pool.query(`
      SELECT pokemon_id, COUNT(user_id) AS likes
      FROM favorites
      GROUP BY pokemon_id
    `);

    // Create a map for quick look-up of likes by pokemon_id
    const likesMap = new Map(likesResult.rows.map(like => [like.pokemon_id, parseInt(like.likes)]));

    // Fetch detailed Pokémon data and combine with likes
    const combinedData = await Promise.all(pokemons.map(async (pokemon) => {
			const detailResponse = await axios.get(pokemon.url);
			const { id, name, sprites, height, weight, types } = detailResponse.data; // Destructure only required fields
			const likes = likesMap.get(id) || 0;

			return {
				id,
				name,
				likes,
				sprites: {
					front_default: sprites.front_default,
					other: {
						home: {
							front_default: sprites.other?.home?.front_default
						},
						showdown: {
							front_default: sprites.other?.showdown?.front_default,
							back_default: sprites.other?.showdown?.back_default
						}
					}
				},
				height,
				weight,
				types
			};
		}));

		console.log(combinedData)

		res.json(combinedData)

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

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

// Check database connection
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
