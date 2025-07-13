const express = require("express");
const router = express.Router();
const favoriteController = require("../../../../controllers/favoriteController");

router.post("/add", favoriteController.addFavorite);
router.delete("/remove", favoriteController.removeFavorite);
router.get("/isFavorite", favoriteController.isFavorite);
router.get("/user/:user_id", favoriteController.getFavoritesByUser);

module.exports = router;