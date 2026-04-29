const path = require("path");
const HttpError = require("./httpError");
const pool = require("../db");

const pageIntrouvable = ((err, next) => {
    if (err) {
        next(new HttpError(404, "Page introuvable"));
    }
});
const chemin = path.join(__dirname, "/../public/catalogue");
//Page d'acceuille avec la liste des films
async function pageCatalogue(req, res, next) {
    try {
        res.sendFile(path.join(chemin,  "catalogue.html"), (err) => pageIntrouvable(err, next));
    }catch (err) {
        next(err);
    }
}
//Page de détails d'un film
async function pageDetails(req, res, next) {
    try {
        res.sendFile(path.join(chemin,  "details.html"), (err) => pageIntrouvable(err, next));
    }catch (err) {
        next(err);
    }
}
//Liste des films
async function listeFilms(req, res, next) {
    try {
        const [films] = await pool.query(`
            SELECT DISTINCT films.id as id, films.titre as titre, categories.nom as categorie, films.classification as classification, films.affiche_url as url FROM films
            INNER JOIN seances ON films.id = seances.id_film
            LEFT JOIN categories ON films.id_categorie = categories.id;`);
        if (films.length === 0) {
            throw new HttpError(404, "Aucun film disponible");
        }
        res.json(films);
    }catch (err) {
        next(err);
    }
}

//Détails d'un film
async function infosFilm(req, res, next) {
    try {
        const filmId = parseInt(req.params.filmId);
        const [film] = await pool.query(`
            SELECT DISTINCT films.id as id, films.titre as titre, categories.nom as categorie, films.classification as classification, films.affiche_url as url, films.resume as resume, films.duree as duree FROM films
            LEFT JOIN seances ON films.id = seances.id_film
            LEFT JOIN categories ON films.id_categorie = categories.id
            WHERE films.id = ?;`, [filmId]);
        if (film.length === 0) {
            throw new HttpError(404, "Ce film n'existe pas.");
        }
        res.json(film);
    }catch (err) {
        next(err);
    }
}

module.exports = {pageCatalogue, pageDetails, listeFilms, infosFilm};