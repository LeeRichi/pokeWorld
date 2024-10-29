// const pool = require('../db');
// const jwt = require('jsonwebtoken');

// const getAllUsers = async (req, res) => {
//   try {
//     const result = await pool.query(`
//       SELECT u.*,
//         ARRAY(SELECT pokemon_id FROM favorites f WHERE f.user_id = u.user_id) AS favorite_pokemon_ids
//       FROM users u
//     `);

//     if (result.rows.length === 0) {
//       return res.status(404).json({ message: 'No users found' });
//     }

//     // Fetch Pokémon details from PokeAPI based on favorite IDs
//     const usersWithFavorites = await Promise.all(result.rows.map(async user => {
//       const favoritePokemonIds = user.favorite_pokemon_ids || [];
//       const pokemonDetailsPromises = favoritePokemonIds.map(async (pokemonId) => {
//         const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
//         const data = await response.json();
//         return data;
//       });
//       const pokemonDetails = await Promise.all(pokemonDetailsPromises);
//       return { ...user, favorites: pokemonDetails };
//     }));

//     res.json(usersWithFavorites);
//   } catch (error) {
//     console.error('Error fetching users:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

// const getUserById = async (req, res) =>
// {
// 	const { id } = req.params;

//   try {
//     const result = await pool.query(`
//       SELECT u.*,
//         ARRAY(SELECT pokemon_id FROM favorites f WHERE f.user_id = u.user_id) AS favorite_pokemon_ids
//       FROM users u
//       WHERE u.user_id = $1
//     `, [id]);

//     if (result.rows.length === 0) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const user = result.rows[0];
//     const favoritePokemonIds = user.favorite_pokemon_ids || [];

//     const pokemonDetailsPromises = favoritePokemonIds.map(async (pokemonId) => {
//       const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
//       const data = await response.json();
//       return data;
//     });

//     const pokemonDetails = await Promise.all(pokemonDetailsPromises);

//     // Combine user data with their favorite Pokémon details
//     res.json({ ...user, favorites: pokemonDetails });
//   } catch (error) {
//     console.error('Error fetching user:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

// // Fetch Pokémon details by user ID
// const getUserFavorites = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const result = await pool.query(
//       'SELECT pokemon_id FROM favorites WHERE user_id = $1',
//       [id]
//     );

// 		const favoritePokemonIds = result.rows.map(row => row.pokemon_id);

//     if (favoritePokemonIds.length === 0) {
//       return res.status(404).json({ message: 'No favorite Pokémon found for this user' });
//     }

//     // Fetch Pokémon details from the external API
//     const pokemonDetailsPromises = favoritePokemonIds.map(async (pokemonId) => {
// 			const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
// 			const data = await response.json();
//       return data;
//     });

//     const pokemonDetails = await Promise.all(pokemonDetailsPromises);

//     res.json(pokemonDetails);
//   } catch (error) {
//     console.error('Error fetching favorite Pokémon:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

// const addFavoritePokemon = async (req, res) => {
// 	const { userId, pokemonId } = req.body;

//   try {
//     const existingFavorite = await pool.query(
//       'SELECT * FROM favorites WHERE user_id = $1 AND pokemon_id = $2',
//       [userId, pokemonId]
//     );
//     if (existingFavorite.rows.length > 0) {
//       return res.status(400).json({ message: 'This Pokémon is already in your favorites' });
//     }

//     await pool.query(
//       'INSERT INTO favorites (user_id, pokemon_id) VALUES ($1, $2)',
//       [userId, pokemonId]
//     );
//     res.status(201).json({ message: 'Favorite Pokémon added successfully' });
//   } catch (error) {
//     console.error('Error adding favorite Pokémon:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

// const removeFavoritePokemon = async (req, res) => {
//   const { userId, pokemonId } = req.body;

//   try {
//     const existingFavorite = await pool.query(
//       'SELECT * FROM favorites WHERE user_id = $1 AND pokemon_id = $2',
//       [userId, pokemonId]
//     );

//     if (existingFavorite.rows.length == 0) {
//       return res.status(400).json({ message: 'You can not remove your like without liking it.' });
//     }
//     await pool.query(
//       'DELETE FROM favorites WHERE user_id = $1 AND pokemon_id = $2',
//       [userId, pokemonId]
//     );

//     res.status(201).json({ message: 'Favorite Pokémon removed successfully' });
//   } catch (error) {
//     console.error('Error removing favorite Pokémon:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

// const editUserInfo = async (req, res) => {
//   const { id, name, email } = req.body;

