import { APIEndpoint } from "@/app/api/apiEndpoint";
import axios from "axios";

export const axiosInstance = axios.create();

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error?: any) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });

  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: () => {
              resolve(axiosInstance(originalRequest));
            },
            reject: (err: any) => reject(err),
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axios.post(APIEndpoint.POST_REFRESH);
        processQueue()
        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err);

        if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
          window.location.href = "/dashboard/login";
        }
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
