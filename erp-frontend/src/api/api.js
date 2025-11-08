import axios from "axios";
import store from "../app/store.js";
import { setLoading } from "../features/ui/uiSlice.js";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
});

// ✅ Always attach token before requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    store.dispatch(setLoading(true));
    return config;
  },
  (error) => {
    store.dispatch(setLoading(false));
    return Promise.reject(error);
  }
);

// ✅ Handle responses and errors
api.interceptors.response.use(
  (response) => {
    store.dispatch(setLoading(false));
    return response;
  },
  (error) => {
    store.dispatch(setLoading(false));

    // 🛑 Optional: handle token expiration
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
