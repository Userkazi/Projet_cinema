const express = require("express");
const router = express.Router();
const controller = require("../controllers/seancesController");
//Création de séances
router.get("/", controller.pageGestion);
router.get("/creer", controller.pageCreer);
router.post("/creer", controller.creer);
router.get("/films", controller.listeFilms);
router.get("/salles-disponibles", controller.sallesDisponibles);

//Affichage de séances
router.get("/historique", controller.pageHistorique);
router.get("/historique-des-seances", controller.listeHistorique);
router.get("/futur", controller.pageFutur);
router.get("/futur-des-seances", controller.listeFutur);

//Suppression de séances
router.delete("/supprimer", controller.supprimer);

//Affichage du plan des sièges d'une séance
router.get("/plan-sieges/:seanceId", controller.pageSieges);

module.exports = router;