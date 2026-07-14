import { useAuth } from "@/providers/AuthProvider";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Drawer } from "expo-router/drawer";

export default function DrawerLayout() {
  const { isAuthenticated } = useAuth();

  return (
    <Drawer>
      <Drawer.Screen
        name="home"
        options={{
          drawerLabel: "Home",
          title: "Home",
          drawerIcon: ({ color, size }) => (
            <Ionicons color={color} size={size} name="home" />
          ),
        }}
      />
      <Drawer.Screen
        name="login"
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
        name="dashboard/index"
        options={{
          drawerLabel: "Dashboard",
          title: "Dashboard",
          drawerIcon: ({ color, size }) => (
            <Ionicons color={color} size={size} name="briefcase" />
          ),
          drawerItemStyle: { display: !isAuthenticated ? "none" : "flex" },
        }}
      />
      <Drawer.Screen
        name="dashboard/farms"
        options={{
          headerShown: false,
          title: "Farms",
          drawerIcon: ({ color, size }) => (
            <Ionicons color={color} size={size} name="flower-outline" />
          ),
          drawerItemStyle: { display: !isAuthenticated ? "none" : "flex" },
        }}
      />
      <Drawer.Screen
        name="dashboard/identification"
        options={{
          headerShown: false,
          drawerItemStyle: { display: "none" },
        }}
      />
    </Drawer>
  );
}
