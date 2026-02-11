import { apiClient } from "../client";
import { tokenStorage } from "../tokenStorage";
import type {
  AuthResponse,
  LoginRequest,
  RefreshTokenRequest,
  RegisterRequest,
} from "../types";

export const authService = {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/api/auth/register", data);
    await tokenStorage.save(response.data);
    return response.data;
  },

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/api/auth/login", data);
    await tokenStorage.save(response.data);
    return response.data;
  },

  async logout(): Promise<void> {
    await apiClient.post("/api/auth/logout");
    await tokenStorage.clear();
  },

  async refresh(data: RefreshTokenRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/api/auth/refresh", data);
    await tokenStorage.save(response.data);
    return response.data;
  },
};
