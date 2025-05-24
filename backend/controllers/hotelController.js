const { rapidapi_key, rapidapi_host } = require("../config/rapidapi");
const axios = require("axios");

exports.getHotels = async (req, res) => {
  const { destination, start_date, end_date, budget, adults } = req.query;

  try {
    const locationResponse = await axios.get(
      `https://${rapidapi_host}/v1/hotels/locations`,
      {
        params: { name: destination, locale: "en-us" },
        headers: {
          "X-RapidAPI-Key": rapidapi_key,
          "X-RapidAPI-Host": rapidapi_host,
        },
      }
    );

    const firstLocation = locationResponse.data[0];
    const destinationId = firstLocation?.dest_id;
    const destinationType = firstLocation?.dest_type;

    if (!destinationId || !destinationType) {
      return res
        .status(404)
        .json({ message: "No destination found for the specified city." });
    }

    const hotelsResponse = await axios.get(
      `https://${rapidapi_host}/v1/hotels/search`,
      {
        params: {
          dest_id: destinationId,
          dest_type: destinationType, // <-- add this line
          checkin_date: start_date,
          checkout_date: end_date,
          adults_number: adults,
          order_by: "price",
          filter_by_currency: "USD",
          room_number: 1,
          categories_filter_ids: "class::2,class::4,free_cancellation::1",
          price_filter_currencycode: "USD",
          price_filter_min: 0,
          price_filter_max: budget,
          locale: "en-us",
          units: "metric",
          page_number: 0,
          page_size: 10,
        },
        headers: {
          "X-RapidAPI-Key": rapidapi_key,
          "X-RapidAPI-Host": rapidapi_host,
        },
      }
    );

    const hotels = hotelsResponse.data.result.slice(0, 3).map((hotel) => {
      let rawPrice =
        hotel.price_breakdown?.all_inclusive_price || hotel.min_total_price;
      let price =
        rawPrice && rawPrice > 1000 ? (rawPrice / 100).toFixed(2) : rawPrice;

      return {
        name: hotel.hotel_name,
        address: hotel.address,
        coordinates: {
          lat: hotel.latitude,
          lng: hotel.longitude,
        },
        review: hotel.review_score || "No reviews",
        price,
        image: hotel.max_1440_photo_url || hotel.main_photo_url || null,
        bookingLink: hotel.url,
      };
    });

    res.json(hotels);
  } catch (error) {
    console.error("Error fetching hotels:", error);
    return res.status(500).json({ message: "Error fetching hotels", error });
  }
};
