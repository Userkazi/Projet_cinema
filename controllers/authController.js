const pool = require('../config/db');
const bcrypt = require('bcrypt'); // Si tu utilises le hachage

const login = async (req, res) => {
    const { email, mot_de_passe } = req.body;

    try {
        // 1. Chercher l'utilisateur dans la base de données
        const [utilisateurs] = await pool.execute('SELECT * FROM utilisateurs WHERE email = ?', [email]);
        const user = utilisateurs[0];

        // 2. Vérifier si l'utilisateur existe et si le mot de passe correspond
        if (!user || !(await bcrypt.compare(mot_de_passe, user.mot_de_passe))) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect." });
        }

        // 3. ENREGISTREMENT DANS LA SESSION
        req.session.utilisateur = {
            id: user.id,
            role: user.id_role
        };

        // 4. Réponse au client pour la redirection
        res.status(200).json({ 
            message: "Connexion réussie", 
            role: user.id_role // On renvoie le rôle pour que le frontend sache où rediriger
        });

    } catch (erreur) {
        res.status(500).json({ message: "Erreur serveur." });
    }

};

const registerClient = async (req, res) => {
    const { nom, email, mot_de_passe } = req.body;
    try {
        const motDePasseHache = await bcrypt.hash(mot_de_passe, 10);
        await pool.execute(
            'INSERT INTO utilisateurs (nom, email, mot_de_passe, id_role) VALUES (?, ?, ?, 3)', 
            [nom, email, motDePasseHache]
        );
        res.status(201).json({ message: "Client créé avec succès." });
    } catch (erreur) {
        res.status(500).json({ message: "Erreur lors de l'inscription." });
    }
};

const verifierMoi = (req, res) => {
    res.status(200).json({ role: req.session.utilisateur.role });
};


module.exports = { login, registerClient, verifierMoi };