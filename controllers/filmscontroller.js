const path = require("path");
const pool = require("../db");

const chemin = path.join(__dirname, "../public");

function pageGestion(req, res) {
    res.sendFile(path.join(chemin, "film.html"));
}

async function listeFilms(req, res, next) {
    try {
        const [rows] = await pool.query("SELECT * FROM films");
        res.json(rows);
    } catch (err) {
        next(err);
    }
}

async function listeCategories(req, res, next) {
    try {
        const [rows] = await pool.query("SELECT id, nom FROM categories");
        res.json(rows);
    } catch (err) {
        next(err);
    }
}

async function creer(req, res, next) {
    try {
        const { titre, duree, url_affiche, categorie_id, classification } = req.body;

        await pool.query(
            "INSERT INTO films (titre, duree, url_affiche, categorie_id, classification) VALUES (?, ?, ?, ?, ?)",
            [titre, duree, url_affiche, categorie_id, classification]
        );

        res.status(201).json({ message: "Film créé" });
    } catch (err) {
        next(err);
    }
}

async function supprimer(req, res, next) {
    try {
        const { id } = req.body;

        await pool.query("DELETE FROM films WHERE id = ?", [id]);

        res.status(200).json({ message: "Film supprimé" });
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