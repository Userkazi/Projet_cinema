const e = require("express");
const express = require("express");
const router = express.Router();
const controller = require("../controllers/catalogueController")

router.get("/", controller.pageCatalogue);
router.get("/details/:filmId", controller.pageDetails);
router.get("/films", controller.listeFilms);
router.get("/films/details/:filmId", controller.infosFilm);

module.exports = router;