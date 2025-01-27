import {defineConfig} from "drizzle-kit";
import { config } from "dotenv";

config();

export default defineConfig({
  dialect: "postgresql",
  schema:"./src/db/schema/*.ts",
  dbCredentials:{
    url: process.env.DB_URL!,
  },
});

