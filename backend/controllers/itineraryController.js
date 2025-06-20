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
        transportation,
        budget,
        trip_type,
        preference_id,
      } = req.body;
  
      if (
        !origin ||
        !destination ||
        !start_date ||
        !end_date ||
        !transportation ||
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
        transportation,
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
        1
      );
      const transportation_details = await flightService.getFlights(
        origin,
        destination,
        start_date,
        end_date,
        1
      );
      const places = await placesService.getPlaces(destination, preferencesString);
  
      // Run all INSERTS within the transaction
      const itinerary = await itineraryModel.createItinerary(
        destination,
        start_date,
        end_date,
        transportation,
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
  
      res.status(201).json({
        message: "Itinerary created successfully",
        itinerary_id,
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
    