// 	const token = req.headers.authorization?.split(' ')[1];
//   if (!token) {
//     return res.status(401).json({ message: 'No token provided' });
//   }

//   try {
// 		const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     if ((decoded.userId) !== parseInt(id)) {
//       return res.status(403).json({ message: 'You are not authorized to edit this user' });
//     }
//     const result = await pool.query(
//       'UPDATE users SET username = $1, email = $2 WHERE user_id = $3 RETURNING *',
//       [name, email, id]
//     );
//     if (result.rows.length === 0) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     res.json({ message: 'User information updated successfully', user: result.rows[0] });
//   } catch (error) {
//     console.error('Error updating user info:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

// module.exports = { getUserById, getAllUsers, getUserFavorites, addFavoritePokemon, removeFavoritePokemon, editUserInfo };

const { decode } = require('punycode');
const pool = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Middleware to authenticate user based on token
const authenticateUser = (req) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    throw new Error('No token provided');
  }
  return jwt.verify(token, process.env.JWT_SECRET);
};

const getAllUsers = async (req, res) => {
  try {
		const { userId } = authenticateUser(req);
		if (!userId)
		{
      return res.status(401).json({ message: 'Unauthorized access. Please log in.' });
    }

    // Fetch all users but do not expose other users' data
		const result = await pool.query(`
      SELECT u.user_id, u.username, u.email,
        ARRAY(SELECT pokemon_id FROM favorites f WHERE f.user_id = u.user_id) AS favorite_pokemon_ids
      FROM users u
    `);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    const usersWithFavorites = await Promise.all(result.rows.map(async user => {
      const favoritePokemonIds = user.favorite_pokemon_ids || [];
      const pokemonDetailsPromises = favoritePokemonIds.map(async (pokemonId) => {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
        const data = await response.json();
        return data;
      });
      const pokemonDetails = await Promise.all(pokemonDetailsPromises);
      return { ...user, favorites: pokemonDetails };
    }));

    res.json(usersWithFavorites);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(401).json({ error: 'Unauthorized' });
  }
};

