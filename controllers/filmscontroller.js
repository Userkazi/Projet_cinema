const path = require("path");
const HttpError = require("./httpError");
const pool = require("../db");

const chemin = path.join(__dirname, "../public/films");

function pageGestion(req, res, next) {
    try {
        res.sendFile(path.join(chemin, "film.html"));
    } catch (err) {
        next(err);
    }
}

// LISTE FILMS
async function listeFilms(req, res, next) {
    try {
        const [rows] = await pool.query("SELECT * FROM films");
        res.json(rows);
    } catch (err) {
        next(err);
    }
}

// LISTE CATEGORIES
async function listeCategories(req, res, next) {
    try {
        const [rows] = await pool.query("SELECT id, nom FROM categories");
        res.json(rows);
    } catch (err) {
        next(err);
    }
}

// CREER FILM
async function creer(req, res, next) {
    try {
        let { titre, resume, duree, affiche_url, id_categorie, classification } = req.body;

        if (!titre || !resume || !duree || !affiche_url || !id_categorie || !classification) {
            throw new HttpError(400, "Champs manquants");
        }

        duree = parseInt(duree);
        id_categorie = parseInt(id_categorie);

        await pool.query(
            "INSERT INTO films (titre, resume, duree, affiche_url, id_categorie, classification) VALUES (?, ?, ?, ?, ?, ?)",
            [titre, resume, duree, affiche_url, id_categorie, classification]
        );

        res.status(201).json({ message: "Film créé" });

    } catch (err) {
        next(err);
    }
}

// SUPPRIMER FILM
async function supprimer(req, res, next) {
    try {
        const id = parseInt(req.body.id);

        await pool.query("DELETE FROM films WHERE id = ?", [id]);

        res.status(204).end();
    } catch (err) {
        next(err);
    }
}

module.exports = {
    pageGestion,
    listeFilms,
    listeCategories,
    creer,
    supprimer
};