const express = require('express');
const router = express.Router();
const { simulerPaiement } = require('../controllers/paiementController');
const { verifierSession } = require('../middlewares/authMiddleware');

router.post('/simuler/:id', verifierSession, simulerPaiement);

module.exports = router;