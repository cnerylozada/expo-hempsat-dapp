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
import { useActiveWallet, useDisconnect } from "thirdweb/react";

const KEYS = {
  jwt: "jwt",
} as const;

interface AuthContextType {
  token: string | null;
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
  const [token, setToken] = useState<string | null>(null);
  const wallet = useActiveWallet();
  const { disconnect } = useDisconnect();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAuthState = async () => {
      const storedToken = await SecureStore.getItemAsync(KEYS.jwt);
      if (storedToken && isTokenExpired(storedToken)) {
        await onSignOut();
        return;
      }
      setToken(storedToken);
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
      const newToken = await signIn(requestBody);
      await SecureStore.setItemAsync(KEYS.jwt, newToken);
      setToken(newToken);
      router.replace("/(drawer)/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  const onSignOut = async () => {
    setIsLoading(true);

    if (wallet) disconnect(wallet);

    signOut(token).catch(console.error);
    await SecureStore.deleteItemAsync(KEYS.jwt);

    setIsLoading(false);
    setToken(null);
    router.replace("/(drawer)/login");
  };

  return (
    <AuthContext.Provider
      value={{ token, isAuthenticated: !!token, onSignIn, onSignOut }}
    >
      {isLoading ? <LoadingScreen /> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
