const express = require("express");
const router = express.Router();
const itineraryController = require("../../../../controllers/itineraryController");

router.post("/createItinerary", itineraryController.createItinerary);

module.exports = router;