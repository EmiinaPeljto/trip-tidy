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
      setItinerary(res.data);
      return res.data;
    } catch (err) {
      setError(err.message || "Failed to fetch itinerary");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { itinerary, fetchItinerary, loading, error };
};

export default useFetchItinerary;
