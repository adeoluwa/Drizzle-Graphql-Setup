import 'dotenv/config';
import { pgTable, integer, text } from "drizzle-orm/pg-core";
import { drizzle } from 'drizzle-orm/postgres-js';
import { seed } from 'drizzle-seed';
import { users } from '../db/schema/users';
import Helper from '../helpers';
import { info } from '../helpers/logger';

const db = drizzle(process.env.DB_URL!);
const hashedPassword = Helper.hash('TEMP_PASSWORD', 10);

const user: typeof users.$inferInsert = {
  first_name: 'John',
  last_name: 'Doe',
  email: 'admin@dev.com',
  password: hashedPassword,
  created_at: new Date(),
  updated_at: new Date(),
};

async function main() {

  // await db.insert(users).values(user);

  await seed(db, {user})
  info({
    message: 'User Seeded Successfully',
    params: user,
  });
}

main();
