const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Pokemon {
    id: Int
    name: String
    likes: Int
    sprites: Sprites
    height: Float
    weight: Float
    types: [Types]
  }

  type Types {
    slot: Float
    type: Type
  }

  type Type {
    name: String
    url: String
  }

  type Sprites {
    front_default: String
    other: OtherSprites
  }

  type OtherSprites {
    home: HomeSprites
    showdown: ShowdownSprites
  }

  type HomeSprites {
    front_default: String
  }

  type ShowdownSprites {
    front_default: String
    back_default: String
  }


  type PokemonPage {
    total: Int
    pokemons: [Pokemon]
  }

  type Query {
    pokemons(page: Int, limit: Int, sort: String, order: String, type: String): PokemonPage
    pokemonsByTypes(type: String): PokemonPage
  }

`;

module.exports = {typeDefs}
