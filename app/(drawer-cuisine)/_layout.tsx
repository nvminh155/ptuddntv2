import { Drawer } from "expo-router/drawer";

export default function DrawerLayout() {
  return (
    <Drawer
      initialRouteName="cuisine"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Drawer.Screen
        name="profile" // This is the name of the page and must match the url from root
        options={{
          drawerLabel: "Profile",
          title: "Profile",
        }}
      />

       <Drawer.Screen
        name="cuisine" // This is the name of the page and must match the url from root
        options={{
          drawerLabel: "Cuisine",
          title: "Cuisine",
        }}
      />

       <Drawer.Screen
        name="orders" // This is the name of the page and must match the url from root
        options={{
          drawerLabel: "Orders",
          title: "Orders",
          headerShown: true

        }}
      />
    </Drawer>
  );
}
