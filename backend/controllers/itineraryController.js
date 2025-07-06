const itineraryModel = require("../models/itineraryModel");
const db = require("../config/db");
const dayByDayService = require("../services/dayByDayService");
const summaryService = require("../services/summaryService");
const hotelsService = require("../services/hotelService");
const flightService = require("../services/flightService");
const placesService = require("../services/placeService");

exports.getAllStockItineraries = async (req, res) => {
  try {
    const itineraries = await itineraryModel.getAllStockItineraries();
    res.json(itineraries);
  } catch (error) {
    console.error("Error fetching stock itineraries:", error);
    res.status(500).json({ error: "Failed to fetch stock itineraries" });
  }
};

exports.getUserItineraries = async (req, res) => {
  try {
    const { user_id } = req.params;
    const itineraries = await itineraryModel.getUserItineraries(user_id);
    res.json(itineraries);
  } catch (error) {
    console.error("Error fetching user itineraries:", error);
    res.status(500).json({ error: "Failed to fetch user itineraries" });
  }
};

exports.getItineraryById = async (req, res) => {
  try {
    const { id } = req.params;
    const itinerary = await itineraryModel.getItineraryById(id);
    res.json(itinerary);
  } catch (error) {
    console.error("Error fetching itinerary:", error);
    res.status(500).json({ error: "Failed to fetch itinerary" });
  }
};

