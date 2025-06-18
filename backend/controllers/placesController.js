const axios = require("axios");
const { fqKey, fqBaseUrl } = require("../config/foursquare");
const { apiKey: geoKey, baseUrl: geoBaseUrl } = require("../config/geocoding");

exports.getPlaces = async (req, res) => {
  const { destination, categories, limit = 20 } = req.query;

  try {
    // 1. Geocode the destination
    const geoResponse = await axios.get(geoBaseUrl, {
      params: {
        q: destination,
        key: geoKey,
        limit: 1,
      },
    });

    if (!geoResponse.data.results.length) {
      return res.status(404).json({ error: "Destination not found" });
    }

    const { lat, lng } = geoResponse.data.results[0].geometry;

    // 2. Handle multiple categories (comma-separated)
    const categoryList = categories.split(",");
    const allPlaces = [];

    for (const category of categoryList) {
      const fqResponse = await axios.get(`${fqBaseUrl}/search`, {
        headers: {
          Authorization: fqKey,
        },
        params: {
          ll: `${lat},${lng}`,
          query: category.trim(),
          sort: "POPULARITY",
          limit,
        },
        headers: {
          Accept: "application/json",
          Authorization: fqKey,
        },
      });

      if (fqResponse.data.results.length) {
        allPlaces.push(...fqResponse.data.results);
      }
    }

    // 3. Process results
    const uniquePlacesMap = new Map();
    allPlaces.forEach((place) => uniquePlacesMap.set(place.fsq_id, place));
    const uniquePlaces = Array.from(uniquePlacesMap.values());

    // 4. Add image + return clean data
    const enrichedPlaces = await Promise.all(
      uniquePlaces.map(async (place) => {
        let image = null;
        try {
          const photoRes = await axios.get(
            `${fqBaseUrl}/${place.fsq_id}/photos`,
            {
              headers: { Authorization: fqKey },
            }
          );

          if (photoRes.data.length) {
            const p = photoRes.data[0];
            image = `${p.prefix}original${p.suffix}`;
          }
        } catch (err) {
          console.warn(`No image for ${place.fsq_id}`);
        }

        return {
          name: place.name,
          location: place.location.formatted_address || place.location.address,
          coordinates: {
            lat: place.geocodes.main.latitude,
            lon: place.geocodes.main.longitude,
          },
          image_url: image,
          details_url: `https://www.tripadvisor.com/Search?q=${encodeURIComponent(
            place.name + " " + destination
          )}`,
        };
      })
    );

    res.json({ places: enrichedPlaces });
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
