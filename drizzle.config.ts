import { defineConfig } from 'drizzle-kit';

function processEnvOrThrow(key: string): string {
  if (!process.env[key]) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return process.env[key] as string;
}

function parseEnvCredentials(): { host: string, user: string, password: string, database: string, ssl: "require" } {

  const url = processEnvOrThrow("DB_URL");
  const password = processEnvOrThrow("DB_PASSWORD");
  const parsed = new URL(url);
  return { 
    host: parsed.host, 
    user: parsed.username, 
    password, 
    database: parsed.pathname.slice(1),
    ssl: "require",
  };
}

export default defineConfig({
  schema: "./app/db/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: parseEnvCredentials(),
});