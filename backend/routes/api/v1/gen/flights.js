const express = require('express');
const router = express.Router();
const flightController = require('../../../../controllers/flightController');

router.get("/getFlights", flightController.getFlights);

module.exports = router;