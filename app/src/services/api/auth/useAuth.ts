import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "./authService";
import { tokenStorage } from "../tokenStorage";
import type { StoredAuth } from "../tokenStorage";
import type { AuthResponse, LoginRequest, RegisterRequest } from "../types";
import { getTokenExpiresIn } from "../../../utils/tokenUtils";
import {
  REFRESH_AHEAD_MS,
  MIN_REFRESH_INTERVAL_MS,
} from "../../../constants/auth";

export const authKeys = {
  all: ["auth"] as const,
  session: () => [...authKeys.all, "session"] as const,
};

// ── Helpers ────────────────────────────────────────────

/**
 * Compute the dynamic refetch interval based on the cached access token.
 * Returns `false` when there is nothing to schedule.
 */
function computeRefreshInterval(
  accessToken: string | null,
): number | false {
  if (!accessToken) return false;
  const expiresIn = getTokenExpiresIn(accessToken);
  if (expiresIn <= 0) return false;
  return Math.max(expiresIn - REFRESH_AHEAD_MS, MIN_REFRESH_INTERVAL_MS);
}

// ── Hooks ──────────────────────────────────────────────

/**
 * Background session query that silently refreshes the access token
 * just before it expires. Enable it only while the user is authenticated.
 */
export function useSessionRefresh(enabled: boolean) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: authKeys.session(),
    queryFn: async (): Promise<StoredAuth> => {
      const refreshToken = await tokenStorage.getRefreshToken();
      if (!refreshToken) throw new Error("No refresh token");

      const data = await authService.refresh({ refreshToken });
      return {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        email: data.email,
      };
    },
    enabled,
    refetchInterval: () => {
      const cached = queryClient.getQueryData<StoredAuth>(authKeys.session());
      return computeRefreshInterval(cached?.accessToken ?? null);
    },
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    gcTime: Infinity,
    retry: 1,
    meta: { silent: true },
  });
}

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
