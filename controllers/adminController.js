const pool = require('../config/db');
const bcrypt = require('bcrypt');
const path = require('path');

const pageIntrouvable = ((err, next) => {
    if (err) {
        next(new HttpError(404, "Page introuvable")); 
    }
});

const chemin = path.join(__dirname, "/../public");

async function pageAdmin(req, res, next) {
    try {
        res.sendFile(path.join(chemin, "admin.html"), (err) => pageIntrouvable(err, next));
    } catch (err) {
        next(err);
    }
}


const creerAgent = async (req, res) => {
    const { nom, email, mot_de_passe } = req.body;
    try {
        const motDePasseHache = await bcrypt.hash(mot_de_passe, 10);
        await pool.execute(
            'INSERT INTO utilisateurs (nom, email, mot_de_passe, id_role) VALUES (?, ?, ?, 2)', 
            [nom, email, motDePasseHache]
        );
        res.status(201).json({ message: "Agent de cinéma créé avec succès." });
    } catch (erreur) {
        res.status(500).json({ message: "Erreur serveur." });
    }
};
//Boutons de bascule et recuperation de liste des utilisateurs
const getUtilisateurs = async (req, res) => {
    try {
        const [users] = await pool.execute('SELECT id, nom, email, id_role FROM utilisateurs');
        res.status(200).json(users);
    } catch (erreur) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

module.exports = { creerAgent, getUtilisateurs, pageAdmin};