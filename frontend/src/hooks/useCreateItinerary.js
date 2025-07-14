import { useState } from "react";
import axiosInstance from "../api/axiosInstance";

const useCreateItinerary = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createItinerary = async (payload) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await axiosInstance.post("/itinerary/createItinerary", payload);
      if (res.data && res.data.itinerary) {
        setData(res.data.itinerary);
      } else {
        throw new Error(res.data?.message || "Failed to create itinerary. Please try again.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to create itinerary. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setData(null);
    setError(null);
    setLoading(false);
  };

  return { createItinerary, data, loading, error, reset };
};

export default useCreateItinerary;