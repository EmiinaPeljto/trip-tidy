import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const useGoogleToken = () => {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("jwt_token", token);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [location]);
};

export default useGoogleToken;