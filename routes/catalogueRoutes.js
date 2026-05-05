const express = require("express");
const router = express.Router();
const controller = require("../controllers/catalogueController");
const { verifierSession, verifierRole } = require('../middlewares/authMiddleware');

router.get("/", verifierSession, verifierRole([2, 3]), controller.pageCatalogue);
router.get("/details/:filmId", verifierSession, verifierRole([2, 3]), controller.pageDetails);
router.get("/films", verifierSession, verifierRole([2, 3]), controller.listeFilms);
router.get("/films/details/:filmId", verifierSession, verifierRole([2, 3]), controller.infosFilm);

module.exports = router;

// je dois rajouter le id 1 une fois que samuel aura fini le admin