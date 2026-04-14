const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM salles");
        res.json(rows);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post("/", async (req, res) => {
    const { nom, capacite_totale } = req.body;

    try {
        await db.query(
            "INSERT INTO salles (nom, capacite_totale) VALUES (?, ?)",
            [nom, capacite_totale]
        );
        res.send("Salle ajoutée");
    } catch (err) {
        res.status(500).json(err);
    }
});

router.delete("/:id", async (req, res) => {
    try {
        await db.query("DELETE FROM salles WHERE id = ?", [req.params.id]);
        res.send("Salle supprimée");
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;