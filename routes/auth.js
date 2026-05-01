const express = require('express');
const router = express.Router();
const controller = require('../controllers/authController');
const { verifierSession } = require('../middlewares/authMiddleware');

router.get("/", controller.pageLogin);
router.post('/login', controller.login);
router.post('/register', controller.registerClient);
router.get('/me', verifierSession, controller.verifierMoi); 

module.exports = router;



//const express = require('express');
//const router = express.Router();

//const { login } = require('../controllers/authController');

//router.post('/login', login);
// ici est une petite modification !
//module.exports = router;