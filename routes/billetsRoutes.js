const express = require(`express`);
const router = express.Router();
const controller = require("../controllers/billetsController");

router.get("/:reservationId", controller.pageBillets);
router.get("/infos/:reservationId", controller.infosBillets);
router.post("/:reservationId", controller.creerBillets);

module.exports = router;