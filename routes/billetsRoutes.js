const express = require(`express`);
const router = express.Router();
const {pageBillets, infosBillets, creerBillets} = require("../controllers/billetsController");
const { verifierSession, verifierRole } = require('../middlewares/authMiddleware');

router.get("/:reservationId",verifierSession, verifierRole([3]), pageBillets);
router.get("/infos/:reservationId", verifierSession, verifierRole([3]), infosBillets);
router.post("/:reservationId",verifierSession, verifierRole([3]), creerBillets);

module.exports = router;