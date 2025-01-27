import { db } from "../db/db";
import * as schema from '../db/schema'; // Adjust the import path as necessary

async function testConnection() {
  try {
    const result = await db
      .select({
        id: schema.users.id,
        name: schema.users.first_name,
        email: schema.users.email,
      })
      .from(schema.users) // Use the users table from the schema
      .execute();
    console.log('Users:', result);
  } catch (error) {
    console.error('Database error:', error);
  }
}

testConnection();