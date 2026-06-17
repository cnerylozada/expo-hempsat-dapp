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
        name="dashboard/identification/index"
        options={{
          drawerLabel: "Identification",
          title: "Identification",
          drawerIcon: ({ color, size }) => (
            <Ionicons color={color} size={size} name="person-circle-outline" />
          ),
          drawerItemStyle: { display: !isAuthenticated ? "none" : "flex" },
        }}
      />
      <Drawer.Screen
        name="dashboard/identification/validate-id-card"
        options={{
          title: "Verify Identity",
          drawerItemStyle: { display: "none" },
        }}
      />
      <Drawer.Screen
        name="dashboard/farms/index"
        options={{
          title: "Farms",
          drawerIcon: ({ color, size }) => (
            <Ionicons color={color} size={size} name="flower-outline" />
          ),
        }}
      />
      <Drawer.Screen
        name="dashboard/farms/create-farm/index"
        options={{
          title: "Register farm",
          drawerItemStyle: { display: "none" },
        }}
      />
    </Drawer>
  );
}
