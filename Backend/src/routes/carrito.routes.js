import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

router.post("/api/carrito", async (req, res) => {
    const { client_id, producto_nombre, cantidad = 1 } = req.body;

    if (!client_id || !producto_nombre) {
        return res.status(400).json({ error: "Faltan datos en la solicitud" });
    }

    try {
        // 1. Buscar producto por nombre
        const prodResult = await pool.query(
            "SELECT id_product, product_unit_price FROM product WHERE product_name = $1",
            [producto_nombre]
        );

        if (prodResult.rows.length === 0) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        const producto = prodResult.rows[0];

        // 2. Buscar carrito actual (wish estado 'CARRITO')
        let wishResult = await pool.query(
            "SELECT * FROM wish WHERE fk_client = $1 AND wish_state = 'CARRITO'",
            [client_id]
        );

        let wish;
        if (wishResult.rows.length === 0) {
            // No existe carrito, crear uno
            const insertWish = await pool.query(
                "INSERT INTO wish (fk_client, wish_date, wish_state, wish_total) VALUES ($1, CURRENT_DATE, 'CARRITO', 0) RETURNING *",
                [client_id]
            );
            wish = insertWish.rows[0];
        } else {
            wish = wishResult.rows[0];
        }

        // 3. Insertar producto en wish_detail
        const subtotal = producto.product_unit_price * cantidad;
        const insertDetail = await pool.query(
            "INSERT INTO wish_detail (fk_wish, fk_product, wish_detail_amount, wish_detail_subtotal) VALUES ($1, $2, $3, $4) RETURNING *",
            [wish.id_wish, producto.id_product, cantidad, subtotal]
        );

        // 4. Actualizar total en wish
        await pool.query(
            "UPDATE wish SET wish_total = (SELECT SUM(wish_detail_subtotal) FROM wish_detail WHERE fk_wish = $1) WHERE id_wish = $1",
            [wish.id_wish]
        );

        res.status(201).json({ mensaje: "Producto agregado al carrito", detalle: insertDetail.rows[0] });

    } catch (error) {
        console.error("❌ Error al agregar producto al carrito:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});


router.get("/api/carrito", async (req, res) => {
    const client_id = req.query.client_id || 1; // Por ejemplo

    try {
        // Buscar carrito 'CARRITO'
        const wishResult = await pool.query(
            "SELECT * FROM wish WHERE fk_client = $1 AND wish_state = 'CARRITO'",
            [client_id]
        );

        if (wishResult.rows.length === 0) {
            return res.json({ carrito: [] }); // carrito vacío
        }

        const wish = wishResult.rows[0];

        // Obtener detalles
        const detalles = await pool.query(
            `SELECT wd.id_wish_detail, p.product_name, wd.wish_detail_amount, wd.wish_detail_subtotal
       FROM wish_detail wd
       JOIN product p ON wd.fk_product = p.id_product
       WHERE wd.fk_wish = $1`,
            [wish.id_wish]
        );

        res.json({ carrito: detalles.rows, total: wish.wish_total });

    } catch (error) {
        console.error("❌ Error al obtener carrito:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});


// DELETE /api/carrito/:id
router.delete("/carrito/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query("DELETE FROM wish_detail WHERE id_wish_detail = $1", [id]);
        res.json({ mensaje: "Producto eliminado del carrito" });
    } catch (err) {
        console.error("❌ Error al eliminar del carrito:", err);
        res.status(500).json({ error: "Error al eliminar producto del carrito" });
    }
});


export default router;