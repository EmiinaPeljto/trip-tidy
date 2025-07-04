import { useState } from "react";
import axiosInstance from "../api/axiosInstance";

const API_URL = "/users/reset-password";

const useResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const resetPassword = async ({ token, password }) => {
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const res = await axiosInstance.post(API_URL, { token, password });
      setSuccess(true);
      return res.data;
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to reset password. Try again."
      );
      setSuccess(false);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { resetPassword, loading, error, success };
};

export default useResetPassword;