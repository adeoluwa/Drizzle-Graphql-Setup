// import { buildSchema } from 'drizzle-graphql';
// import { drizzle } from 'drizzle-orm/postgres-js';
// import * as dbSchema from './db/schema';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import postgres from 'postgres'; 
import { info, error as logError } from './helpers/logger';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { typeDefs } from './graphql/schema';
import { resolvers} from './graphql/resolvers';
import dotenv from 'dotenv';
dotenv.config();

const sql = postgres(process.env.DB_URL!,{
  ssl:process.env.NODE_ENV === "production"
})

// info({
//   message:"DB Connection DB:",
//   params:process.env.DB_URL
// });

if (!process.env.DB_URL) {
  logError({ message: "DB_URL is not defined in environment variables!" });
  process.exit(1);
}

if(!sql){
  logError({message:"Failed to initialize PostgreSQL client"});
  process.exit(1)
}

// const dbInstance = drizzle(sql, { schema: dbSchema });

// const { schema } = buildSchema(dbInstance);

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

const server = new ApolloServer({ schema });

async function startServer() {
  const { url } = await startStandaloneServer(server);
  console.log(`🚀 Server ready at ${url}`);
}

startServer();
