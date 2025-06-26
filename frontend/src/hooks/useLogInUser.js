import { useState } from "react";
import axios from "axios";

const API_URL = `http://localhost:3001/api/v1/gen/users/login`;

const useLogInUser = () => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const login = async (formData) => {
    setLoading(true);
    setErrors({});
    setSuccess(false);
    try {
      const response = await axios.post(API_URL, formData);
      setSuccess(true);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        if (error.response.data.errors) {
          setErrors(error.response.data.errors);
        } else if (error.response.data.message) {
          setErrors({ general: error.response.data.message });
        } else {
          setErrors({ general: "Login failed. Please try again." });
        }
      } else {
        setErrors({ general: "Login failed. Please try again." });
      }
      setSuccess(false);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, errors, success };
};

export default useLogInUser;
