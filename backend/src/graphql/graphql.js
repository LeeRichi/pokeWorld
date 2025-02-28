const { getPokemons, getPokemonsByTypes } = require('../pokemon/pokemon');

const resolvers = {
  Query: {
    pokemons: async (_, args) => {
      console.log("args: ", args)
			try
			{
        const result = await getPokemons({
          query: {
            page: args.page,
            limit: args.limit,
            sort: args.sort,
            order: args.order,
            type: args.type
          }
        });

        if (!result) {
          console.error("No result received:", result);
        }

				return {total: result.total, pokemons: result.pokemons}
      } catch (error) {
        console.error('Error fetching pokemons:', error);
        throw new Error('Failed to fetch Pokémon');
      }
    },
    pokemonsByTypes: async (_, args) => {
      console.log("args: ", args)
			try
			{
        const result = await getPokemonsByTypes({
          query: {
            type: args.type
          }
        });

        if (!result) {
          console.error("No result received:", result);
        }
				return {total: result.total, pokemons: result.pokemons}
      } catch (error) {
        console.error('Error fetching pokemons:', error);
        throw new Error('Failed to fetch Pokémon');
      }
    }
  }
};

module.exports = { resolvers };
