const express = require('express');
const router = express.Router();
const path = require('path');
const { verifierSession, verifierRole } = require('../middlewares/authMiddleware');

router.get('/', verifierSession, verifierRole([3]), (req, res) => {
    res.sendFile(path.join(__dirname, '../public/client.html'));
});

module.exports = router;