const db = require("../config/db");

exports.addFavorite = async (user_id, itinerary_id) => {
  await db.query(
    "INSERT IGNORE INTO favorites (user_id, itinerary_id) VALUES (?, ?)",
    [user_id, itinerary_id]
  );
};

exports.removeFavorite = async (user_id, itinerary_id) => {
  await db.query(
    "DELETE FROM favorites WHERE user_id = ? AND itinerary_id = ?",
    [user_id, itinerary_id]
  );
};

exports.isFavorite = async (user_id, itinerary_id) => {
  const [rows] = await db.query(
    "SELECT 1 FROM favorites WHERE user_id = ? AND itinerary_id = ?",
    [user_id, itinerary_id]
  );
  return rows.length > 0;
};

exports.getFavoritesByUser = async (user_id) => {
  const [rows] = await db.query(
    "SELECT itinerary_id FROM favorites WHERE user_id = ?",
    [user_id]
  );
  return rows.map(r => r.itinerary_id);
};