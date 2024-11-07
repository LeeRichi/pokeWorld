const pool = require('../db');
const axios = require('axios');

const getPokemonsQuantity = async (req, res) =>
{
	try {
		const data = await axios.get(`https://pokeapi.co/api/v2/pokemon`);
		res.json(data.data.count)
	} catch (error) {
		console.error(error)
	}
}

const getPokemons = async(req, res) => {
	try
	{
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 20;
		const offset = (page - 1) * limit;
		const sortOrder = req.query.order === 'desc' ? 'desc' : 'asc';

		const sortField = req.query.sort || 'id';
		const validSortFields = ['id', 'name', 'likes'];
		if (!validSortFields.includes(sortField)) {
			return res.status(400).json({ error: 'Invalid sort field' });
		}
		const pokemonsResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
		const totalAmount = pokemonsResponse.data.count;
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
			const { id, name, sprites, height, weight, types } = detailResponse.data;
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

		console.log(sortField)
		console.log("sortOrder: " + sortOrder)

		combinedData.sort((a, b) => {
      if (sortField === 'likes') {
        return sortOrder === 'asc' ? a.likes - b.likes : b.likes - a.likes;
      } else if (sortField === 'name') {
        return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      } else {
        return sortOrder === 'asc' ? a.id - b.id : b.id - a.id;
      }
    });

		res.json(combinedData)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getPokemonsQuantity, getPokemons };
