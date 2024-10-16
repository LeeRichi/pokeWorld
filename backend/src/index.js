const express = require('express');
const app = express();
const axios = require('axios');
const { Pool } = require('pg')

const PORT = 3000;

// PostgreSQL connection configuration
const pool = new Pool({
  user: 'youruser',
  host: 'localhost',
  database: 'pokemon_db',
  password: 'yourpassword',
  port: 5432,
})

app.use(express.json())

// Example route to fetch Pokémon data from an external API
app.get('/', async (req, res) => {
  try {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/`);

    // Sending the fetched data back to the frontend
	res.json(response.data);
	console.log(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Pokémon data' });
  }
});

app.get('/api/users/', async (req, res) => {
  try {
    const users = await pool.query('SELECT username FROM users');

   if (users.rows.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    res.json({ users: users.rows });
  } catch (err) {
    console.error('Error executing query:', err.message);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

// Check database connection
pool.connect()
  .then(client => {
    console.log('Database connected successfully');
    client.release();
  })
  .catch(err => {
    console.error('Database connection error:', err.message);
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
