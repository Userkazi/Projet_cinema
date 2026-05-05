const pool = require('../db');
const HttpError = require("./httpError");
const bcrypt = require('bcrypt');
const path = require('path');

const pageIntrouvable = require("../services/pageIntrouvable");

const chemin = path.join(__dirname, "/../public");

async function pageAdmin(req, res, next) {
    try {
        res.sendFile(path.join(chemin, "admin.html"), (err) => pageIntrouvable(err, next));
    } catch (err) {
        next(err);
    }
}


const creerAgent = async (req, res, next) => {
    const { nom, email, mot_de_passe } = req.body;
    try {  const motDePasseHache = await bcrypt.hash(mot_de_passe, 10);
        await pool.execute(
            'INSERT INTO utilisateurs (nom, email, mot_de_passe, id_role) VALUES (?, ?, ?, 2)', 
            [nom, email, motDePasseHache]
        );
        res.status(201).json({ message: "Agent de cinéma créé avec succès." });
    } catch (erreur) {
        next(erreur);
    }
};
//Boutons de bascule et recuperation de liste des utilisateurs
const getUtilisateurs = async (req, res, next) => {
    try {
        const [users] = await pool.execute('SELECT utilisateurs.id as id, utilisateurs.nom as nom, utilisateurs.email as email, roles.nom as role FROM utilisateurs INNER JOIN roles ON roles.id = utilisateurs.id_role;');
        if (users.length === 0) {
            throw new HttpError(404, "Aucun utilisateurs.");
        }
        res.status(200).json(users);
    } catch (erreur) {
        next(erreur);
    }
};

module.exports = { creerAgent, getUtilisateurs, pageAdmin};