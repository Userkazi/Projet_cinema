const path = require(`path`);
const bcrypt = require('bcrypt');
const HttpError = require("./httpError");
const pool = require("../db");
const pageIntrouvable = require("../services/pageIntrouvable");
const chemin = path.join(__dirname, "/../public/compte");
//Page de modification de compte
async function pageModifierCompte(req, res, next) {
    try {
        res.sendFile(path.join(chemin,  "modifier.html"), (err) => pageIntrouvable(err, next));
    }catch (err) {
        next(err);
    }
}

async function infosCompte(req, res, next) {
    try {
        const id = 1;
        const [infos] = await pool.query(`SELECT nom, email FROM utilisateurs WHERE id = ?`, [id]);
        if (infos.length === 0) {
            throw new HttpError(404, "Compte introuvable.");
        }
        res.json(infos);
    }catch (err) {
        next(err);
    }
}

async function modifierCompte(req, res, next) {
    const { nom, email, mot_de_passe } = req.body;
    try {
        const motDePasseHache = await bcrypt.hash(mot_de_passe, 10);
        const id = 1;
        await pool.query(
            'UPDATE utilisateurs SET nom = ?, email = ?, mot_de_passe = ? WHERE id = ?', 
            [nom, email, motDePasseHache, id]
        );
        res.json({ message: "Compte modifié avec succès." });
    } catch (err) {
        next(err);
    }
}
async function logout(req, res, next) {
    try {
        req.session.destroy();
    }catch (err) {
        next(err);
    }
    res.redirect("/auth");
}

module.exports = {infosCompte, modifierCompte, logout, pageModifierCompte};