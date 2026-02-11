import axios from "axios";
import { tokenStorage } from "./tokenStorage";
import { isTokenExpiringSoon } from "../../utils/tokenUtils";
import type { AuthResponse } from "./types";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080";

/** Threshold before expiry at which a proactive refresh is triggered (ms). */
const REFRESH_THRESHOLD_MS = 60_000; // 60 seconds

/** Global request timeout (ms). Prevents hanging when the backend is unreachable. */
const REQUEST_TIMEOUT_MS = 15_000;

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: REQUEST_TIMEOUT_MS,
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Auth failure handler (set by AuthContext) ─────────
type AuthFailureHandler = () => void;
let onAuthFailure: AuthFailureHandler | null = null;

export function setAuthFailureHandler(handler: AuthFailureHandler): void {
  onAuthFailure = handler;
}

// ── Shared refresh mutex ──────────────────────────────
let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

const PUBLIC_PATHS = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/refresh",
];

function isPublicPath(url: string | undefined): boolean {
  return PUBLIC_PATHS.some((p) => url?.includes(p));
}

/**
 * Perform a token refresh, de-duplicating concurrent calls.
 * Returns the new access token or throws.
 */
function doRefresh(): Promise<string> {
  if (refreshPromise) return refreshPromise;

  isRefreshing = true;
  refreshPromise = (async () => {
    const refreshToken = await tokenStorage.getRefreshToken();
    if (!refreshToken) throw new Error("No refresh token");

    const { data } = await axios.post<AuthResponse>(
      `${BASE_URL}/api/auth/refresh`,
      { refreshToken },
      { timeout: REQUEST_TIMEOUT_MS },
    );

    await tokenStorage.save(data);
    return data.accessToken;
  })();

  refreshPromise
    .catch(() => {
      /* swallow – callers handle their own errors */
    })
    .finally(() => {
      isRefreshing = false;
      refreshPromise = null;
    });

  return refreshPromise;
}

// ── Request interceptor: attach token + proactive refresh ──
apiClient.interceptors.request.use(async (config) => {
  if (isPublicPath(config.url)) return config;

  let token = await tokenStorage.getAccessToken();

  // Proactively refresh if the token is about to expire
  if (token && isTokenExpiringSoon(token, REFRESH_THRESHOLD_MS)) {
    try {
      token = await doRefresh();
    } catch {
      // Let the request go through with the old token;
      // the 401 response interceptor will handle it if it truly expired.
    }
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ── Response interceptor: 401 fallback refresh ─────────
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Don't retry auth endpoints or already-retried requests
    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      isPublicPath(originalRequest.url)
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const newToken = await doRefresh();
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      await tokenStorage.clear();
      onAuthFailure?.();
      return Promise.reject(refreshError);
    }
  },
);
