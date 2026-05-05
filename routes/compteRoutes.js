const express = require("express");
const router = express.Router();
const controller = require("../controllers/compteController");
const { verifierSession } = require('../middlewares/authMiddleware');

router.get("/", verifierSession, controller.pageModifierCompte);
router.get("/infos", verifierSession, controller.infosCompte);
router.put("/modifier", verifierSession, controller.modifierCompte);

module.exports = router;