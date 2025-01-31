import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import postgres from 'postgres';
import { info, error as logError, warn } from './helpers/logger';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';
import dotenv from 'dotenv';
import { IncomingMessage } from 'http';
import jwt from 'jsonwebtoken';

dotenv.config();


const sql = postgres(process.env.DB_URL!, {
  ssl: process.env.NODE_ENV === 'production',
});

async function testDbConnection() {
  try {
    await sql`SELECT 1`; // Simple query to test connection
    info({ message: 'Database connection successful!' });
  } catch (err) {
    if (err instanceof Error) {
      logError({
        message: 'Failed to connect to the database!',
        params: {
          name: err.name,
          message: err.message,
          stack: err.stack,
        },
      });
    }
    process.exit(1); // Exit the process if the connection fails
  }
}

if (!process.env.DB_URL) {
  logError({ message: 'DB_URL is not defined in environment variables!' });
  process.exit(1);
}

if (!sql) {
  logError({ message: 'Failed to initialize PostgreSQL client' });
  process.exit(1);
}

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const server = new ApolloServer({ schema });

async function startServer() {
  await testDbConnection();

  const { url } = await startStandaloneServer(server, {
    context: async ({ req }: { req: IncomingMessage }) => {
      const authHeader = req.headers['authorization'];
      let user = null;

      if (authHeader?.startsWith('Bearer')) {
        const token = authHeader.split(' ')[1];

        try {
          user = jwt.verify(token, process.env.JWT_SECRET as string);
        } catch (error) {
          console.error('Invalid token:', error);
          throw new Error("Invalid Token!")
        }
      } else {
        warn({ message: 'No valid Bearer token provided' });
      }

      return {
        user,
      };
    },
    listen: { port: 5000 },
  });

  console.log(`🚀 Server ready at ${url}`);
}

startServer();