const getUserById = async (req, res) => {
	const { id } = req.params;

  try {
		// const { userId } = authenticateUser(req);

		// if (!userId)
		// {
    //   return res.status(401).json({ message: 'Unauthorized access. Please log in.' });
		// }

    const result = await pool.query(`
      SELECT u.*,
        ARRAY(SELECT pokemon_id FROM favorites f WHERE f.user_id = u.user_id) AS favorite_pokemon_ids
      FROM users u
      WHERE u.user_id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = result.rows[0];
    const favoritePokemonIds = user.favorite_pokemon_ids || [];

    const pokemonDetailsPromises = favoritePokemonIds.map(async (pokemonId) => {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
      const data = await response.json();
      return data;
    });

    const pokemonDetails = await Promise.all(pokemonDetailsPromises);

    res.json({ ...user, favorites: pokemonDetails });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(401).json({ error: 'Unauthorized' });
  }
};

const getUserFavorites = async (req, res) => {
  const { id } = req.params;

  try {
		const { userId } = authenticateUser(req); // Get userId from token
		if (!userId)
		{
      return res.status(401).json({ message: 'Unauthorized access. Please log in.' });
		}
		console.log(parseInt(id))
		console.log('hallo')

    // Ensure that the user can only fetch their own favorites
    // if (userId !== parseInt(id)) {
    //   return res.status(403).json({ message: 'You are not authorized to access this user\'s favorites' });
    // }

    const result = await pool.query(
      'SELECT pokemon_id FROM favorites WHERE user_id = $1',
      [id]
    );

    const favoritePokemonIds = result.rows.map(row => row.pokemon_id);

    if (favoritePokemonIds.length === 0) {
      return res.status(404).json({ message: 'No favorite Pokémon found for this user' });
    }

    const pokemonDetailsPromises = favoritePokemonIds.map(async (pokemonId) => {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
      const data = await response.json();
      return data;
    });

    const pokemonDetails = await Promise.all(pokemonDetailsPromises);

    res.json(pokemonDetails);
  } catch (error) {
    console.error('Error fetching favorite Pokémon:', error);
    res.status(401).json({ error: 'Unauthorized' });
  }
};

const addFavoritePokemon = async (req, res) => {
  const { userId, pokemonId } = req.body;

  try {
    const { userId: tokenUserId } = authenticateUser(req); // Get userId from token

    // Ensure that the user can only add favorites for themselves
    if (tokenUserId !== userId) {
      return res.status(403).json({ message: 'You are not authorized to add favorites for this user' });
    }

    const existingFavorite = await pool.query(
      'SELECT * FROM favorites WHERE user_id = $1 AND pokemon_id = $2',
      [userId, pokemonId]
    );

    if (existingFavorite.rows.length > 0) {
      return res.status(400).json({ message: 'This Pokémon is already in your favorites' });
    }

    await pool.query(
      'INSERT INTO favorites (user_id, pokemon_id) VALUES ($1, $2)',
      [userId, pokemonId]
    );
    res.status(201).json({ message: 'Favorite Pokémon added successfully' });
  } catch (error) {
    console.error('Error adding favorite Pokémon:', error);
    res.status(401).json({ error: 'Unauthorized' });
  }
};

const removeFavoritePokemon = async (req, res) =>
{
	const { userId, pokemonId } = req.body;

	try
	{
		const { userId: tokenUserId } = authenticateUser(req); // Get userId from token

		// Ensure that the user can only remove favorites for themselves
		if (tokenUserId !== userId)
		{
			return res.status(403).json({ message: 'You are not authorized to remove favorites for this user' });
		}

		const existingFavorite = await pool.query(
			'SELECT * FROM favorites WHERE user_id = $1 AND pokemon_id = $2',
			[userId, pokemonId]
		);

		if (existingFavorite.rows.length == 0)
		{
			return res.status(400).json({ message: 'You can not remove your like without liking it.' });
		}
		await pool.query(
			'DELETE FROM favorites WHERE user_id = $1 AND pokemon_id = $2',
			[userId, pokemonId]
		);

		res.status(201).json({ message: 'Favorite Pokémon removed successfully' });
	} catch (error)
	{
		console.error('Error removing favorite Pokémon:', error);
		res.status(401).json({ error: 'Unauthorized' });
	}
}

const editUserInfo = async (req, res) => {
	const { id, name, email } = req.body;

	const token = req.headers.authorization?.split(' ')[1];
	if (!token) {
		return res.status(401).json({ message: 'No token provided' });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		if ((decoded.userId) !== parseInt(id)) {
			return res.status(403).json({ message: 'You are not authorized to edit this user' });
		}
		const result = await pool.query(
			'UPDATE users SET username = $1, email = $2 WHERE user_id = $3 RETURNING *',
			[name, email, id]
		);
		if (result.rows.length === 0) {
			return res.status(404).json({ message: 'User not found' });
		}
		res.json({ message: 'User information updated successfully', user: result.rows[0] });
	} catch (error) {
		console.error('Error updating user info:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
};

const changePassword = async (req, res) => {
	const { id, currentPassword, newPassword } = req.body;

	// Get the token from the authorization header
	const token = req.headers.authorization?.split(' ')[1];
	if (!token) {
		return res.status(401).json({ message: 'No token provided' });
	}

	try {
		// Verify the JWT token to get the userId
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		console.log("1: " + decode)
		console.log("2: " + parseInt(id))

		// Check if the decoded token's userId matches the user requesting the password change
		if (decoded.userId !== parseInt(id)) {
			return res.status(403).json({ message: 'You are not authorized to change this user\'s password' });
		}

		// Fetch the current password hash for the user from the database
		const userResult = await pool.query('SELECT password_hash FROM users WHERE user_id = $1', [id]);
		if (userResult.rows.length === 0) {
			return res.status(404).json({ message: 'User not found' });
		}

		const user = userResult.rows[0];

		// Compare the provided current password with the hashed password in the database
		const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
		if (!isMatch) {
			return res.status(403).json({ message: 'Current password is incorrect' });
		}

		//new password to hash
		const hashedPassword = await bcrypt.hash(newPassword, 10);

		// Update the password in the database
		const result = await pool.query(
			'UPDATE users SET password_hash = $1 WHERE user_id = $2 RETURNING *',
			[hashedPassword, id]
		);

		if (result.rows.length === 0) {
			return res.status(404).json({ message: 'User not found' });
		}

		// Respond with success message
		res.json({ message: 'Password updated successfully' });
	} catch (error) {
		console.error('Error changing password:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
};


const searchUser = async(req, res) => {
	const { username } = req.query;

	console.log("SearchUser Endpoint Hit"); // Add this to log endpoint usage


	console.log(username)

  if (!username) {
    return res.status(400).json({ error: 'Username query parameter is required' });
  }

  try {
    const users = await pool.query(
      'SELECT user_id, username FROM users WHERE username ILIKE $1 LIMIT 10',
      [`%${username}%`]
		);

		console.log(users.rows)
    res.json(users.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};


module.exports = { getUserById, getAllUsers, getUserFavorites, addFavoritePokemon, removeFavoritePokemon, editUserInfo, changePassword, searchUser };
