const path = require("path");
const HttpError = require("./httpError");
const pool = require("../db");
const pageIntrouvable = require("../services/pageIntrouvable");
const crypto = require("crypto");

const chemin = path.join(__dirname, "/../public/billets");
//Page de billets
async function pageBillets(req, res, next) {
    try {
        res.sendFile(path.join(chemin,  "billets.html"), (err) => pageIntrouvable(err, next));
    }catch (err) {
        next(err);
    }
}

async function infosBillets(req, res, next) {
    try {
        const reservationId = parseInt(req.params.reservationId);
        const [infos] = await pool.query(`SELECT reservation_sieges.numero_billet as no, sieges.rangee as rangee, sieges.numero as numero, films.titre as titre, salles.nom as salle, seances.date_heure as quand FROM reservation_sieges
            Inner JOIN sieges ON sieges.id = reservation_sieges.id_siege
            INNER JOIN reservations ON reservations.id = reservation_sieges.id_reservation
            INNER JOIN seances ON seances.id = reservations.id_seance
            INNER JOIN films ON seances.id_film = films.id
            INNER JOIN salles ON salles.id = seances.id_salle
            WHERE reservation_sieges.id_reservation = ?`, [reservationId]);
        if (infos.length === 0) {
            throw new HttpError(404, "Aucun billets associés à cette réservation.");
        }
        res.json(infos);
    }catch (err) {
        next(err);
    }
}

async function creerBillets(req, res, next) {
    try {
        const reservationId = parseInt(req.params.reservationId);
        const [billets] = await pool.query(`SELECT id_siege FROM reservation_sieges WHERE id_reservation = ?;`, [reservationId]);
        for (let i = 0; i<billets.length; i++) {
            const siegeId = billets[i].id_siege;
            const noBillet =  `${reservationId}-${siegeId}${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
            await pool.query(`UPDATE reservation_sieges SET numero_billet = ? WHERE id_reservation = ? AND id_siege = ?;`, [noBillet, reservationId, siegeId]);
        }
        res.sendStatus(201);
    }catch (err) {
        next(err);
    }
}

module.exports = {pageBillets, infosBillets, creerBillets};