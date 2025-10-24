import { APIEndpoint } from "@/app/api/apiEndpoint"
import axios from "axios"

const axiosInstance = axios.create({
  withCredentials: true,
})

type FailedRequest = {
  resolve: () => void
  reject: (err?: unknown) => void
}

let isRefreshing = false
let failedQueue: FailedRequest[] = []

const processQueue = (error?: Error) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error)
    else prom.resolve()
  })
  failedQueue = []
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: () => resolve(axiosInstance(originalRequest)),
            reject,
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        await axios.post(
          APIEndpoint.AUTH.POST_REFRESH,
          {},
          { withCredentials: true }
        )

        processQueue()
        return axiosInstance(originalRequest)
      } catch (err) {
        processQueue(err as Error)

        if (
          typeof window !== "undefined" &&
          !window.location.pathname.startsWith("/login")
        ) {
          window.location.href = "/dashboard/login"
        }
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export { axiosInstance }
