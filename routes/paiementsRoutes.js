const express = require('express');
const router = express.Router();
const { pagePaiement, simulerPaiement}= require('../controllers/paiementController');
const { verifierSession, verifierRole } = require('../middlewares/authMiddleware');

router.get("/:reservationId", verifierSession, verifierRole([3]), pagePaiement);
router.post('/simuler/:reservationId', verifierSession, verifierRole([3]), simulerPaiement);

module.exports = router;
 