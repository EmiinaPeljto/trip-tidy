import { useState } from "react";
import axiosInstance from "../api/axiosInstance";

const API_URL = `/users/register`;

const useRegisterUser = () => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const register = async (formData) => {
    setLoading(true);
    setErrors({});
    setSuccess(false);
    try {
      const response = await axiosInstance.post(API_URL, formData);
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
