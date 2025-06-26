import { useState } from "react";
import axios from "axios";

const API_URL = `http://localhost:3001/api/v1/gen/users/register`;

const useRegisterUser = () => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const register = async (formData) => {
    setLoading(true);
    setErrors({});
    setSuccess(false);
    try {
      const response = await axios.post(API_URL, formData);
      setSuccess(true);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: "Registration failed. Please try again." });
      }
      setSuccess(false);
      return null;
    } finally {
      setLoading(false);
    }
  };
  return { register, loading, errors, success };
};
export default useRegisterUser;
