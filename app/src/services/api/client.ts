import axios from "axios";
import { tokenStorage } from "./tokenStorage";
import type { AuthResponse } from "./types";

const BASE_URL = "http://localhost:8080";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Request interceptor: attach access token ──────────
apiClient.interceptors.request.use(async (config) => {
  // Skip auth header for public endpoints
  const publicPaths = ["/api/auth/login", "/api/auth/register", "/api/auth/refresh"];
  const isPublic = publicPaths.some((path) => config.url?.includes(path));

  if (!isPublic) {
    const token = await tokenStorage.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

// ── Response interceptor: auto-refresh on 401 ─────────
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (token) {
      promise.resolve(token);
    } else {
      promise.reject(error);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Don't retry auth endpoints or already-retried requests
    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      originalRequest.url?.includes("/api/auth/")
    ) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(originalRequest));
          },
          reject,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = await tokenStorage.getRefreshToken();
      if (!refreshToken) throw new Error("No refresh token");

      const { data } = await axios.post<AuthResponse>(
        `${BASE_URL}/api/auth/refresh`,
        { refreshToken },
      );

      await tokenStorage.save(data);

      processQueue(null, data.accessToken);

      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError);
      await tokenStorage.clear();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
