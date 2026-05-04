const path = require("path");
const pool = require('../db');
const bcrypt = require('bcrypt'); // Si tu utilises le hachage

const pageIntrouvable = ((err, next) => {
    if (err) {
        next(new HttpError(404, "Page introuvable"));
    }
});
const chemin = path.join(__dirname, "/../public");
//Page de connexion
async function pageLogin(req, res, next) {
    try {
        res.sendFile(path.join(chemin,  "login.html"), (err) => pageIntrouvable(err, next));
    }catch (err) {
        next(err);
    }
}

const login = async (req, res) => {
    const { email, mot_de_passe } = req.body;

    try {
        // 1. Chercher l'utilisateur dans la base de données
        const [utilisateurs] = await pool.execute('SELECT * FROM utilisateurs WHERE email = ?', [email]);
        const user = utilisateurs[0];

        // 2. Vérifier si l'utilisateur existe et si le mot de passe correspond
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non existant." });
        }else if (!(await bcrypt.compare(mot_de_passe, user.mot_de_passe))) {
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
        console.log(erreur);
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

const verifierMoi = async (req, res) => {
   try {
        const [utilisateurs] = await pool.execute(
            'SELECT id, nom, email, id_role as role FROM utilisateurs WHERE id = ?', 
            [req.session.utilisateur.id]
        );
        res.status(200).json(utilisateurs[0]);
    } catch (erreur) {
        res.status(500).json({ message: "Erreur lors de la récupération du profil." });
    }
};

const modifierProfil = async (req, res) => {
    const { nom, email } = req.body;
    const idUtilisateur = req.session.utilisateur.id;

    try {
        await pool.execute(
            'UPDATE utilisateurs SET nom = ?, email = ? WHERE id = ?',
            [nom, email, idUtilisateur]
        );
        res.status(200).json({ message: "Votre profil a été mis à jour avec succès !" });
    } catch (erreur) {
        res.status(500).json({ message: "Erreur lors de la mise à jour. L'email est peut-être déjà utilisé." });
    }
};


module.exports = { login, registerClient, verifierMoi, pageLogin, modifierProfil };