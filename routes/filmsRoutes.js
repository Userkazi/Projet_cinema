const express = require("express");
const controller = require("../controllers/filmscontroller");
const { verifierSession, verifierRole } = require('../middlewares/authMiddleware');


const router = express.Router();

router.get("/",verifierSession, verifierRole([2]),controller.pageGestion);
router.get("/liste", verifierSession, verifierRole([2]), controller.listeFilms);
router.get("/categories", verifierSession, verifierRole([2]), controller.listeCategories);

router.post("/creer", controller.creer);
//router.delete("/supprimer", controller.supprimer);

module.exports = router;