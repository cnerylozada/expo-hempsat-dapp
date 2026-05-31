import { isTokenExpired, signIn, signOut } from "@/server/auth";
import * as SecureStore from "expo-secure-store";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { ActivityIndicator, View } from "react-native";
import { useActiveWallet, useDisconnect } from "thirdweb/react";

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
  const { disconnect } = useDisconnect();
  const activeWallet = useActiveWallet();

  useEffect(() => {
    const loadAuthState = async () => {
      const token = await SecureStore.getItemAsync(KEYS.jwt);
      if (token && !isTokenExpired(token)) {
        setIsAuthenticated(true);
      } else await onSignOut();
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
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  const onSignOut = async () => {
    const token = await SecureStore.getItemAsync(KEYS.jwt);

    try {
      await signOut(token);
    } catch (error) {
      console.error(error);
    }
    if (activeWallet) disconnect(activeWallet);
    await SecureStore.deleteItemAsync(KEYS.jwt);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, onSignIn, onSignOut }}>
      {isLoading ? (
        <View className="flex-1 justify-center">
          <ActivityIndicator size={"large"} />
        </View>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
