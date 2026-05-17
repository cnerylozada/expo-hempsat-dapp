import { Drawer } from "expo-router/drawer";

export default function DrawerLayout() {
  return (
    <Drawer>
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
        }}
      />
    </Drawer>
  );
}
