import { useState } from "react";
import axios from "axios";

const API_URL =
  "http://localhost:3001/api/v1/gen/email_verification/verify-email";

const useVerifyEmailCode = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const verifyCode = async ({ email, code }) => {
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const response = await axios.post(API_URL, { email, code });
      setSuccess(true);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message);
      setSuccess(false);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { verifyCode, loading, error, success };
};

export default useVerifyEmailCode;
