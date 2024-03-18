import mysql from 'mysql2/promise';
import 'dotenv/config';

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: 'PeRson1ified#',
  database: process.env.DB_NAME,
});

export default pool;