import axios from "axios";

import { logout } from "../redux-store/Slises/authSlice";
import { store } from "../redux-store/store";

const axiosInstance = axios.create({
    baseURL:  import.meta.env.VITE_ROOT_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            store.dispatch(logout());

            // Redirect to login page
            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;