const placeService = require("../services/placeService");

exports.getPlaces = async (req, res) => {
  const { destination, categories, limit = 20 } = req.query;

  try {
    const places = await placeService.getPlaces(destination, categories, limit);
    res.json({ places });
  } catch (error) {
    if (error.message === "Destination not found") {
      return res.status(404).json({ error: "Destination not found" });
    }
    console.error("Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};