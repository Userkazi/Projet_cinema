const express = require('express');
const router = express.Router();
const { login, registerClient, verifierMoi } = require('../controllers/authController');
const { verifierSession } = require('../middlewares/authMiddleware');

router.post('/login', login);
router.post('/register', registerClient);
router.get('/me', verifierSession, verifierMoi); 

module.exports = router;



//const express = require('express');
//const router = express.Router();

//const { login } = require('../controllers/authController');

//router.post('/login', login);
// ici est une petite modification !
//module.exports = router;