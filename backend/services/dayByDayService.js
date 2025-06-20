const { callTogetherAI } = require("../utils/togetherAI");
const axios = require("axios");

exports.generateDayByDay = async ({ destination, start_date, end_date, preferences, trip_type }) => {
  // Fetch places from the API
  const response = await axios.get(
    `http://localhost:3001/api/v1/gen/places/getPlaces?destination=${encodeURIComponent(destination)}&categories=${encodeURIComponent(preferences)}`
  );
  const places = response.data.places || [];

  if (!places.length) {
    const err = new Error("No places found for this destination.");
    err.status = 404;
    throw err;
  }

  const startDate = new Date(start_date);
  const endDate = new Date(end_date);
  const timeDiff = endDate - startDate;
  const numDays = Math.max(1, Math.floor(timeDiff / (1000 * 60 * 60 * 24)) + 1);

  const DEFAULT_IMAGE = "https://via.placeholder.com/300x200?text=No+Image";
  const placesData = places.map((p) => ({
    name: p.name,
    image: p.image_url || DEFAULT_IMAGE,
    destination: destination,
    details_url: p.details_url || "",
  }));

  const placesJsonString = JSON.stringify(placesData, null, 2);

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
  return await callTogetherAI(
    prompt,
    "nvidia/Llama-3.1-Nemotron-70B-Instruct-HF"
  );
};