const jwt = require('jsonwebtoken');

const verifierToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Accès refusé. Aucun token fourni." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.utilisateur = decoded;
        next();
    } catch (erreur) {
        return res.status(403).json({ message: "Token invalide ou expiré." });
    }
};

const verifierRole = (rolesAutorises) => {
    return (req, res, next) => {
        if (!rolesAutorises.includes(req.utilisateur.id_role)) {
            return res.status(403).json({ message: "Accès interdit. Vous n'avez pas les droits." });
        }
        next();
    };
};

module.exports = { verifierToken, verifierRole };