import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const useGoogleToken = () => {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("jwt_token", token);
      // Fetch user info using the token
      axiosInstance
        .get("/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res.data && res.data.user) {
            localStorage.setItem("user", JSON.stringify(res.data.user));
          }
        })
        .catch(() => {
          // Optionally handle error
        });
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [location]);
};

export default useGoogleToken;
