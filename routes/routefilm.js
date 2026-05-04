const express = require("express");
const controller = require("../controllers/filmsController");

const router = express.Router();

router.get("/", controller.pageGestion);
router.get("/liste", controller.listeFilms);
router.get("/categories", controller.listeCategories);

router.post("/creer", controller.creer);
router.delete("/supprimer", controller.supprimer);

module.exports = router;