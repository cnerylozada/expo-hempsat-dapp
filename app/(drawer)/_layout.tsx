import { Drawer } from "expo-router/drawer";
import { View } from "react-native";
import { useActiveAccount } from "thirdweb/react";

export default function DrawerLayout() {
  const activeAccount = useActiveAccount();

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
          title: "overview",
        }}
      />
      <Drawer.Screen
        name="login" // This is the name of the page and must match the url from root
        options={{
          drawerLabel: "Login",
          title: "Login",
          drawerItemStyle: { display: !!activeAccount ? "none" : "flex" },
        }}
      />
      <Drawer.Screen
        name="dashboard" // This is the name of the page and must match the url from root
        options={{
          drawerLabel: "Dashboard",
          title: "Dashboard",
          drawerItemStyle: { display: !activeAccount ? "none" : "flex" },
        }}
      />
    </Drawer>
  );
}
