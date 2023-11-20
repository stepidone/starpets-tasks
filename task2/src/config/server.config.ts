import { config } from "dotenv";

config();

export default {
  server: {
    host: process.env.SERVER_HOST || "localhost",
    port: parseInt(process.env.SERVER_PORT) || 3000,
  },
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  },
};
