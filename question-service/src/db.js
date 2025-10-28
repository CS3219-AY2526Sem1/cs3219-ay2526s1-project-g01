/**
 * AI Assistance Disclosure:
 * Tool: GitHub Copilot (model: Claude Sonnet 4), date: 2025-10-29
 * Purpose: To add environment-based database configuration using postgres library for Supabase.
 * Author Review: I validated correctness, security, and performance of the code.
 */

import postgres from 'postgres';
import { Pool } from "pg";
import dotenv from 'dotenv';

dotenv.config();

const ENV = process.env.ENV || "LOCAL";

let db;

if (ENV === "PROD") {
  // Production: Use Supabase with postgres library
  const sql = postgres(process.env.DATABASE_URL);
  
  // Create a wrapper to match pg's query interface
  db = {
    query: async (text, params = []) => {
      const result = await sql.unsafe(text, params);
      return { rows: result };
    }
  };
  
  console.log('[DB] Using Supabase (postgres library)');
} else {
  // Local: Use pg Pool for Docker PostgreSQL
  db = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });
  
  console.log('[DB] Using local PostgreSQL (pg library)');
}

export default db;
