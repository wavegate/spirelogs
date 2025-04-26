import { toast } from "sonner";
import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      toast.error("Network error. Please check your connection.");
      return Promise.reject(error);
    }

    const { status, data } = error.response;
    const errorMessage =
      data?.error || "An unknown error occurred. Please try again.";

    if (status === 400 && errorMessage === "Invalid token") {
      localStorage.removeItem("token");
      toast.error("Session expired. Please log in again.");
    } else if (
      errorMessage &&
      errorMessage !== "Access denied, token missing"
    ) {
      toast.error(errorMessage);
    } else if (!errorMessage) {
      toast.error("Something went wrong. Please try again later.");
    }

    return Promise.reject(error);
  }
);

export default apiClient;
