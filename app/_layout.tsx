import { Stack } from "expo-router";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { AuthProvider } from "@/contexts/auth-context";
import "@/global.css";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <GluestackUIProvider mode="light">
      <AuthProvider>
        <SafeAreaView edges={["bottom"]} className="flex-1">
          <Stack screenOptions={{ headerShown: false }} />
        </SafeAreaView>
      </AuthProvider>
    </GluestackUIProvider>
  );
}
