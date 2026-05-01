const path = require("path");
const pool = require('../config/db');

const pageIntrouvable = ((err, next) => {
    if (err) {
        next(new HttpError(404, "Page introuvable"));
    }
});
const chemin = path.join(__dirname, "/../public");
//Page d'paiement
async function pagePaiement(req, res, next) {
    try {
        res.sendFile(path.join(chemin,  "paiement.html"), (err) => pageIntrouvable(err, next));
    }catch (err) {
        next(err);
    }
}

const simulerPaiement = async (req, res) => {
    const id_reservation= req.params.id;
    const { montant} = req.body;

    try {
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
        res.status(500).json({ message: "Erreur serveur lors de la transaction" });
    }
};

module.exports = { simulerPaiement, pagePaiement };