import { AuthProvider, useAuth } from "@/contexts/kamispa/auth-context"
import { Slot, SplashScreen, useRouter, useSegments } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { useEffect } from "react"

import { SafeAreaProvider } from "react-native-safe-area-context"

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
 
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="light" />
        <InitialLayout />
      </AuthProvider>
    </SafeAreaProvider>
  )
}

function InitialLayout() {
  const { user, isLoading } = useAuth()
  const segments = useSegments()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return

    const inAuthGroup = segments[1] === "(auth)"
    const inAdminGroup = segments[1] === "admin"
    const inCustomerGroup = segments[1] === "customer"

    if (!user && !inAuthGroup) {
      // Redirect to the sign-in page if not signed in
      router.replace("/kamispa/(auth)/login")
    } else if (user) {
      if (inAuthGroup) {
        // If user is signed in and in auth group, redirect based on role
        if (user.role === "admin") {
          router.replace("/kamispa/admin/dashboard")
        } else {
          router.replace("/kamispa/customer/home")
        }
      } else if (user.role === "admin" && !inAdminGroup) {
        // If admin user is not in admin group, redirect to admin dashboard
        router.replace("/kamispa/admin/dashboard")
      } else if (user.role === "customer" && !inCustomerGroup) {
        // If customer user is not in customer group, redirect to customer home
        router.replace("/kamispa/customer/home")
      }
    }
  }, [user, isLoading, segments, router])

  return <Slot />
}
