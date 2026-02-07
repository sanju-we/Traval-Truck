import axios from "axios";
import { cookies } from "next/headers";

export async function createServerAxios() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const serverApi = axios.create({
    baseURL: "http://localhost:5000/api",
    withCredentials: true,
    headers: {
      Cookie: cookieHeader,
      "Content-Type": "application/json",
    },
    validateStatus: (status) => status !== 401 && status !== 403,
  });

  // 🌟 REQUEST INTERCEPTOR (just logs)
  serverApi.interceptors.request.use(
    (config) => {
      console.log("[SERVER API] →", config.method?.toUpperCase(), config.url);
      return config;
    },
    (error) => Promise.reject(error)
  );

  // 🌟 RESPONSE + ERROR INTERCEPTOR
  serverApi.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      
      // 🛑 If 401 → do NOT refresh token
      if (error.response?.status === 401) {
        console.log("SERVER 401 → Access token expired or invalid");
        return Promise.reject({
          type: "UNAUTHORIZED",
          message: error.response.data?.message || "Unauthorized",
        });
      }

      // 🔥 If 403 → try refresh token
      if (error.response?.status === 403 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          console.log("SERVER 403 → Trying refresh token...");

          const refreshResponse = await axios.post(
            "http://localhost:5000/api/user/refresh",
            {},
            {
              withCredentials: true,
              headers: {
                Cookie: cookieHeader, // send refresh token cookie
              },
            }
          );

          const newAccessToken = refreshResponse.data.data;

          // Attach new token
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

          // Retry original request
          return serverApi(originalRequest);
        } catch (refreshErr) {
          console.log("SERVER REFRESH FAILED");
          return Promise.reject({
            type: "REFRESH_FAILED",
            message: "Refresh token expired",
          });
        }
      }

      return Promise.reject(error);
    }
  );

  return serverApi;
}
