const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// 1. INSCRIPTION
const register = async (req, res) => {
    const { nom, email, mot_de_passe } = req.body;

    if (!nom || !email || !mot_de_passe) {
        return res.status(400).json({ message: "Tous les champs sont requis." });
    }

    try {
        // Hacher le mot de passe
        const salt = await bcrypt.genSalt(10);
        const motDePasseHache = await bcrypt.hash(mot_de_passe, salt);

        // Insérer dans la base de données (ID rôle 3 = Client par défaut)
        const [result] = await pool.execute(
            'INSERT INTO utilisateurs (nom, email, mot_de_passe, id_role) VALUES (?, ?, ?, ?)',
            [nom, email, motDePasseHache, 3] 
        );

        res.status(201).json({ message: "Utilisateur créé avec succès !" });
    } catch (erreur) {
        console.error(erreur);
        // Code d'erreur MySQL pour un email déjà utilisé
        if (erreur.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: "Cet email est déjà utilisé." });
        }
        res.status(500).json({ message: "Erreur lors de l'inscription." });
    }
};

// 2. CONNEXION
const login = async (req, res) => {
    const { email, mot_de_passe } = req.body;

    try {
        // Cherche l'utilisateur
        const [utilisateurs] = await pool.execute('SELECT * FROM utilisateurs WHERE email = ?', [email]);
        
        if (utilisateurs.length === 0) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect." });
        }

        const utilisateur = utilisateurs[0];

        // Compare le mot de passe
        const motDePasseValide = await bcrypt.compare(mot_de_passe, utilisateur.mot_de_passe);
        if (!motDePasseValide) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect." });
        }

        // Créer le jeton (Token)
        const token = jwt.sign(
            { id: utilisateur.id, id_role: utilisateur.id_role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({ 
            message: "Connexion réussie", 
            token: token,
            role: utilisateur.id_role 
        });

    } catch (erreur) {
        console.error(erreur);
        res.status(500).json({ message: "Erreur lors de la connexion." });
    }
};

// 3. MODIFICATION PROFIL 
const modifierProfil = async (req, res) => {
    const userId = req.utilisateur.id; 
    const { nom, email } = req.body;

    if (!nom || !email) {
        return res.status(400).json({ message: "Le nom et l'email sont requis." });
    }

    try {
        const [result] = await pool.execute(
            'UPDATE utilisateurs SET nom = ?, email = ? WHERE id = ?',
            [nom, email, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Utilisateur non trouvé." });
        }

        res.status(200).json({ message: "Profil mis à jour avec succès." });

    } catch (erreur) {
        console.error(erreur);
        res.status(500).json({ message: "Erreur serveur." });
    }
};

module.exports = { modifierProfil };