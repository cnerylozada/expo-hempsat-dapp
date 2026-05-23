import { useAuth } from "@/providers/AuthProvider";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Drawer } from "expo-router/drawer";
import { View } from "react-native";

export default function DrawerLayout() {
  const { isAuthenticated } = useAuth();

  return (
    <Drawer
      screenLayout={({ children }) => (
        <View className="flex-1 p-4">{children}</View>
      )}
    >
      <Drawer.Screen
        name="home" // This is the name of the page and must match the url from root
        options={{
          drawerLabel: "Home",
          title: "Home",
          drawerIcon: ({ color, size }) => (
            <Ionicons color={color} size={size} name="home" />
          ),
        }}
      />
      <Drawer.Screen
        name="login" // This is the name of the page and must match the url from root
        options={{
          drawerLabel: "Login",
          title: "Login",
          drawerIcon: ({ color, size }) => (
            <Ionicons color={color} size={size} name="log-in" />
          ),
          drawerItemStyle: { display: !!isAuthenticated ? "none" : "flex" },
        }}
      />
      <Drawer.Screen
        name="dashboard" // This is the name of the page and must match the url from root
        options={{
          drawerLabel: "Dashboard",
          title: "Dashboard",
          drawerIcon: ({ color, size }) => (
            <Ionicons color={color} size={size} name="briefcase" />
          ),
          drawerItemStyle: { display: !isAuthenticated ? "none" : "flex" },
        }}
      />
    </Drawer>
  );
}
