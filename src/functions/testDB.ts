import postgres from 'postgres';
import dotenv from 'dotenv';
dotenv.config();

const DB_URl = process.env.DB_URL || "postgresql://postgres.sevhbtmkndmeuvsjxgjm:BNoOCPUZruRAGxbc@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"

console.log("DB Connection string: ", DB_URl)


async function testPostgresConnection() {
  try {
    const sql = postgres(DB_URl, {
      ssl: { rejectUnauthorized: false }, // Ensure SSL works for Supabase
    });

    // Test a simple query
    const result = await sql`SELECT 1+1 AS result`;
    console.log('Connection successful:', result);

    // Close the connection
    await sql.end();
  } catch (error) {
    console.error('Error connecting to database:', error);
  }
}

testPostgresConnection();
