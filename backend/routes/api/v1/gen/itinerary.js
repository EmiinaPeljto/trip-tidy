const express = require("express");
const router = express.Router();
const itineraryController = require("../../../../controllers/itineraryController");
const authenticateToken = require("../../../../middleware/auth");

router.post(
  "/createItinerary",
  itineraryController.createItinerary
);
router.get("/getItineraryById/:id", authenticateToken, itineraryController.getItineraryById);
router.get("/stock", itineraryController.getAllStockItineraries);
router.post(
  "/saveOrUpdateUserItinerary",
  authenticateToken,
  itineraryController.saveOrUpdateUserItinerary
);
router.get("/user/:user_id",authenticateToken, itineraryController.getUserItineraries);

module.exports = router;
