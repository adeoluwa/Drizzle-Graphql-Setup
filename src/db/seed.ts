import "dotenv/config";
import {drizzle} from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import { users } from "./schema/users";
import Helper from "../helpers";
import { info } from "../helpers/logger";

const db = drizzle(process.env.DB_URL!);

async function main(){

  const hashedPassword = Helper.hash("TEMP_PASSWORD",10)

  const user: typeof users.$inferInsert = {
    first_name: "John",
    last_name: "Doe",
    email: "admin@dev.com",
    password: hashedPassword,
  };

  await db.insert(users).values(user);
  info({
    message:"User Seeded Successfully",
    params:user
  });
}

main();