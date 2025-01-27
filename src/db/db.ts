import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres'; 
import * as schema from './schema'; 
import dotenv from 'dotenv';
dotenv.config();

// Initialize the postgres client using the connection URL
const sql = postgres(process.env.DB_URL!, {
  ssl: process.env.NODE_ENV === 'production', // Enable SSL for production if required
});


if (!sql) {
  console.error('Failed to initialize the PostgreSQL client');
  process.exit(1); 
}

export const db = drizzle(sql, {
  schema,
});


