"use client";

import { Redirect } from "expo-router";
import { StyleSheet } from "react-native";

export default function Index() {

 
  return <Redirect href={"/(auth)/sign-in"} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
});
