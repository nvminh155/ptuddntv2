import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";

const HomeLayout = () => {
 

  return (
    <Stack screenOptions={{
      headerShown: false
    }}>
      <StatusBar />
      <Stack.Screen
        options={{
          title: "Restaurant App",
          headerTintColor: "#E74C3C",
        }}
      />
    </Stack>
  );
};

export default HomeLayout;
