const amadeus = require("../config/amadeus");
const axios = require("axios");

// Function to search for flights
exports.getFlights = async (req, res) => {
  const { origin, destination, start_date, end_date, adults } = req.query;

  try {
    const response = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate: start_date,
      returnDate: end_date,
      adults: adults,
      max: 3, 
    });

    const flights = response.data.map((offer) => {
      const segments = offer.itineraries.flatMap((i) => i.segments);

      return {
        price: offer.price.total,
        currency: offer.price.currency,
        duration: offer.itineraries.map((i) => i.duration),

        // For each segment, show basic info
        segments: segments.map((seg) => ({
          airline: seg.carrierCode,
          flightNumber: seg.number,
          from: seg.departure.iataCode,
          to: seg.arrival.iataCode,
          departure: seg.departure.at,
          arrival: seg.arrival.at,
        })),
      };
    });

    res.json({ flights });
  } catch (error) {
    console.error("Error searching for flights:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


