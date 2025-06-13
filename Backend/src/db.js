import pg from "pg";

export const pool = new pg.Pool({
  user: "postgres",
  host: "localhost",
  password: "12345",
  database: "carrito",
  port: 5432
});

async function main() { 
  try {
    const timeResult = await pool.query("SELECT NOW()");
    console.log("🕒 Hora actual desde PostgreSQL:", timeResult.rows[0]);

    const tablesResult = await pool.query(
      `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`);
    console.log("🗂️ Tablas:", tablesResult.rows);
  } catch (err) {
    console.error("❌ Error en la consulta:", err);
  } finally {

  }
}


if (process.argv[1].includes('db.js')) {
  main();
}
