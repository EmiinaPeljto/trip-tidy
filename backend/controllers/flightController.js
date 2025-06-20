const flightService = require("../services/flightService");

exports.getFlights = async (req, res) => {
  const { origin, destination, start_date, end_date, adults } = req.query;

  // Validate required parameters
  if (!origin || !destination || !start_date || !end_date || !adults) {
    return res.status(400).json({
      error: "Missing required query parameters: origin, destination, start_date, end_date, adults"
    });
  }

  // Validate that dates are in the future
  const today = new Date().toISOString().split('T')[0];
  if (start_date < today || end_date < today) {
    return res.status(400).json({
      error: "Dates must be in the future"
    });
  }

  try {
    const flights = await flightService.getFlights(
      origin,
      destination,
      start_date,
      end_date,
      adults
    );
    res.json({ flights });
  } catch (error) {
    console.error("Error searching for flights:", error);
    // Optionally, show Amadeus error details if available
    if (error.response?.body) {
      try {
        const amadeusError = JSON.parse(error.response.body);
        return res.status(400).json({ error: amadeusError.errors?.[0]?.detail || "Amadeus API error" });
      } catch (e) {}
    }
    res.status(500).json({ error: "Internal server error" });
  }
};