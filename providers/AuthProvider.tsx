import { LoadingScreen } from "@/components/LoadingScreen";
import { isTokenExpired, signIn, signOut } from "@/server/auth";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

const KEYS = {
  jwt: "jwt",
} as const;

interface AuthContextType {
  isAuthenticated: boolean;
  onSignIn: (
    wallet: string,
    message: string,
    signature: string,
  ) => Promise<void>;
  onSignOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAuthState = async () => {
      const token = await SecureStore.getItemAsync(KEYS.jwt);
      if (token && isTokenExpired(token)) {
        await onSignOut();
        return;
      }
      setIsAuthenticated(!!token);
      setIsLoading(false);
    };
    loadAuthState();
  }, []);

  const onSignIn = async (
    wallet: string,
    message: string,
    signature: string,
  ) => {
    setIsLoading(true);
    const requestBody = {
      wallet,
      message,
      signature,
    };

    try {
      const token = await signIn(requestBody);
      await SecureStore.setItemAsync(KEYS.jwt, token);
      setIsAuthenticated(true);
      router.replace("/(drawer)/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  const onSignOut = async () => {
    setIsLoading(true);

    const token = await SecureStore.getItemAsync(KEYS.jwt);
    try {
      await signOut(token);
    } catch (error) {
      console.error(error);
    }
    await SecureStore.deleteItemAsync(KEYS.jwt);
    setIsAuthenticated(false);
    setIsLoading(false);
    router.replace("/(drawer)/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, onSignIn, onSignOut }}>
      {isLoading ? <LoadingScreen /> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
