// Load environment variables
import dotenv from "dotenv";
dotenv.config();

// Import PostgreSQL package
import pkg from "pg";

// Extract Pool class from pg package
const { Pool } = pkg;

// Create and export database connection pool
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});