const { ApolloServer } = require('apollo-server-express');
const { resolvers } = require('./graphql');
const { typeDefs } = require('./schema')

const express = require('express');

const startServer = async (app) => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    context: async ({ req }) => {
      req.setTimeout(10000);
      return {};
    }
  });

  await server.start();
  server.applyMiddleware({ app });

  console.log(`GraphQL Server running at http://localhost:${process.env.BACKEND_PORT}${server.graphqlPath}`);
};

module.exports = startServer;
