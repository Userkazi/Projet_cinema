const path = require("path");
const pool = require('../db');
const HttpError = require("./httpError");

const pageIntrouvable =require("../services/pageIntrouvable");
const chemin = path.join(__dirname, "/../public");
//Page d'paiement
async function pagePaiement(req, res, next) {
    try {
        res.sendFile(path.join(chemin,  "paiement.html"), (err) => pageIntrouvable(err, next));
    }catch (err) {
        next(err);
    }
}

const simulerPaiement = async (req, res, next) => {
    const id_reservation= parseInt(req.params.reservationId);
    try {
        const [infosReservation] = await pool.query(`SELECT seances.prix as prix from reservations INNER JOIN seances ON seances.id = reservations.id_seance WHERE reservations.id = ?;`, [id_reservation]);
        const montantUnite = parseFloat(infosReservation[0].prix);
        const [sieges] = await pool.query(`SELECT id_siege FROM reservation_sieges WHERE id_reservation = ?;`, [id_reservation]);
        const montant = montantUnite * sieges.length;
        await pool.execute(
            'INSERT INTO paiements (montant, id_reservation) VALUES (?, ?)',
            [montant, id_reservation]
        );
        await pool.execute(
            'UPDATE reservations SET statut = ? WHERE id = ?',
            ['payé', id_reservation]
        );
        res.status(201).json({ message: "Paiement enregistré et réservation confirmée !", id_reservation});
    } catch (erreur) {
        next(erreur);
    }
};

module.exports = { simulerPaiement, pagePaiement };