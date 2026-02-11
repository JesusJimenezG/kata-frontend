import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "./authService";
import type { AuthResponse, LoginRequest, RegisterRequest } from "../types";

export const authKeys = {
  all: ["auth"] as const,
  session: () => [...authKeys.all, "session"] as const,
};

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, Error, LoginRequest>({
    mutationFn: (data) => authService.login(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.session() });
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, Error, RegisterRequest>({
    mutationFn: (data) => authService.register(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.session() });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation<void, Error>({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.clear();
    },
  });
}
