import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { store } from "../redux-store/store";
import { logout } from "../redux-store/Slises/authSlice";


// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_ROOT_API_URL,
});

// Request Interceptor for Token Handling
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const state = store.getState();
    const token = state.auth?.userDetails?.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor for Error Handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {

      const currentPath = window.location.pathname + window.location.search;
      localStorage.setItem("redirectAfterLogin", currentPath);
      store.dispatch(logout());
    }
    return Promise.reject(error.response?.data);
  }
);

export default axiosInstance;
