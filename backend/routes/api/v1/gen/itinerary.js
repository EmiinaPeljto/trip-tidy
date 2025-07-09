const express = require("express");
const router = express.Router();
const itineraryController = require("../../../../controllers/itineraryController");
const authenticateToken = require("../../../../middleware/auth");

router.post(
  "/createItinerary",
  authenticateToken,
  itineraryController.createItinerary
);
router.get("/getItineraryById/:id", itineraryController.getItineraryById);
router.post(
  "/saveOrUpdateUserItinerary",
  authenticateToken,
  itineraryController.saveOrUpdateUserItinerary
);

module.exports = router;
