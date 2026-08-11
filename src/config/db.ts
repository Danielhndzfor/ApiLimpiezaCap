import mysql from 'mysql2/promise';
import { env } from './env';
import { colors, printBanner } from '../utils/consoleColors';

export const pool = mysql.createPool({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.password,
  database: env.db.name,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function testConnection(): Promise<void> {
  const connection = await pool.getConnection();
  try {
    await connection.query('SELECT 1');
    printBanner(
      ['Conexión a MariaDB establecida correctamente', `Base de datos: ${env.db.name}@${env.db.host}`],
      colors.green
    );
  } finally {
    connection.release();
  }
}
