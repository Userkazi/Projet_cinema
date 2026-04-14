const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM films");
        res.json(rows);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post("/", async (req, res) => {
    const { titre, resume, duree } = req.body;

    try {
        await db.query(
            "INSERT INTO films (titre, resume, duree) VALUES (?, ?, ?)",
            [titre, resume, duree]
        );
        res.send("Film ajouté");
    } catch (err) {
        res.status(500).json(err);
    }
});

router.delete("/:id", async (req, res) => {
    try {
        await db.query("DELETE FROM films WHERE id = ?", [req.params.id]);
        res.send("Film supprimé");
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;