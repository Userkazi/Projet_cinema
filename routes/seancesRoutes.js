const express = require("express");
const router = express.Router();
const controller = require("../controllers/seancesController");
const { verifierSession, verifierRole } = require('../middlewares/authMiddleware');

//Création de séances
router.get("/", verifierSession, verifierRole([2]), controller.pageGestion);
router.get("/creer", verifierSession, verifierRole([2]), controller.pageCreer);
router.post("/creer", verifierSession, verifierRole([2]), controller.creer);
router.get("/films", verifierSession, verifierRole([2]), controller.listeFilms);
router.get("/salles-disponibles", verifierSession, verifierRole([2]), controller.sallesDisponibles);

//Affichage de séances
router.get("/historique", verifierSession, verifierRole([2]), controller.pageHistorique);
router.get("/historique-des-seances", verifierSession, verifierRole([2]), controller.listeHistorique);
router.get("/futur", verifierSession, verifierRole([2]), controller.pageFutur);
router.get("/futur-des-seances", verifierSession, verifierRole([2]), controller.listeFutur);

//Suppression de séances
router.delete("/supprimer", verifierSession, verifierRole([2]), controller.supprimer);

//Affichage du plan des sièges d'une séance
router.get("/plan-sieges/:seanceId", verifierSession, verifierRole([2]), controller.pageSieges);

module.exports = router;


// je dois rajouter le id 1 une fois que samuel aura fini le admin