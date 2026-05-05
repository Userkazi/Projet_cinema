const express = require("express");
const router = express.Router();
const {pageReservations, listeReservations, annulerReservation} = require("../controllers/reservationsController");
const { verifierSession, verifierRole } = require('../middlewares/authMiddleware');

router.get("/", verifierSession, verifierRole([3]), pageReservations);
router.get("/liste", verifierSession, verifierRole([2]), listeReservations);
router.patch("/annuler/:reservationId", verifierSession, verifierRole([2,3]), annulerReservation);

module.exports = router;