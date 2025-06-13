import { pool } from './db.js';

const res = await pool.query('SELECT * FROM client');
console.log("👥 Clientes:", res.rows);