import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3001/api/v1/gen",
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
export default axiosInstance;
