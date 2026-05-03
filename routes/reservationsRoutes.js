const express = require(`express`);
const router = express.Router();
const controller = require("../controllers/reservationsController");

router.get("/", controller.pageReservations);
router.get("/liste", controller.listeReservations);
router.patch("/annuler/:reservationId", controller.annulerReservation);

module.exports = router;