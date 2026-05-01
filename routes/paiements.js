const express = require('express');
const router = express.Router();
const controller = require('../controllers/paiementController');
const { verifierSession, verifierRole } = require('../middlewares/authMiddleware');

router.get("/:reservationId", verifierSession, verifierRole([3]), controller.pagePaiement);
router.post('/simuler/:reservationId', verifierSession, verifierRole([3]), controller.simulerPaiement);

module.exports = router;