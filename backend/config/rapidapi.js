require("dotenv").config();

module.exports = {
  rapidapi_key: process.env.RAPIDAPI_KEY,
  rapidapi_host: process.env.RAPIDAPI_HOST,
  x_rapidapi_host: process.env.IMAGE_RAPID_HOST,
  image_key: process.env.IMAGE_API,
};
