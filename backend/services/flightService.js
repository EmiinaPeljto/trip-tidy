const amadeus = require("../config/amadeus");

exports.getFlights = async (origin, destination, start_date, end_date, adults) => {
  try {
    const response = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate: start_date,
      returnDate: end_date,
      adults: adults,
      max: 3,
    });

    return response.data.map((offer) => {
      const segments = offer.itineraries.flatMap((i) => i.segments);

      return {
        price: offer.price.total,
        currency: offer.price.currency,
        duration: offer.itineraries.map((i) => i.duration),
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
  } catch (error) {
    console.error("Error searching for flights:", error);
    throw error;
  }
};