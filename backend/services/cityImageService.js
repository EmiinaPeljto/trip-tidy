const { image_key, x_rapidapi_host } = require("../config/rapidapi");
const axios = require("axios");

async function fetchCityImage(city) {
  try {
    const response = await axios.get(`https://${x_rapidapi_host}/imagesearch`, {
      params: {
        q: city,
        gl: "us",
        lr: "lang_en",
        num: "10",
        start: "0"
      },
      headers: {
        "x-rapidapi-key": image_key,
        "x-rapidapi-host": x_rapidapi_host,
      },
    });

    if (
      response.data &&
      response.data.items &&
      response.data.items.length > 0
    ) {
      // Find the first item with an originalImageUrl
      for (const item of response.data.items) {
        if (item.originalImageUrl) {
          return item.originalImageUrl;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Error fetching city image:", error);
    return "https://via.placeholder.com/400x250?text=No+Image";
  }
}

module.exports = {
  fetchCityImage,
};