import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL!;

// Connection pool configuration
const sql = postgres(connectionString, {
  max: 10, // Maximum number of connections in pool
  idle_timeout: 20, // Max idle time for a connection (in seconds)
  connect_timeout: 10, // Connection timeout (in seconds)
  prepare: false,
});

// Create drizzle instance with the pooled connection
export const db = drizzle(sql, { schema });

// Cleanup function to be called when shutting down
export async function closeConnection() {
  await sql.end();
}

// Handle cleanup on process termination
process.on('SIGTERM', async () => {
  await closeConnection();
  process.exit(0);
});

process.on('SIGINT', async () => {
  await closeConnection();
  process.exit(0);
});