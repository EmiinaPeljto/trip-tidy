import { useState } from 'react';

const API_URL = 'http://localhost:3001/api/v1/gen/itinerary/createItinerary';

const useCreateItinerary = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createItinerary = async (payload) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const token = localStorage.getItem('jwt_token');
      if (!token) {
        throw new Error('Authentication token not found. Please log in.');
      }

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create itinerary. Please try again.');
      }

      setData(result.itinerary);

    } catch (err) {
      setError(err.message);
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
