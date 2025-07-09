import { useState } from "react";
import axiosInstance from "../api/axiosInstance";

const API_URL = "/itinerary/saveOrUpdateUserItinerary";

const useSaveOrUpdateItinerary = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const saveOrUpdateItinerary = async (payload) => {
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const response = await axiosInstance.post(API_URL, payload);
      setSuccess(true);
      return response.data;
    } catch (err) {
      setError(
        err.response?.data?.error || "Failed to save itinerary. Please try again."
      );
      setSuccess(false);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { saveOrUpdateItinerary, loading, error, success };
};

export default useSaveOrUpdateItinerary;