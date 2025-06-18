require("dotenv").config();

module.exports = {
  fqKey: process.env.FOURSQUARE_API_KEY,
  fqBaseUrl: "https://api.foursquare.com/v3/places",
};
