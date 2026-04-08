const express = require('express');
const router = express.Router();

router.get('/test', (req, res) => {
    res.send("La route auth fonctionne !");
});

module.exports = router;