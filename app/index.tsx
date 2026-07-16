import { useAuth } from "@/providers/AuthProvider";
import { Redirect } from "expo-router";

export default function IndexScreen() {
  const { isAuthenticated } = useAuth();
  return (
    <Redirect
      href={isAuthenticated ? "/(drawer)/dashboard" : "/(drawer)/home"}
    />
  );
}
