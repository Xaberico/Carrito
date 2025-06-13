import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

router.get("/client", async (req, res) => {
    const {rows} = await pool.query("SELECT * FROM client");
    console.log(result);

    res.send("Obteniendo usuario");
});

router.get("/users/:id", (req, res) => {
    const { id }  = req.params;
    res.send("Obteniendo usuario" + id)
});

router.post("/users", (req, res) => {
    res.send("Creando usuarios");
});

router.delete("/users/:id", (req, res) => {
    res.send("Eliminando usuarios");
}); 

router.put("/users/:id", (req, res) => {
    const { id } = req.params;
    res.send("Actualizando usuarios" + id);
});

export default router;