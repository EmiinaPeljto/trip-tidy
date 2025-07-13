import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const useStockItineraries = () => {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const response = await axiosInstance.get('/itinerary/stock');
        setItineraries(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchItineraries();
  }, []);

  return { itineraries, loading, error };
};

export default useStockItineraries;
