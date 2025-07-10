const db = require("../config/db");
const expensesModel = require("./expensesModel");

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

function parseMaybeJSON(val, fallback = []) {
  if (!val) return fallback;
  if (typeof val === "string") {
    try {
      return JSON.parse(val);
    } catch {
      return fallback;
    }
  }
  return val; // Already an array/object
}

exports.getItineraryById = async (id) => {
  // 1. Get main itinerary row
  const [rows] = await db.query("SELECT * FROM itineraries WHERE id = ?", [id]);
  if (!rows[0]) return null;
  const itinerary = rows[0];

  // Parse JSON fields safely
  itinerary.checklist = parseMaybeJSON(itinerary.packing_notes, []);
  itinerary.hotel_recommendations = parseMaybeJSON(itinerary.accommodation, []);
  itinerary.flights = parseMaybeJSON(itinerary.transportation_details, []);
  itinerary.place_recommendations = parseMaybeJSON(itinerary.places, []);

  // 2. Get expenses
  const expenses = await expensesModel.getExpensesByItineraryId(id);

  // 3. Get itinerary days (as JSON)
  const [daysRows] = await db.query(
    "SELECT day FROM itinerarydays WHERE itinerary_id = ?",
    [id]
  );
  let itineraryDays = [];
  if (daysRows[0] && daysRows[0].day) {
    try {
      const parsed =
        typeof daysRows[0].day === "string"
          ? JSON.parse(daysRows[0].day)
          : daysRows[0].day;
      itineraryDays = parsed.itineraryDays || [];
    } catch {
      itineraryDays = [];
    }
  }

  // 4. Attach to itinerary object
  itinerary.expenses = expenses;
  itinerary.itinerary = { itineraryDays };

  return itinerary;
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
  origin,
  image
) => {
  const [rows] = await db.query(
    "INSERT INTO itineraries (destination, start_date, end_date,adults, budget, trip_type, trip_title, description, packing_notes, total_days, accommodation, transportation_details, places, origin, image) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
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
      image
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
  const [rows] = await db.query("SELECT name FROM preferences WHERE id = ?", [
    id,
  ]);
  return rows;
};

exports.addItineraryDays = async (itinerary_id, day) => {
  const [rows] = await db.query(
    "INSERT INTO itinerarydays (itinerary_id, day) VALUES (?, ?)",
    [itinerary_id, day]
  );
  return rows;
};

exports.saveOrUpdateUserItineraryWithDaysAndExpenses = async ({
  id,
  user_id,
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
  image,
  itineraryDays, // array of day objects
  expenses, // array of expense objects
}) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    let itinerary_id = id;

    if (!id) {
      // Insert new itinerary
      const [itineraryRows] = await conn.query(
        `INSERT INTO itineraries 
    (user_id, destination, start_date, end_date, adults, budget, trip_type, trip_title, description, packing_notes, total_days, accommodation, transportation_details, places, origin, image)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          user_id,
          destination,
          start_date,
          end_date,
          adults,
          budget,
          trip_type,
          trip_title,
          description,
          JSON.stringify(packing_notes || []),
          total_days,
          JSON.stringify(accommodation || []), // <-- stringify!
          JSON.stringify(transportation_details || []), // <-- stringify!
          JSON.stringify(places || []), // <-- stringify!
          origin,
          image
        ]
      );
      itinerary_id = itineraryRows.insertId;
    } else {
      // Update existing itinerary
      await conn.query(
        `UPDATE itineraries SET 
      user_id=?, destination=?, start_date=?, end_date=?, adults=?, budget=?, trip_type=?, trip_title=?, description=?, packing_notes=?, total_days=?, accommodation=?, transportation_details=?, places=?, origin=?, image=?
     WHERE id=?`,
        [
          user_id,
          destination,
          start_date,
          end_date,
          adults,
          budget,
          trip_type,
          trip_title,
          description,
          JSON.stringify(packing_notes || []),
          total_days,
          JSON.stringify(accommodation || []), // <-- stringify!
          JSON.stringify(transportation_details || []), // <-- stringify!
          JSON.stringify(places || []), // <-- stringify!
          origin,
          image,
          id,
        ]
      );
      itinerary_id = id;
      // Remove old itinerary days and expenses for this itinerary
      await conn.query(`DELETE FROM itinerarydays WHERE itinerary_id = ?`, [
        id,
      ]);
      await expensesModel.deleteExpensesByItineraryId(id);
    }

    if (Array.isArray(itineraryDays) && itineraryDays.length > 0) {
      await conn.query(
        `INSERT INTO itinerarydays (itinerary_id, day) VALUES (?, ?)`,
        [itinerary_id, JSON.stringify({ itineraryDays })]
      );
    }

    // Insert expenses
    if (Array.isArray(expenses)) {
      for (const expense of expenses) {
        await conn.query(
          `INSERT INTO expenses (itinerary_id, expenses_title, category, price) VALUES (?, ?, ?, ?)`,
          [
            itinerary_id,
            expense.expenses_title || "",
            expense.category || "",
            expense.price || 0,
          ]
        );
      }
    }

    await conn.commit();
    return { id: itinerary_id };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};
