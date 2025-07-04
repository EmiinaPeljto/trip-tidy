import { useState } from 'react';
import axiosInstance from '../api/axiosInstance';

const API_URL = '/itinerary/createItinerary';

const useCreateItinerary = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createItinerary = async (formData) => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const response = await axiosInstance.post(API_URL, formData);
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create itinerary. Please try again.');
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
