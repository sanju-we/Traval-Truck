// import axios from "axios";
// import { error } from "console";

// const api = axios.create({
//   baseURL:'http://localhost:5000/api',
//   withCredentials:true,
//   validateStatus: () => true,
//   headers:{
//     "Content-Type" : "application/json"
//   }
// })
import axios from "axios";
import Router from "next/router";


const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (err) => {
    const originalRequest = err.config;
    console.log("Api interceptor triggered");

    if ( err.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshRes = await axios.post(
          "http://localhost:5000/api/user/refresh",
          {},
          { withCredentials: true }
        );

        const accessToken = refreshRes.data.accessToken;

        // Attach new token and retry
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        // Optionally logout user here
      }
    }

    return Promise.reject(err);
  }
);

export default api;
