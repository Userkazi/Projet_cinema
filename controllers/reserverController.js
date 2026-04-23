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
function pageChoixSieges(req, res, next) {
    try {
        res.sendFile(path.join(chemin,  "choixSieges.html"), (err) => pageIntrouvable(err, next));
    }catch (err) {
        next(err);
    }
}

//lister les séances disponibles pour un film
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

//Lister les sièges
async function listeSieges(req,res, next) {
    try {
        const seanceId = parseInt(req.params.seanceId);
        const [sieges] = await pool.query(`
            SELECT sieges.id as id, sieges.rangee as rangee, sieges.numero as numero
            FROM sieges
            INNER JOIN salles ON salles.id = sieges.id_salle
            INNER JOIN seances ON seances.id_salle = salles.id
            WHERE seances.id = ?
            ORDER BY sieges.rangee ASC, sieges.numero ASC;
        `, [seanceId]);
        let nrangee = 0;
        const liste = [[]];
        for (let i=0; i<sieges.length; i++) {
            if ((sieges[i].rangee - 1) !== nrangee) {
                liste.push([]);
                nrangee ++;
            }
            liste[nrangee].push(sieges[i]);
        }
        const [siegesReserves] = await pool.query(`
            SELECT reservation_sieges.id_siege as id
            FROM reservation_sieges
            INNER JOIN reservations ON reservations.id = reservation_sieges.id_reservation
            WHERE reservations.id_seance = ?;`, [seanceId]);
            const listeSR = [2, 6, 8];
            for (let i=0; i<siegesReserves.length; i++) {
                listeSR.push(siegesReserves[i].id);
            }
            for (let i=0; i<liste.length; i++) {
                for (let j=0; j<liste[i].length; j++) {
                    if (listeSR.includes(liste[i][j].id)) {
                        liste[i][j].reserve = true;
                    }
                }
            }
        res.json(liste);
    }catch (err) {
        next(err);
    }
}

module.exports = {pageChoixSeance, pageChoixSieges, listeSeances, listeSieges};