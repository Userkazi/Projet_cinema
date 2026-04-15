const path = require("path");
const HttpError = require("./httpError");
const pool = require("../db");

const pageIntrouvable = ((err, next) => {
    if (err) {
        next(new HttpError(404, "Page introuvable"));
    }
});

const chemin = path.join(__dirname, "../public/films");

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

async function listeFilms(req, res, next) {
    try {
        const [rows] = await pool.query("SELECT * FROM films");
        res.json(rows);
    } catch (err) {
        next(err);
    }
}

async function creer(req, res, next) {
    try {
        let { titre, resume, duree } = req.body;

        if (!titre || !resume || !duree) {
            throw new HttpError(400, "Tous les champs doivent être remplis.");
        }

        duree = parseInt(duree);

        await pool.query(
            "INSERT INTO films (titre, resume, duree) VALUES (?, ?, ?)",
            [titre, resume, duree]
        );

        res.status(201).json({ message: "Film créé avec succès." });
    } catch (err) {
        next(err);
    }
}

async function supprimer(req, res, next) {
    try {
        const id = parseInt(req.body.id);

        await pool.query(
            `DELETE FROM films
             WHERE id = ?`,
            [id]
        );

        res.status(204).end();
    } catch (err) {
        next(err);
    }
}

module.exports = { pageGestion, pageCreer, listeFilms, creer, supprimer };