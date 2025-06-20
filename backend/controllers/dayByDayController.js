const dayByDayService = require("../services/dayByDayService");

exports.getDayByDay = async (req, res) => {
  const { destination, start_date, end_date, preferences, trip_type } =
    req.body;

  if (!destination || !start_date || !end_date || !preferences || !trip_type) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const itinerary = await dayByDayService.generateDayByDay({
      destination,
      start_date,
      end_date,
      preferences,
      trip_type,
    });
    return res.status(200).json(itinerary);
  } catch (error) {
    console.error("Error in getDayByDay:", error.message);
    if (error.status === 404) {
      return res.status(404).json({ error: error.message });
    }
    if (error.isAxiosError) {
      return res.status(502).json({
        error: "Failed to fetch required places data.",
        details:
          error.response?.data?.error || "The places service may be down.",
      });
    }
    return res.status(500).json({
      error: "Failed to generate itinerary",
      details: error.message,
    });
  }
};
