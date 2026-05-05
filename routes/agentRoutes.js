const express = require('express');
const router = express.Router();
const path = require('path');
const { verifierSession, verifierRole } = require('../middlewares/authMiddleware');

router.get('/', verifierSession, verifierRole([2]), (req, res) => {
    res.sendFile(path.join(__dirname, '../public/agent.html'));
});

module.exports = router;