import { useState } from "react";
import axiosInstance from "../api/axiosInstance";

const useUpdateUsername = () => {
  const [loading, setLoading] = useState(false);

  const updateUsername = async (userId, username) => {
    setLoading(true);
    try {
      const response = await axiosInstance.put(`/users/updateUser/${userId}`, {
        username,
      });
      // If backend returns errors in a 200 response (shouldn't, but just in case)
      if (
        response.data &&
        response.data.errors &&
        response.data.errors.username
      ) {
        return response.data.errors.username;
      }
      return true;
    } catch (err) {
      if (
        err.response &&
        err.response.data &&
        err.response.data.errors &&
        err.response.data.errors.username
      ) {
        return err.response.data.errors.username;
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { updateUsername, loading };
};

export default useUpdateUsername;
