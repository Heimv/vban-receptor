import { ApolloServer } from "apollo-server";
import dotenv from "dotenv";
import resolvers from "../Graphql/Resolvers";
import typeDefs from "../Graphql/Schema";

dotenv.config();
process.env.connected = "0";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  subscriptions: {
    path: "/audio",
    onConnect: (connectionParams, webSocket, context) => {
      console.log("Client connected");
      // process.env.connected = (parseInt(process.env.connected || "0", 10) + 1).toString();
    },
    onDisconnect: (webSocket, context) => {
      console.log("Client disconnected");
      // process.env.connected = (parseInt(process.env.connected || "1", 10) - 1).toString();
    },
  },
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
