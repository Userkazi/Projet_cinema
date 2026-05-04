// 1. Vérifier si l'utilisateur est connecté
const verifierSession = (req, res, next) => {
    if (!req.session.utilisateur) {
        return res.redirect("/auth");
    }
    next(); // Il est connecté, on passe à la suite
};

// 2. Vérifier si l'utilisateur a le bon rôle
const verifierRole = (rolesAutorises) => {
    return (req, res, next) => {
        // On récupère le rôle depuis la session
        const roleUtilisateur = req.session.utilisateur.role; 

        if (!rolesAutorises.includes(roleUtilisateur)) {
            return res.status(403).json({ message: "Accès interdit. Rôle insuffisant." });
        }
        next(); // Il a le bon rôle, on passe à la suite
    };
};

module.exports = { verifierSession, verifierRole };