const e = require("express");
const express = require("express");
const router = express.Router();
const controller = require("../controllers/reserverController");
const { verifierSession, verifierRole } = require('../middlewares/authMiddleware');

router.get("/:filmId",verifierSession,verifierRole([3]), controller.pageChoixSeance);
router.get("/seances/:filmId", verifierSession,verifierRole([3]), controller.listeSeances);
router.get("/seance/:seanceId",verifierSession,verifierRole([3]) ,controller.pageChoixSieges);
router.get("/sieges/:seanceId",verifierSession,verifierRole([3]), controller.listeSieges);
router.post("/", verifierSession,verifierRole([3]), controller.reserver);
router.get("/infos-seance/:seanceId", verifierSession,verifierRole([3]), controller.infosSeance);

module.exports = router;