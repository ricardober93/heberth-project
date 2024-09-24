import { defineConfig } from 'drizzle-kit'
export default defineConfig({
  schema: "./server/db/schema.ts",
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
  migrations: {
    prefix: 'supabase'
  }
})