exports.createItinerary = async (req, res) => {
    let connection;
    try {
      const {
        origin,
        destination,
        start_date,
        end_date,
        adults,
        budget,
        trip_type,
        preference_id,
      } = req.body;
  
      if (
        !origin ||
        !destination ||
        !start_date ||
        !end_date ||
        !adults ||
        !budget ||
        !trip_type ||
        !preference_id
      ) {
        return res.status(400).json({ error: "Missing required fields" });
      }
  
      // Get a connection and start a transaction
      connection = await db.getConnection();
      await connection.beginTransaction();
  
      // Fetch preference names
      let preferenceNames = [];
      for (const id of preference_id) {
        const names = await itineraryModel.getPreferencesNames(id);
        if (names && names.length > 0) {
          preferenceNames.push(names[0].name);
        }
      }
      const preferencesString = preferenceNames.join(",");
  
      // Call external services
      const summaryData = await summaryService.generateSummary({
        destination,
        start_date,
        end_date,
        budget,
        trip_type,
      });
  
      const startDate = new Date(start_date);
      const endDate = new Date(end_date);
      const timeDiff = endDate - startDate;
      const numDays = Math.max(1, Math.floor(timeDiff / (1000 * 60 * 60 * 24)) + 1);
  
      const accommodation = await hotelsService.getHotels(
        destination,
        start_date,
        end_date,
        budget,
        adults
      );
      const transportation_details = await flightService.getFlights(
        origin,
        destination,
        start_date,
        end_date,
        adults
      );
      const places = await placesService.getPlaces(destination, preferencesString);
  
      // Run all INSERTS within the transaction
      const itinerary = await itineraryModel.createItinerary(
        destination,
        start_date,
        end_date,
        adults,
        budget,
        trip_type,
        summaryData.trip_title,
        summaryData.description,
        JSON.stringify(summaryData.packing_notes),
        numDays,
        JSON.stringify(accommodation),
        JSON.stringify(transportation_details),
        JSON.stringify(places),
        origin,
        connection // Pass the connection
      );
  
      const itinerary_id = itinerary.insertId;
      if (!itinerary_id) {
        throw new Error("Failed to create itinerary record");
      }
  
      for (const id of preference_id) {
        await itineraryModel.addTripPreferences(itinerary_id, id, connection);
      }
  
      const dayByDayData = await dayByDayService.generateDayByDay({
        destination,
        start_date,
        end_date,
        preferences: preferencesString,
        trip_type,
      });
      await itineraryModel.addItineraryDays(
        itinerary_id,
        JSON.stringify(dayByDayData),
        connection
      );
  
      // Commit the transaction
      await connection.commit();

      // --- Final, Corrected Data Transformation ---
      const formattedHotels = (accommodation || []).map(hotel => ({
        title: hotel.name || 'No Title Provided',
        imageUrl: hotel.image || null,
        location: hotel.address || 'No Location Provided',
        rating: hotel.review || 0,
        details_url: hotel.bookingLink || '#',
        coordinates: hotel.coordinates || null,
      }));

      const formattedPlaces = (places || []).map(place => ({
        title: place.name || 'No Title Provided',
        imageUrl: place.image || place.photo?.images?.large?.url || null,
        location: place.address || place.location_string || 'No Location Provided',
        details_url: place.bookingLink || place.web_url || '#',
        coordinates: place.coordinates || null,
      }));

      // --- DEBUGGING: Log the raw transportation data ---
      console.log('--- Raw Transportation Details ---');
      console.log(JSON.stringify(transportation_details, null, 2));

      const formattedFlights = (transportation_details || []).map(flight => {
        const midPoint = Math.floor(flight.segments.length / 2);
        const outboundSegments = flight.segments.slice(0, midPoint);
        const returnSegments = flight.segments.slice(midPoint);

        const formatSegment = (segment) => ({
          departure_airport: segment.from,
          arrival_airport: segment.to,
          departure_time: segment.departure,
          arrival_time: segment.arrival,
          airline: segment.airline,
          flightNumber: segment.flightNumber
        });

        const outbound = outboundSegments.map(formatSegment);
        const returnFlight = returnSegments.map(formatSegment);

        let details_url = '#';
        try {
          if (outbound.length > 0 && returnFlight.length > 0) {
            const outboundOrigin = outbound[0].departure_airport;
            const outboundDestination = outbound[outbound.length - 1].arrival_airport;
            const outboundDate = new Date(outbound[0].departure_time).toISOString().split('T')[0];
            const returnOrigin = returnFlight[0].departure_airport;
            const returnDestination = returnFlight[returnFlight.length - 1].arrival_airport;
            const returnDate = new Date(returnFlight[0].departure_time).toISOString().split('T')[0];
            details_url = `https://www.google.com/flights?hl=en#flt=${outboundOrigin}.${outboundDestination}.${outboundDate}*${returnOrigin}.${returnDestination}.${returnDate}`;
          }
        } catch (e) {
          console.error("Could not generate flight details URL", e);
        }

        return {
          price: flight.price,
          airline: flight.segments[0]?.airline || 'Unknown Airline',
          outbound: outbound,
          'return': returnFlight,
          details_url: details_url
        };
      });

      // --- DEBUGGING: Log the formatted flight data ---
      console.log('--- Formatted Flights ---');
      console.log(JSON.stringify(formattedFlights, null, 2));

      const itineraryData = {
        id: itinerary_id,
        destination,
        start_date,
        end_date,
        num_days: numDays,
        budget,
        trip_type,
        trip_title: summaryData.trip_title,
        trip_description: summaryData.description,
        checklist: summaryData.packing_notes,
        hotel_recommendations: formattedHotels,
        flights: formattedFlights,
        place_recommendations: formattedPlaces,
        itinerary: dayByDayData,
      };

      res.status(201).json({
        message: "Itinerary created successfully",
        itinerary: itineraryData,
      });
    } catch (error) {
      // Roll back the transaction if any error occurred
      if (connection) await connection.rollback();
      console.error("Error creating itinerary:", error);
      res.status(500).json({ error: "Failed to create itinerary" });
    } finally {
      // Release the connection back to the pool
      if (connection) connection.release();
    }
  };

  exports.getPreferences = async (req, res) => {
    try {
      const preferences = await itineraryModel.getPreferences();
      res.json(preferences);
    } catch (error) {
      console.error("Error fetching preferences:", error);
      res.status(500).json({ error: "Failed to fetch preferences" });
    }
  };