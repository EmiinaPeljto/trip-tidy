const express = require("express");
const router = express.Router();
const dayByDayController = require("../../../../controllers/dayByDayController"); 

// Route to get day-by-day itinerary
router.post("/getDayByDay", dayByDayController.getDayByDay);

module.exports = router;