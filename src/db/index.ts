import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema.ts';

let pool: Pool | null = null;
let dbInstance: any = null;

export function getDatabase() {
  if (!dbInstance) {
    const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/rental_ledger';
    try {
      const isSupabase = connectionString.includes('supabase');
      pool = new Pool({
        connectionString,
        max: 5,
        connectionTimeoutMillis: 5000,
        ssl: isSupabase ? { rejectUnauthorized: false } : undefined,
      });

      pool.on('error', (err) => {
        console.error('Unexpected error on PostgreSQL pool:', err);
      });

      dbInstance = drizzle(pool, { schema });
      console.log('Connected to PostgreSQL database successfully.');
    } catch (error) {
      console.error('Failed to initialize PostgreSQL pool:', error);
      // Fallback or handle gracefully
    }
  }
  return dbInstance;
}

export const db = getDatabase();
