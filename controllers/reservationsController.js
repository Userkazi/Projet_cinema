const path = require("path");
const HttpError = require("./httpError");
const pool = require("../db");
const pageIntrouvable = require("../services/pageIntrouvable");

const chemin = path.join(__dirname, "/../public/reservations");
//Page listant les réservations
async function pageReservations(req, res, next) {
    try {
        if (parseInt(req.session.utilisateur.role) === 3) {
            res.sendFile(path.join(chemin,  "reservationsClient.html"), (err) => pageIntrouvable(err, next));
        }else if (parseInt(req.session.utilisateur.role) === 2) {
            res.sendFile(path.join(chemin,  "reservationsAgent.html"), (err) => pageIntrouvable(err, next));
        }
    }catch (err) {
        next(err);
    }
}

async function listeReservations(req, res, next) {
    try {
        if (parseInt(req.session.utilisateur.role) === 3) {
            const userId = parseInt(req.session.utilisateur.id);
            const [reservations] = await pool.query(`SELECT reservations.id as id, reservations.date_reservation as date, reservations.statut as statut, films.titre as titre FROM reservations INNER JOIN seances ON reservations.id_seance = seances.id INNER JOIN films ON seances.id_film = films.id WHERE id_utilisateur = ? ORDER BY date_reservation DESC;`, [userId]);
            if (reservations.length === 0) {
                throw new HttpError(404, "Aucune réservation trouvée.");
            }
            res.json(reservations);
        }else if (parseInt(req.session.utilisateur.role) === 2) {
            const [reservations] = await pool.query(`SELECT reservations.id as id, reservations.date_reservation as date, reservations.statut as statut, films.titre as titre FROM reservations INNER JOIN seances ON reservations.id_seance = seances.id INNER JOIN films ON seances.id_film = films.id ORDER BY id;`);
            if (reservations.length === 0) {
                throw new HttpError(404, "Aucune réservation trouvée.");
            }
            res.json(reservations);
        }
    }catch (err) {
        next(err);
    }
}

async function annulerReservation(req, res, next) {
    try {
        const reservationId = parseInt(req.params.reservationId);
        await pool.query(`UPDATE reservations SET statut = "annulé" WHERE id = ?`, [reservationId]);
        await pool.query(`DELETE FROM reservation_sieges WHERE id_reservation = ?;`, [reservationId]);
        await pool.query(`DELETE FROM billets WHERE id_reservation = ?;`, [reservationId]);
        res.sendStatus(200);
    }catch (err) {
        next(err);
    }
}

module.exports = {pageReservations, listeReservations, annulerReservation};