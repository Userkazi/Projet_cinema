const pool = require("../db");
const HttpError = require("./httpError");

async function creer(req, res, next) {
    try {
        let { nom, rangees, sieges } = req.body;

        if (!nom || !rangees || !sieges) {
            throw new HttpError(400, "Champs manquants");
        }

        rangees = parseInt(rangees);
        sieges = parseInt(sieges);

        const capacite = rangees * sieges;

        // 1. créer salle
        const [result] = await pool.query(
            "INSERT INTO salles (nom, capacite_totale) VALUES (?, ?)",
            [nom, capacite]
        );

        const idSalle = result.insertId;

        // 2. créer sièges
        for (let r = 1; r <= rangees; r++) {
            for (let s = 1; s <= sieges; s++) {

                await pool.query(
                    "INSERT INTO sieges (numero, rangee, id_salle) VALUES (?, ?, ?)",
                    [s, r, idSalle]
                );

            }
        }

        res.status(201).json({ message: "Salle créée avec sièges" });

    } catch (err) {
        next(err);
    }
}

async function liste(req, res, next) {
    try {
        const [rows] = await pool.query("SELECT * FROM salles");
        res.json(rows);
    } catch (err) {
        next(err);
    }
}

module.exports = { creer, liste };