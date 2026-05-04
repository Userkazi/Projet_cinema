const express = require('express');
const router = express.Router();
const { creerAgent, getUtilisateurs, pageAdmin} = require('../controllers/adminController');
const { verifierSession, verifierRole } = require('../middlewares/authMiddleware');

router.get("/", verifierSession, verifierRole([1]), pageAdmin);
router.post('/agents', verifierSession, verifierRole([1]), creerAgent);
router.get('/utilisateurs', verifierSession, verifierRole([1]), getUtilisateurs);

module.exports = router;