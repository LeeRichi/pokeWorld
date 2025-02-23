const { getPokemons, getPokemonsQuantity } = require('../pokemon/pokemon');

const resolvers = {
  Query: {
    pokemons: async (_, args) => {
			try
			{
        const result = await getPokemons({
          query: {
            page: args.page,
            limit: args.limit,
            sort: args.sort,
            order: args.order
          }
				});

				console.log('yoooooooo! in graphql file: ', result)

				return {total: result.total, pokemons: result.pokemons}
      } catch (error) {
        console.error('Error fetching pokemons:', error);
        throw new Error('Failed to fetch Pokémon');
      }
    },
    pokemonsQuantity: async () => {
      try {
        return await getPokemonsQuantity();
      } catch (error) {
        console.error('Error fetching Pokémon quantity:', error);
        throw new Error('Failed to fetch Pokémon count');
      }
    }
  }
};

module.exports = { resolvers };
