import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

const useUserTrips = (userId) => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    axiosInstance
      .get(`/itinerary/user/${userId}`)
      .then((res) => setTrips(res.data || []))
      .catch(() => setTrips([]))
      .finally(() => setLoading(false));
  }, [userId]);

  return { trips, loading };
};

export default useUserTrips;