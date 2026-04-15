const path = require("path");
const HttpError = require("./httpError");
const pool = require("../db");

const pageIntrouvable = ((err, next) => {
    if (err) {
        next(new HttpError(404, "Page introuvable"));
    }
});

const chemin = path.join(__dirname, "../public/salles");

function pageCreer(req, res, next) {
    try {
        res.sendFile(path.join(chemin, "creer.html"), (err) => pageIntrouvable(err, next));
    } catch (err) {
        next(err);
    }
}

function pageGestion(req, res, next) {
    try {
        res.sendFile(path.join(chemin, "gestion.html"), (err) => pageIntrouvable(err, next));
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
        let { nom, capacite_totale } = req.body;

        if (!nom || !capacite_totale) {
            throw new HttpError(400, "Tous les champs doivent être remplis.");
        }

        capacite_totale = parseInt(capacite_totale);

        await pool.query(
            "INSERT INTO salles (nom, capacite_totale) VALUES (?, ?)",
            [nom, capacite_totale]
        );

        res.status(201).json({ message: "Salle créée avec succès." });
    } catch (err) {
        next(err);
    }
}

async function supprimer(req, res, next) {
    try {
        const id = parseInt(req.body.id);

        await pool.query(
            `DELETE FROM salles
             WHERE id = ?`,
            [id]
        );

        res.status(204).end();
    } catch (err) {
        next(err);
    }
}

module.exports = { pageGestion, pageCreer, listeSalles, creer, supprimer };