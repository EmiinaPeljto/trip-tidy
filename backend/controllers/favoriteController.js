const favoriteModel = require("../models/favoriteModel");

exports.addFavorite = async (req, res) => {
  const { user_id, itinerary_id } = req.body;
  if (!user_id || !itinerary_id) return res.status(400).json({ error: "Missing user_id or itinerary_id" });
  try {
    await favoriteModel.addFavorite(user_id, itinerary_id);
    res.json({ message: "Added to favorites" });
  } catch (err) {
    res.status(500).json({ error: "Failed to add favorite" });
  }
};

exports.removeFavorite = async (req, res) => {
  const { user_id, itinerary_id } = req.body;
  if (!user_id || !itinerary_id) return res.status(400).json({ error: "Missing user_id or itinerary_id" });
  try {
    await favoriteModel.removeFavorite(user_id, itinerary_id);
    res.json({ message: "Removed from favorites" });
  } catch (err) {
    res.status(500).json({ error: "Failed to remove favorite" });
  }
};

exports.isFavorite = async (req, res) => {
  const { user_id, itinerary_id } = req.query;
  if (!user_id || !itinerary_id) return res.status(400).json({ error: "Missing user_id or itinerary_id" });
  try {
    const isFav = await favoriteModel.isFavorite(user_id, itinerary_id);
    res.json({ isFavorite: isFav });
  } catch (err) {
    res.status(500).json({ error: "Failed to check favorite" });
  }
};

exports.getFavoritesByUser = async (req, res) => {
  const { user_id } = req.params;
  if (!user_id) return res.status(400).json({ error: "Missing user_id" });
  try {
    const favorites = await favoriteModel.getFavoritesByUser(user_id);
    res.json({ favorites });
  } catch (err) {
    res.status(500).json({ error: "Failed to get favorites" });
  }
};