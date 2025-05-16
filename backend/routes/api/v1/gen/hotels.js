const express = require("express");
const router = express.Router();
const {
  getHotelOffersByHotelIds,
} = require("../../../../controllers/hotelController");

router.get("/hotels", getHotelOffersByHotelIds);

module.exports = router;