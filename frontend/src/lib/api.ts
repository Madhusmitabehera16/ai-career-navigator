import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add Authorization header dynamically
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // We can handle specific errors here (e.g., token expiration redirects)
    const message = error.response?.data?.message || "An unexpected error occurred.";
    
    // Customize error payload to make it easier to display in components
    const customError = new Error(message);
    (customError as any).status = error.response?.status;
    (customError as any).errors = error.response?.data?.errors;
    
    return Promise.reject(customError);
  }
);

export default api;
