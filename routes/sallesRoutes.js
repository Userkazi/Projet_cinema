const express = require("express");
const controller = require("../controllers/sallescontroller");
const { verifierSession, verifierRole } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get("/", verifierSession, verifierRole([2]), controller.pageGestion);
router.get("/liste", verifierSession, verifierRole([2]), controller.listeSalles);
router.post("/creer", verifierSession, verifierRole([2]),controller.creer);
//router.delete("/supprimer", controller.supprimer);

module.exports = router;