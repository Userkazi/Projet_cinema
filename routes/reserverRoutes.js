const e = require("express");
const express = require("express");
const router = express.Router();
const controller = require("../controllers/reserverController");

router.get("/:filmId", controller.pageChoixSeance);
router.get("/seances/:filmId", controller.listeSeances);
router.get("/seance/:seanceId", controller.pageChoixSieges);
router.get("/sieges/:seanceId", controller.listeSieges);
router.post("/", controller.reserver);
router.get("/infos-seance/:seanceId", controller.infosSeance);

module.exports = router;