import { Pool } from 'pg';

const pool = new Pool({
    host: 'localhost',      // e.g. 'localhost' or your DB host
    port: 5432,             // default PostgreSQL port
    database: 'postgres',// your database name
    user: 'postgres',        // your database user
    password: 'postgres' // your user's password
});

export async function query<T = any>(
    text: string,
    params?: any[]
): Promise<{ rows: T[] }> {
    const result = await pool.query(text, params);
    return { rows: result.rows }
}