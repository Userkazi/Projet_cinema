const express = require('express');
const router = express.Router();
const path = require('path'); 

const { login, registerClient, verifierMoi, modifierProfil } = require('../controllers/authController');
const { verifierSession } = require('../middlewares/authMiddleware');

// --- ROUTES POUR AFFICHER LES PAGES WEB (URLs) ---

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
});

router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/register.html'));
});

router.get('/profil', verifierSession, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/profil.html'));
});

//Pour la deconnexion 

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/auth/login');
});

// --- ROUTES POUR LES ACTIONS (ENVOI DE DONNÉES) ---

router.post('/login', login);
router.post('/register', registerClient);
router.get('/me', verifierSession, verifierMoi);
router.put('/me', verifierSession, modifierProfil);



module.exports = router;



//const express = require('express');
//const router = express.Router();

//const { login } = require('../controllers/authController');

//router.post('/login', login);
// ici est une petite modification !
//module.exports = router;