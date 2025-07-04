const db = require("../config/db");

exports.getAllStockItineraries = async () => {
  const [rows] = await db.query(
    "SELECT * FROM itineraries WHERE user_id IS NULL"
  );
  return rows;
};

exports.getUserItineraries = async (user_id) => {
  const [rows] = await db.query("SELECT * FROM itineraries WHERE user_id = ?", [
    user_id,
  ]);
  return rows;
};

exports.getItineraryById = async (id) => {
  const [rows] = await db.query("SELECT * FROM itineraries WHERE id = ?", [id]);
  return rows[0];
};

exports.createItinerary = async (
  destination,
  start_date,
  end_date,
  adults,
  budget,
  trip_type,
  trip_title,
  description,
  packing_notes,
  total_days,
  accommodation,
  transportation_details,
  places,
  origin
) => {
  const [rows] = await db.query(
    "INSERT INTO itineraries (destination, start_date, end_date,adults, budget, trip_type, trip_title, description, packing_notes, total_days, accommodation, transportation_details, places, origin) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      destination,
      start_date,
      end_date,
      adults,
      budget,
      trip_type,
      trip_title,
      description,
      packing_notes,
      total_days,
      accommodation,
      transportation_details,
      places,
      origin,
    ]
  );
  return rows;
};

exports.addTripPreferences = async (itinerary_id, preference_id) => {
  const [rows] = await db.query(
    "INSERT INTO trippreferences (itinerary_id, preference_id) VALUES (?, ?)",
    [itinerary_id, preference_id]
  );
  return rows;
};

exports.getPreferencesNames = async (id) => {
  const [rows] = await db.query("SELECT name FROM preferences WHERE id = ?", [id]);
  return rows;
};

exports.addItineraryDays = async (itinerary_id, day) => {
  const [rows] = await db.query(
    "INSERT INTO itinerarydays (itinerary_id, day) VALUES (?, ?)",
    [itinerary_id, day]
  );
  return rows;
};



