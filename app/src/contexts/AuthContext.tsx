import { createContext, useContext, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { tokenStorage, type StoredAuth } from "../services/api/tokenStorage";
import { setAuthFailureHandler } from "../services/api/client";
import { useSessionRefresh, authKeys } from "../services/api/auth/useAuth";
import { getPrimaryRole, isAdminToken } from "../utils/tokenUtils";

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  userEmail: string | null;
  /** Simplified admin check — adjust when backend provides role info */
  isAdmin: boolean;
  role: string | null;
}

const SIGNED_OUT_STATE: AuthState = {
  isAuthenticated: false,
  isLoading: false,
  userEmail: null,
  isAdmin: false,
  role: null,
};

interface AuthContextValue extends AuthState {
  signIn: (auth: StoredAuth) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    ...SIGNED_OUT_STATE,
    isLoading: true,
  });

  const queryClient = useQueryClient();

  // ── Silent token refresh (query lives in useAuth.ts) ──
  useSessionRefresh(state.isAuthenticated);

  // ── Forced sign-out (called on refresh failure or 401) ──
  const handleForcedSignOut = async () => {
    await tokenStorage.clear();
    queryClient.clear();
    setState(SIGNED_OUT_STATE);
    router.replace("/(auth)/login");
  };

  // ── Register auth failure handler for client.ts ──────
  useEffect(() => {
    setAuthFailureHandler(() => {
      handleForcedSignOut();
    });
    return () => setAuthFailureHandler(() => {});
  });

  // ── Bootstrap: restore session from storage ──────────
  useEffect(() => {
    const bootstrap = async () => {
      try {
        const stored = await tokenStorage.getStoredAuth();
        if (stored) {
          queryClient.setQueryData(authKeys.session(), stored);
          setState({
            isAuthenticated: true,
            isLoading: false,
            userEmail: stored.email,
            isAdmin: isAdminToken(stored.accessToken),
            role: getPrimaryRole(stored.accessToken),
          });
        } else {
          setState(SIGNED_OUT_STATE);
        }
      } catch {
        setState(SIGNED_OUT_STATE);
      }
    };
    bootstrap();
  }, []);

  // ── Public API ───────────────────────────────────────
  const signIn = (auth: StoredAuth) => {
    queryClient.setQueryData(authKeys.session(), auth);
    setState((prev) => ({
      ...prev,
      isAuthenticated: true,
      userEmail: auth.email,
      isAdmin: isAdminToken(auth.accessToken),
      role: getPrimaryRole(auth.accessToken),
    }));
  };

  const signOut = async () => {
    await tokenStorage.clear();
    queryClient.clear();
    setState(SIGNED_OUT_STATE);
  };

  return (
    <AuthContext.Provider value={{ ...state, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
