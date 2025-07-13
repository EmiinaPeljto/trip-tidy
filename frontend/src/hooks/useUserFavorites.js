import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

const useUserFavorites = (userId) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    axiosInstance
      .get(`/favorites/user/${userId}`)
      .then(async (res) => {
        const favIds = res.data.favorites || [];
        const favs = await Promise.all(
          favIds.map((id) =>
            axiosInstance
              .get(`/itinerary/getItineraryById/${id}`)
              .then((r) => r.data)
              .catch(() => null)
          )
        );
        setFavorites(favs.filter(Boolean));
      })
      .catch(() => setFavorites([]))
      .finally(() => setLoading(false));
  }, [userId]);

  return { favorites, loading };
};

export default useUserFavorites;