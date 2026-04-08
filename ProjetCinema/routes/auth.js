const express = require('express');
const router = express.Router();

router.get('/test', (req, res) => {
    res.send("La route auth fonctionne !");
});

// ici est une petite modification !
module.exports = router;