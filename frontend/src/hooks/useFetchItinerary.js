import { useState } from "react";
import axiosInstance from "../api/axiosInstance";

const useFetchItinerary = () => {
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchItinerary = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get(`/itinerary/getItineraryById/${id}`);
      setItinerary(res.data); // <-- set directly
      return res.data;        // <-- return directly
    } catch (err) {
      const status = err.response?.status;
      setError(
        status === 403
          ? "You do not have access to this itinerary."
          : status === 404
          ? "Itinerary not found."
          : err.message || "Failed to fetch itinerary"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { itinerary, fetchItinerary, loading, error };
};

export default useFetchItinerary;