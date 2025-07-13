import { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { successToast, errorToast } from "../../utils/toastUtil";

const useFavoriteItinerary = (userId, itineraryId) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [error, setError] = useState("");

  // No-op for guests: never call API, never update state
  if (!userId || !itineraryId) {
    return {
      isFavorite: false,
      favLoading: false,
      checkFavorite: () => {},
      addFavorite: () => {
        errorToast("You must be logged in to favorite itineraries.");
      },
      removeFavorite: () => {},
    };
  }

  // --- API logic for logged-in users only ---
  const checkFavorite = async () => {
    setFavLoading(true);
    setError("");
    try {
      const res = await axiosInstance.get(
        `/favorites/isFavorite?user_id=${userId}&itinerary_id=${itineraryId}`
      );
      setIsFavorite(res.data.isFavorite);
    } catch (err) {
      setIsFavorite(false);
      setError("Failed to check favorite.");
    } finally {
      setFavLoading(false);
    }
  };

  const addFavorite = async () => {
    setFavLoading(true);
    setError("");
    try {
      await axiosInstance.post("/favorites/add", {
        user_id: userId,
        itinerary_id: itineraryId,
      });
      setIsFavorite(true);
      successToast("Added to favorites!");
    } catch (err) {
      errorToast("Failed to add to favorites.");
      setError("Failed to add to favorites.");
    } finally {
      setFavLoading(false);
    }
  };

  const removeFavorite = async () => {
    setFavLoading(true);
    setError("");
    try {
      await axiosInstance.delete("/favorites/remove", {
        data: { user_id: userId, itinerary_id: itineraryId },
      });
      setIsFavorite(false);
      successToast("Removed from favorites!");
    } catch (err) {
      errorToast("Failed to remove from favorites.");
      setError("Failed to remove from favorites.");
    } finally {
      setFavLoading(false);
    }
  };

  return {
    isFavorite,
    favLoading,
    error,
    checkFavorite,
    addFavorite,
    removeFavorite,
    setIsFavorite,
  };
};

export default useFavoriteItinerary;
