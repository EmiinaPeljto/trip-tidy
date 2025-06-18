const { callTogetherAI } = require("../utils/togetherAI");
const axios = require("axios");

exports.getDayByDay = async (req, res) => {
  try {
    const { destination, start_date, end_date, categories, trip_type } =
      req.body;

    if (!destination || !start_date || !end_date || !categories || !trip_type) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Fetch places from the API. The main try/catch will handle errors.
    const response = await axios.get(
      `http://localhost:3001/api/v1/gen/places/getPlaces?destination=${encodeURIComponent(
        destination
      )}&categories=${encodeURIComponent(categories)}`
    );
    const places = response.data.places || [];

    if (!places || places.length === 0) {
      return res
        .status(404)
        .json({ error: "No places found for this destination." });
    }

    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    const timeDiff = endDate - startDate;
    const numDays = Math.max(
      1,
      Math.floor(timeDiff / (1000 * 60 * 60 * 24)) + 1
    );

    const DEFAULT_IMAGE = "https://via.placeholder.com/300x200?text=No+Image";
    const placesData = places.map((p) => ({
      name: p.name,
      image: p.image_url || DEFAULT_IMAGE,
      destination: destination,
      details_url: p.details_url || "",
    }));

    // Stringify the places data ONLY ONCE.
    const placesJsonString = JSON.stringify(placesData, null, 2);

    // A simpler, more reliable prompt.
    const prompt = `
You are an expert travel planner that ONLY responds with valid JSON.
Create a ${numDays}-day ${trip_type} itinerary for a trip to ${destination}.

Use ONLY the following places provided in this JSON array:
${placesJsonString}

Return a valid JSON object with the following structure. Do not include any text before or after the JSON.
{
  "itineraryDays": [
    {
      "day": 1,
      "activities": [
        "8:00 AM: Breakfast at Hotel",
        "10:00 AM: Visit [Place Name from list]",
        "1:00 PM: Lunch at [Restaurant Name from list]",
        "3:00 PM: Explore [Attraction Name from list]",
        "7:00 PM: Dinner"
      ],
      "places": [
        {
          "name": "Place Name from list",
          "image": "URL from provided data",
          "destination": "${destination}",
          "details_url": "URL from provided data"
        }
      ]
    }
  ]
}
`;

    // Use a reliable model that has worked before.
    const itinerary = await callTogetherAI(
      prompt,
      "nvidia/Llama-3.1-Nemotron-70B-Instruct-HF"
    );

    return res.status(200).json(itinerary);
  } catch (error) {
    console.error("Error in getDayByDay:", error.message);
    // Provide more specific error if it comes from the places API call
    if (error.isAxiosError) {
      return res.status(502).json({
        error: "Failed to fetch required places data.",
        details: error.response?.data?.error || "The places service may be down.",
      });
    }
    return res.status(500).json({
      error: "Failed to generate itinerary",
      details: error.message,
    });
  }
};