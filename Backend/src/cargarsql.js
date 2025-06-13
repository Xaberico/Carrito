import fs from 'fs';
import { pool } from './db.js';

async function cargarsql() {
  try {
    const sql = fs.readFileSync('Backend/db/DB.sql', 'utf8');
    console.log('📄 Ejecutando script SQL...');
    await pool.query(sql);
    console.log('✅ Tablas creadas correctamente');
  } catch (error) {
    console.error('❌ Error al ejecutar el script SQL:', error.message);
  } finally {
    await pool.end();
  }
}

cargarsql();
