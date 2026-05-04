const express = require("express");
const router = express.Router();
const controller = require("../controllers/compteController");

router.get("/", controller.pageModifierCompte);
router.get("/infos", controller.infosCompte);
router.put("/modifier", controller.modifierCompte);

module.exports = router;