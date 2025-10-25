/**
 * GraphQL.
 *
 * Single POST endpoint, typed schema, client decides the shape of the
 * response. Solves over-fetching but moves cache complexity to the client.
 */
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { Store } from "../_shared/store.js";

const typeDefs = /* GraphQL */ `
  type Todo {
    id: ID!
    title: String!
    done: Boolean!
    createdAt: Float!
  }
  type Query {
    todos: [Todo!]!
    todo(id: ID!): Todo
  }
  type Mutation {
    create(title: String!): Todo!
    update(id: ID!, title: String, done: Boolean): Todo
    remove(id: ID!): Boolean!
  }
`;

const resolvers = {
  Query: {
    todos: () => Store.list(),
    todo: (_p, { id }) => Store.get(id),
  },
  Mutation: {
    create: (_p, { title }) => Store.create(title),
    update: (_p, { id, ...patch }) => Store.update(id, patch),
    remove: (_p, { id }) => Store.remove(id),
  },
};

const server = new ApolloServer({ typeDefs, resolvers });
const PORT = Number(process.env.PORT) || 4002;
const { url } = await startStandaloneServer(server, { listen: { port: PORT } });
console.log(`[graphql] ready at ${url}`);
