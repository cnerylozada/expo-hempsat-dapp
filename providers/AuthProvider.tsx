import * as SecureStore from "expo-secure-store";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { ActivityIndicator, View } from "react-native";

const KEYS = {
  jwt: "jwt",
} as const;

interface AuthContextType {
  isAuthenticated: boolean;
  signIn: (wallet: string, message: string, signature: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAuthState = async () => {
      const token = await SecureStore.getItemAsync(KEYS.jwt);
      setIsAuthenticated(!!token);
      setIsLoading(false);
    };
    loadAuthState();
  }, []);

  const signIn = async (wallet: string, message: string, signature: string) => {
    console.log("signIn ....");
    setIsLoading(true);
    const requestBody = {
      wallet,
      message,
      signature,
    };

    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/auth/sign-in`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      },
    );

    if (!response.ok) {
      throw new Error("Sign-in failed");
    }

    const { token } = await response.json();
    await SecureStore.setItemAsync(KEYS.jwt, token);
    setIsAuthenticated(true);
    setIsLoading(false);
  };

  const signOut = async () => {
    const token = await SecureStore.getItemAsync(KEYS.jwt);
    await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/sign-out`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    await SecureStore.deleteItemAsync(KEYS.jwt);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, signIn, signOut }}>
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
