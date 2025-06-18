require("dotenv").config();

module.exports = {
  apiKey: process.env.OPENCAGE_API_KEY,
  baseUrl: "https://api.opencagedata.com/geocode/v1/json",
};
