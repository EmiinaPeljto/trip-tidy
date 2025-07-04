import { useState } from "react";
import axiosInstance from "../api/axiosInstance"; 

const API_URL = `/users/login`;

const useLogInUser = () => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const login = async (formData) => {
  setLoading(true);
  setErrors({});
  setSuccess(false);
  try {
    const response = await axiosInstance.post(API_URL, formData);
    // Store JWT token and user info in localStorage
    if (response.data.token) {
      localStorage.setItem("jwt_token", response.data.token);
    }
    if (response.data.user) {
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
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
