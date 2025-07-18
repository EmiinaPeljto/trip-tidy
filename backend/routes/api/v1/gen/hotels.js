const express = require('express');
const router = express.Router();
const hotelController = require('../../../../controllers/hotelController'); 

router.get("/getHotels", hotelController.getHotels);

module.exports = router;