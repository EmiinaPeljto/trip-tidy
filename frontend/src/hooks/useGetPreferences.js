import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const API_URL = '/preferences/getPreferences';

const useGetPreferences = () => {
  const [preferences, setPreferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPreferences = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get(API_URL);
        setPreferences(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch preferences');
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, []);

  return { preferences, loading, error };
};

export default useGetPreferences;
