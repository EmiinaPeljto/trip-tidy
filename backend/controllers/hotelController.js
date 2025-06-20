const hotelservice = require("../services/hotelService");

exports.getHotels = async (req, res) => {
  try {
    const { destination, start_date, end_date, budget, adults } = req.query;

    const hotels = await hotelservice.getHotels(
      destination,
      start_date,
      end_date,
      budget,
      adults
    );
    return res.status(200).json({
      hotels,
    });
  } catch (error) {
    if (error.message === "No destination found") {
      return res.status(404).json({
        success: false,
        error: "No destination found for the specified location",
      });
    }

    if (error.message === "API limit exceeded") {
      return res.status(429).json({
        success: false,
        error: "API rate limit exceeded. Please try again later.",
      });
    }

    // Generic error
    return res.status(500).json({
      success: false,
      error: "Failed to fetch hotel data",
      details: error.message,
    });
  }
};
