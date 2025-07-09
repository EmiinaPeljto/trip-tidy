const db = require("../config/db");

exports.addExpense = async (itinerary_id, expenses_title, category, price) => {
  const [rows] = await db.query(
    "INSERT INTO expenses (itinerary_id, expenses_title, category, price ) VALUES (?, ?, ?, ?)",
    [itinerary_id, expenses_title, category, price]
  );
  return rows;
};

exports.deleteExpensesByItineraryId = async (itinerary_id) => {
  await db.query("DELETE FROM expenses WHERE itinerary_id = ?", [itinerary_id]);
};

exports.getExpensesByItineraryId = async (itinerary_id) => {
  const [rows] = await db.query(
    "SELECT * FROM expenses WHERE itinerary_id = ?",
    [itinerary_id]
  );
  return rows;
};
