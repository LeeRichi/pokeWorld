const pool = require('../db');
const axios = require('axios');

// const getPokemonsQuantity = async (req, res) =>
// {
// 	try {
// 		const data = await axios.get(`https://pokeapi.co/api/v2/pokemon`);
// 		// res.json(data.data.count) //restapi(old)
// 		return data.data.count;
// 	} catch (error) {
// 		console.error(error)
// 	}
// }

let cachedPokemons = null;
let lastFetchedTime = 0;
const CACHE_EXPIRATION_TIME = 5 * 60 * 1000;
let cache = {};

const likeMap = async(pokemons) =>
{
	const likesResult = await pool.query(`
		SELECT pokemon_id, COUNT(user_id) AS likes
		FROM favorites
		GROUP BY pokemon_id
	`);

	const likesMap = new Map(likesResult.rows.map(like => [like.pokemon_id, parseInt(like.likes)]));

	return pokemons.map(pokemon => {
    const likes = likesMap.get(pokemon.id) || 0;
    return { ...pokemon, likes };
	});
}

const getPokemons = async (req, res) =>
{
	try
	{
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 20;
		const offset = (page - 1) * limit;
		const sortOrder = req.query.order === 'desc' ? 'desc' : 'asc';
		const type = req.query.type || '';
		// const currentTime = Date.now();
		// const cacheKey = `page:${page}-limit:${limit}`;

		// if (cache[cacheKey] && currentTime - cache[cacheKey].timestamp < CACHE_EXPIRATION_TIME) {
    //   // return res.json(cache[cacheKey].data); //restapi(old)
    //   return cache[cacheKey].data;
    // }

		const sortField = req.query.sort || 'id';
		const validSortFields = ['id', 'name', 'likes'];
		if (!validSortFields.includes(sortField)) {
      // return res.status(400).json({ error: 'Invalid sort field' }); //restapi(old)
      throw new Error('Invalid sort field');
		}
		const pokemonsResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}&types=${type}&order=${sortOrder}`);
		const totalAmount = pokemonsResponse.data.count;
    const pokemons = pokemonsResponse.data.results;

    // Fetch detailed Pokémon data and combine with likes
    const basicData = await Promise.all(pokemons.map(async (pokemon) => {
			const basicResponse = await axios.get(pokemon.url);
			const { id, name, sprites, height, weight, types } = basicResponse.data;

			return {
				id,
				name,
				// likes,
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

		// const likesResult = await pool.query(`
		// 	SELECT pokemon_id, COUNT(user_id) AS likes
		// 	FROM favorites
		// 	GROUP BY pokemon_id
		// `);

		// // Create a map for quick look-up of likes by pokemon_id
		// const likesMap = new Map(likesResult.rows.map(like => [like.pokemon_id, parseInt(like.likes)]));

		// const combinedData = basicData.map(pokemon => {
		// 	const likes = likesMap.get(pokemon.id) || 0;
		// 	return { ...pokemon, likes };
		// });

		const combinedData = likeMap(basicData)

		// combinedData.sort((a, b) => {
		// 	if (sortField === 'likes') {
		// 		return sortOrder === 'asc' ? a.likes - b.likes : b.likes - a.likes;
		// 	} else if (sortField === 'name') {
		// 		return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
		// 	} else {
		// 		return sortOrder === 'asc' ? a.id - b.id : b.id - a.id;
		// 	}
		// });
		// cache[cacheKey] = {
			//   timestamp: Date.now(),
			//   data: combinedData
			// };
			// res.json(combinedData)

			// console.log(combinedData)

		return {
			total: totalAmount,
			pokemons: combinedData
		};
	} catch (error) {
		console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getPokemonsByTypes = async (req, res) => {
  const type = req.query.type || '';

  try {
    const pokemonsResponse = await axios.get(`https://pokeapi.co/api/v2/type/${type}`);
    const totalAmount = pokemonsResponse.data.pokemon.length;

    const basicData = await Promise.all(pokemonsResponse.data.pokemon.map(async (pokemon) => {
      const basicResponse = await axios.get(pokemon.pokemon.url);
      const { id, name, sprites, types } = basicResponse.data;

      return {
        id,
        name,
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
        types
      };
		}));

		const combinedData = likeMap(basicData)

    return ({
      total: totalAmount,
      pokemons: combinedData
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const get_pokemon_names = async (req, res) => {
	try {
		const result = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=1304`);
		const names = result.data.results.map(pokemon => pokemon.name);

		res.json(names);
	} catch (error) {
		console.error("Error fetching Pokémon names:", error.message);
		res.status(500).json({ error: "Failed to fetch Pokémon names" });
	}
};


module.exports = { getPokemons, getPokemonsByTypes, get_pokemon_names };
