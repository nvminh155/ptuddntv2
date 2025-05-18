import { Stack } from "expo-router";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { AuthProvider } from "@/contexts/auth-context";
import { CartProvider } from "@/contexts/cart-context";
import "@/global.css";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GluestackUIProvider mode="light">
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AuthProvider>
          <CartProvider>
            <SafeAreaView className="flex-1 mt-10">
              <StatusBar style="light" />
              <Stack
                screenOptions={{
                  headerShown: false,
                }}
                initialRouteName="index"
              />
            </SafeAreaView>
          </CartProvider>
        </AuthProvider>
      </GestureHandlerRootView>
    </GluestackUIProvider>
  );
}
