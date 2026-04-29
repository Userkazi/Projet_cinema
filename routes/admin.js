const express = require('express');
const router = express.Router();
const { creerAgent } = require('../controllers/adminController');
const { verifierSession, verifierRole } = require('../middlewares/authMiddleware');

router.post('/agents', verifierSession, verifierRole([1]), creerAgent);

module.exports = router;