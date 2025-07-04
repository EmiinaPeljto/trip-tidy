const express = require("express");
const router = express.Router();
const itineraryController = require("../../../../controllers/itineraryController");
const authenticateToken = require("../../../../middleware/auth");

router.post("/createItinerary", authenticateToken, itineraryController.createItinerary);

module.exports = router;