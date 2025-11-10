/**
 * AI Assistance Disclosure:
 * Tool: GitHub Copilot (model: Claude Sonnet 4), date: 2025-10-29
 * Purpose: To add environment-based database configuration for local and production.
 * Author Review: I validated correctness, security, and performance of the code.
 */

import { Pool } from "pg";
import dotenv from 'dotenv';

dotenv.config();

const ENV = process.env.ENV || "LOCAL";

let pool;

if (ENV === "PROD") {
  // Production: Use Supabase with connection string
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });
  
  console.log('[DB] Using Supabase (Pool with connection string)');
} else {
  // Local: Use pg Pool for Docker PostgreSQL
  pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });
  
  console.log('[DB] Using local PostgreSQL (Pool)');
}

export default pool;
