const path = require("path");
const HttpError = require("./httpError");
const pool = require("../db");

const pageIntrouvable = ((err, next) => {
    if (err) {
        next(new HttpError(404, "Page introuvable"));
    }
});

const chemin = path.join(__dirname, "../public/salles");

function pageGestion(req, res, next) {
    try {
        res.sendFile(path.join(chemin, "salle.html"), (err) => pageIntrouvable(err, next));
    } catch (err) {
        next(err);
    }
}

async function listeSalles(req, res, next) {
    try {
        const [rows] = await pool.query("SELECT * FROM salles");
        res.json(rows);
    } catch (err) {
        next(err);
    }
}

async function creer(req, res, next) {
    try {
        let { nom, rangees, sieges } = req.body;

        if (!nom || !rangees || !sieges) {
            throw new HttpError(400, "Tous les champs doivent être remplis.");
        }

        rangees = parseInt(rangees);
        sieges = parseInt(sieges);

        const capacite_totale = rangees * sieges;

        const [result] = await pool.query(
            "INSERT INTO salles (nom, capacite_totale) VALUES (?, ?)",
            [nom, capacite_totale]
        );

        const id_salle = result.insertId;

        for (let r = 1; r <= rangees; r++) {
            for (let s = 1; s <= sieges; s++) {
                await pool.query(
                    "INSERT INTO sieges (numero, rangee, id_salle) VALUES (?, ?, ?)",
                    [s, r, id_salle]
                );
            }
        }

        res.status(201).json({ message: "Salle créée avec ses sièges." });

    } catch (err) {
        next(err);
    }
}

async function supprimer(req, res, next) {
    try {
        const id = parseInt(req.body.id);

        await pool.query(
            "DELETE FROM salles WHERE id = ?",
            [id]
        );

        res.status(204).end();
    } catch (err) {
        next(err);
    }
}

module.exports = { pageGestion, listeSalles, creer, supprimer };