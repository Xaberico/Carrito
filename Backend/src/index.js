import express from 'express';
import { pool } from './db.js';
import path from 'path';
import { fileURLToPath } from 'url';
import carritoRoutes from './routes/carrito.routes.js';


const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.resolve(__dirname, '../../frontend')));
app.use(express.json()); // ← Necesario para leer body en POST/DELETE
app.use("/api", carritoRoutes);



app.get('/api/clientes', async (req, res) => {
  try {
    const result = await pool.query('SELECT client_name, client_last_name, client_email FROM client');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en ${PORT}`);
});
