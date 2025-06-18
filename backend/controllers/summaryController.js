const express = require("express");
const router = express.Router();
const { callTogetherAI } = require("../utils/togetherAI");

exports.getSummary = async (req, res) => {
  const {
    destination,
    start_date,
    end_date,
    transportation,
    budget,
    trip_type,
  } = req.body;
  const prompt = `
    You are an expert travel planner. Create a summary for the following trip:
    - Destination: ${destination}
    - Start Date: ${start_date}
    - End Date: ${end_date}
    - Transportation: ${transportation}
    - Budget: $${budget}
    - Trip Type: ${trip_type}

    Return the result in **valid JSON** with this structure:
    {
    "trip_title": "Short and catchy title (max 10 words)",
    "description": "Overview of the trip in 50-100 words",
    "packing_notes": ["Item1", "Item2", "Item3", ...]
    }
`;

  try {
    // Pass a valid Together AI model name as the second argument
    const parsedContent = await callTogetherAI(
      prompt,
      "mistralai/Mixtral-8x7B-Instruct-v0.1"
    );
    res.status(200).json(parsedContent);
  } catch (error) {
    console.error("Error generating summary:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};