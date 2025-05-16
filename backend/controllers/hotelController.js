const amadeus = require("../config/amadeus");

// Get hotel offers by hotel IDs
const getHotelOffersByHotelIds = async (req, res) => {
  try {
    const hotelIds = req.query.hotelIds; // e.g. "PARCITTA,MCLONGHM"
    if (!hotelIds) {
      return res
        .status(400)
        .json({ message: "Missing required parameter: hotelIds" });
    }

    const response = await amadeus.shopping.hotelOffersSearch.get({ hotelIds });
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching hotel offers:", error);
    res.status(500).json({ message: "Error fetching hotel offers", error });
  }
};

module.exports = {
  getHotelOffersByHotelIds,
};
