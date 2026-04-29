const express = require("express");
const controller = require("../controllers/sallesController");

const router = express.Router();

router.get("/", controller.pageGestion);
router.get("/liste", controller.listeSalles);
router.post("/creer", controller.creer);
router.delete("/supprimer", controller.supprimer);

module.exports = router;