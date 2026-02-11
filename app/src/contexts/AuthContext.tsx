import { createContext, useContext, useEffect, useState } from "react";
import { tokenStorage, type StoredAuth } from "../services/api/tokenStorage";

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  userEmail: string | null;
  /** Simplified admin check — adjust when backend provides role info */
  isAdmin: boolean;
}

interface AuthContextValue extends AuthState {
  signIn: (auth: StoredAuth) => void;
  signOut: () => Promise<void>;
  setAdmin: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    userEmail: null,
    isAdmin: false,
  });

  useEffect(() => {
    const bootstrap = async () => {
      const stored = await tokenStorage.getStoredAuth();
      setState({
        isAuthenticated: !!stored,
        isLoading: false,
        userEmail: stored?.email ?? null,
        isAdmin: false,
      });
    };
    bootstrap();
  }, []);

  const signIn = (auth: StoredAuth) => {
    setState((prev) => ({
      ...prev,
      isAuthenticated: true,
      userEmail: auth.email,
    }));
  };

  const signOut = async () => {
    await tokenStorage.clear();
    setState({
      isAuthenticated: false,
      isLoading: false,
      userEmail: null,
      isAdmin: false,
    });
  };

  const setAdmin = (value: boolean) => {
    setState((prev) => ({ ...prev, isAdmin: value }));
  };

  return (
    <AuthContext.Provider value={{ ...state, signIn, signOut, setAdmin }}>
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
