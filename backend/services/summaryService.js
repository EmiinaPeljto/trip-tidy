const { callTogetherAI } = require("../utils/togetherAI");

exports.generateSummary = async ({
  destination,
  start_date,
  end_date,
  budget,
  trip_type,
}) => {
  const prompt = `
    You are an expert travel planner. Create a summary for the following trip:
    - Destination: ${destination}
    - Start Date: ${start_date}
    - End Date: ${end_date}
    - Transportation: Flights
    - Budget: $${budget}
    - Trip Type: ${trip_type}

    Return the result in **valid JSON** with this structure:
    {
    "trip_title": "Short and catchy title (max 10 words)",
    "description": "Overview of the trip in 50-100 words",
    "packing_notes": ["Item1", "Item2", "Item3", ...]
    }
  `;

  return await callTogetherAI(prompt, "mistralai/Mixtral-8x7B-Instruct-v0.1");
};