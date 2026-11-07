import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import 'dotenv/config';
import * as schema from './schema.js';

const connectionUri = process.env.DATABASE_URL || 'mysql://creafolio_user:creafolio_password@127.0.0.1:3307/creafolio_db';

const poolConnection = mysql.createPool(connectionUri);

export const db = drizzle(poolConnection, { schema, mode: 'default' });
export { poolConnection };
