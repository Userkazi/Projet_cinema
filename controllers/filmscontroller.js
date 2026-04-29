const path = require("path");
const HttpError = require("./httpError");
const pool = require("../db");

const pageIntrouvable = ((err, next) => {
    if (err) {
        next(new HttpError(404, "Page introuvable"));
    }
});

const chemin = path.join(__dirname, "../public/film");

function pageGestion(req, res, next) {
    try {
        res.sendFile(path.join(chemin, "film.html"), (err) => pageIntrouvable(err, next));
    } catch (err) {
        next(err);
    }
}

async function listeFilms(req, res, next) {
    try {
        const [rows] = await pool.query("SELECT * FROM films");
        if (rows.length === 0) {
            //throw new HttpError(404, Aucunes salles)
        }
        res.json(rows);
    } catch (err) {
        next(err);
    }
}

async function creer(req, res, next) {
    try {
        let { titre, resume, duree, affiche_url, id_categorie, classification } = req.body;

        if (!titre || !resume || !duree || !affiche_url || !id_categorie || !classification) {
            throw new HttpError(400, "Tous les champs doivent être remplis.");
        }

        duree = parseInt(duree);
        id_categorie = parseInt(id_categorie);

        await pool.query(
            "INSERT INTO films (titre, resume, duree, affiche_url, id_categorie, classification) VALUES (?, ?, ?, ?, ?, ?)",
            [titre, resume, duree, affiche_url, id_categorie, classification]
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
            "DELETE FROM films WHERE id = ?",
            [id]
        );

        res.status(204).end();
    } catch (err) {
        next(err);
    }
}

module.exports = { pageGestion, listeFilms, creer, supprimer };