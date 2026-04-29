const pool = require('../config/db');
const bcrypt = require('bcrypt');

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

module.exports = { creerAgent };