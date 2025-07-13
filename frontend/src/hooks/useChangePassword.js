import { useState } from "react";
import axiosInstance from "../api/axiosInstance";

const useChangePassword = () => {
  const [loading, setLoading] = useState(false);

  const changePassword = async ({ userId, currentPassword, newPassword }) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post("/users/change-password", {
        userId,
        currentPassword,
        newPassword,
      });
      if (res.data && res.data.success) {
        return { success: true };
      }
      return { success: false, error: res.data?.error || "Unknown error" };
    } catch (err) {
      return {
        success: false,
        error:
          err.response?.data?.error ||
          "Failed to change password. Please try again.",
      };
    } finally {
      setLoading(false);
    }
  };

  return { changePassword, loading };
};

export default useChangePassword;