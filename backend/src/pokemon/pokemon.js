const pool = require('../db');
const axios = require('axios');

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

//compare to likeMap, this function is for all pokemons, before fetch each details, compare there id with likes-id pairs in db
const likeMapAll = async (allPokemonsSimpleData) =>
{
  const likesResult = await pool.query(`
		SELECT pokemon_id, COUNT(user_id) AS likes
		FROM favorites
		GROUP BY pokemon_id
	`);

  const likesMap = new Map(likesResult.rows.map(like => [like.pokemon_id, parseInt(like.likes)]));

  return allPokemonsSimpleData.map(pokemon => {
    const url = pokemon.url;
    const id = url.split('/').filter(Boolean).pop();
    const likes = likesMap.get(Number(id)) || 0;
    return { ...pokemon, likes };
	});
}

const getPokemons = async (req, res) =>
{
	try
	{
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 20;
		let offset = (page - 1) * limit;
		const sortBy = req.query.sortBy;
		const total_len = req.query.total_len || 0;

		if (sortBy === 'reverse-id')
		{
			offset = total_len - limit * page;
		}
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
		let pokemons;
		let totalAmount;
		if (sortBy === 'name' || sortBy === 'reverse-name' || sortBy === 'reverse-likes' || sortBy === 'likes')
		{
			const allNamesRes = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${total_len}`);
			totalAmount = allNamesRes.data.results.length;
			pokemons = allNamesRes.data.results;
      if (sortBy === 'reverse-name')
        pokemons.sort((a, b) => b.name.localeCompare(a.name));
      else if (sortBy === 'name')
        pokemons.sort((a, b) => a.name.localeCompare(b.name));
      else if (sortBy === 'reverse-likes')
      {
        pokemons = await likeMapAll(pokemons);
        pokemons.sort((a, b) => b.likes - a.likes);
      }
      else if (sortBy === 'likes')
      {
        pokemons = await likeMapAll(pokemons);
        pokemons.sort((a, b) => a.likes - b.likes);
      }
      pokemons = pokemons.slice(offset, offset + limit);
    }
		else //default case
		{
			const pokemonsResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
			totalAmount = pokemonsResponse.data.count;
			pokemons = pokemonsResponse.data.results;
		}

    // Fetch detailed Pokémon data and combine with likes
    const basicData = await Promise.all(pokemons.map(async (pokemon) => {
			const basicResponse = await axios.get(pokemon.url);
			const { id, name, sprites, height, weight, types } = basicResponse.data;

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
				height,
				weight,
        types
			};
		}));

		const combinedData = likeMap(basicData)

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

//for searching-bar purpose
const get_pokemon_names = async (req, res) => {
	try {
		const result = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=1304`); //should this be hardcoded?
		const names = result.data.results.map(pokemon => pokemon.name);

		res.json(names);
	} catch (error) {
		console.error("Error fetching Pokémon names:", error.message);
		res.status(500).json({ error: "Failed to fetch Pokémon names" });
	}
};


module.exports = { getPokemons, getPokemonsByTypes, get_pokemon_names };
