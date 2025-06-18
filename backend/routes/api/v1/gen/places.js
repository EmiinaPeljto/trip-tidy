const express = require('express');
const router = express.Router();
const placeController = require('../../../../controllers/placesController');

router.get("/getPlaces", placeController.getPlaces);

module.exports = router;