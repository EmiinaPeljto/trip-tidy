import { useState } from "react";
import axios from "axios";

const API_URL =
  "http://localhost:3001/api/v1/gen/email_verification/resend-verification-code";

const useResendVerificationCode = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const resendCode = async (email) => {
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const response = await axios.post(API_URL, { email });
      setSuccess(true);
      return response.data;
    } catch (err) {
      setError(
        err.response?.data?.message || "Resend failed. Please try again."
      );
      setSuccess(false);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { resendCode, loading, error, success };
};

export default useResendVerificationCode;
