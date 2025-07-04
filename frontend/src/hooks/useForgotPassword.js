import { useState } from "react";
import axiosInstance from "../api/axiosInstance";

const API_URL = "/users/forgot-password";

const useForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const forgotPassword = async (email) => {
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const res = await axiosInstance.post(API_URL, { email });
      setSuccess(true);
      return res.data;
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to send reset link. Try again."
      );
      setSuccess(false);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { forgotPassword, loading, error, success };
};

export default useForgotPassword;
