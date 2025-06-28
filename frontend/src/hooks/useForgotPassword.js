import { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:3001/api/v1/gen/users/forgot-password";

const useForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const forgotPassword = async (email) => {
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const res = await axios.post(API_URL, { email });
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
