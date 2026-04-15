const path = require("path");
const HttpError = require("./httpError");
const session = require("express-session");
const pool = require("../db");

const pageIntrouvable = ((err, next) => {
    if (err) {
        next(new HttpError(404, "Page introuvable"));
    }
});
const chemin = path.join(__dirname, "/../public/reserver");
function pageChoixSeance(req, res, next) {
    try {
        res.sendFile(path.join(chemin,  "choixSeance.html"), (err) => pageIntrouvable(err, next));
    }catch (err) {
        next(err);
    }
}


async function listeSeances(req, res, next) {
    try {
        const film = parseInt(req.params.filmId);
        const [seances] = await pool.query(`
            SELECT seances.id as id, seances.date_heure as quand, seances.prix as prix, salles.capacite_totale - count(reservation_sieges.id_siege) as libre, count(reservation_sieges.id_siege) as reserve
            FROM seances
            INNER JOIN salles ON seances.id_salle = salles.id
            LEFT JOIN reservations ON reservations.id_seance = seances.id AND reservations.statut != 'annulé'
            LEFT JOIN reservation_sieges ON reservation_sieges.id_reservation = reservations.id
            WHERE seances.date_heure > now() AND seances.id_film = ?
            GROUP BY seances.id, seances.date_heure, seances.prix, salles.capacite_totale
            Order by seances.date_heure ASC;
            `,
            [film]
        );
        if (seances.length === 0) {
            throw new HttpError(404, "Aucune séance n'est disponible pour ce film.")
        }
        res.json(seances);
    }catch (err) {
        next(err);
    }
}

module.exports = {pageChoixSeance, listeSeances};