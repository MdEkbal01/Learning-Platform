import "dotenv/config";
import { defineConfig } from "prisma/config";

const NEON_DEFAULT_URL = "file:./dev.db";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: process.env.DATABASE_URL || NEON_DEFAULT_URL,
  },
});
