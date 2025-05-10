import { useAuth } from "@/contexts/kamispa/auth-context"
import { Ionicons } from "@expo/vector-icons"
import { Tabs } from "expo-router"

export default function CustomerLayout() {
  const { user } = useAuth()

  // If no user or not customer, don't render the layout
  if (!user || user.role !== "customer") {
    return null
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#F05A77",
        tabBarInactiveTintColor: "#8E8E93",
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: "#E5E5EA",
          backgroundColor: "#fff",
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: "Roboto-Medium",
        },
        headerStyle: {
          backgroundColor: "#F05A77",
        },
        headerTitleStyle: {
          fontFamily: "Roboto-Bold",
          color: "#fff",
        },
        headerTintColor: "#fff",
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: user?.displayName?.toUpperCase() || "HOME",
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          title: "Services",
          tabBarIcon: ({ color, size }) => <Ionicons name="list" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="appointments"
        options={{
          title: "Appointments",
          tabBarIcon: ({ color, size }) => <Ionicons name="calendar" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
        }}
      />
    </Tabs>
  )
}
