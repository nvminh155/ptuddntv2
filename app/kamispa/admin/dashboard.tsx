"use client"

import { Card } from "@/components/kamispa/card"
import { useAuth } from "@/contexts/kamispa/auth-context"
import { fetchDashboardStats } from "@/services/kamispa/admin-service"
import { Ionicons } from "@expo/vector-icons"
import { useEffect, useState } from "react"
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

type DashboardStats = {
  totalServices: number
  totalCustomers: number
  pendingAppointments: number
  completedAppointments: number
  recentAppointments: {
    id: string
    customerName: string
    serviceName: string
    date: string
    status: string
  }[]
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true)
        const data = await fetchDashboardStats()
        setStats(data)
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard data")
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={48} color="#ff3b30" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => setIsLoading(true)}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, {user?.displayName}</Text>
          <Text style={styles.subGreeting}>Heres your business overview</Text>
        </View>

        <View style={styles.statsGrid}>
          <Card style={styles.statsCard}>
            <View style={styles.statsCardContent}>
              <Ionicons name="list" size={24} color="#007AFF" />
              <Text style={styles.statsNumber}>{stats?.totalServices || 0}</Text>
              <Text style={styles.statsLabel}>Services</Text>
            </View>
          </Card>

          <Card style={styles.statsCard}>
            <View style={styles.statsCardContent}>
              <Ionicons name="people" size={24} color="#34c759" />
              <Text style={styles.statsNumber}>{stats?.totalCustomers || 0}</Text>
              <Text style={styles.statsLabel}>Customers</Text>
            </View>
          </Card>

          <Card style={styles.statsCard}>
            <View style={styles.statsCardContent}>
              <Ionicons name="time" size={24} color="#ff9500" />
              <Text style={styles.statsNumber}>{stats?.pendingAppointments || 0}</Text>
              <Text style={styles.statsLabel}>Pending</Text>
            </View>
          </Card>

          <Card style={styles.statsCard}>
            <View style={styles.statsCardContent}>
              <Ionicons name="checkmark-circle" size={24} color="#34c759" />
              <Text style={styles.statsNumber}>{stats?.completedAppointments || 0}</Text>
              <Text style={styles.statsLabel}>Completed</Text>
            </View>
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Appointments</Text>
          {stats?.recentAppointments && stats.recentAppointments.length > 0 ? (
            stats.recentAppointments.map((appointment) => (
              <Card key={appointment.id} style={styles.appointmentCard}>
                <View style={styles.appointmentHeader}>
                  <Text style={styles.appointmentCustomer}>{appointment.customerName}</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: appointment.status === "pending" ? "#fff3cd" : "#d4edda" },
                    ]}
                  >
                    <Text
                      style={[styles.statusText, { color: appointment.status === "pending" ? "#856404" : "#155724" }]}
                    >
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </Text>
                  </View>
                </View>
                <Text style={styles.appointmentService}>{appointment.serviceName}</Text>
                <Text style={styles.appointmentDate}>{appointment.date}</Text>
              </Card>
            ))
          ) : (
            <Text style={styles.noDataText}>No recent appointments</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContent: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
    fontFamily: "Inter-Regular",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    fontFamily: "Inter-Regular",
  },
  retryButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#007AFF",
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Inter-Medium",
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
    fontFamily: "Inter-Bold",
  },
  subGreeting: {
    fontSize: 16,
    color: "#666",
    fontFamily: "Inter-Regular",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  statsCard: {
    width: "48%",
    marginBottom: 16,
  },
  statsCardContent: {
    padding: 16,
    alignItems: "center",
  },
  statsNumber: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 8,
    fontFamily: "Inter-Bold",
  },
  statsLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
    fontFamily: "Inter-Regular",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    fontFamily: "Inter-Bold",
  },
  appointmentCard: {
    marginBottom: 12,
    padding: 16,
  },
  appointmentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  appointmentCustomer: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Inter-Bold",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontFamily: "Inter-Medium",
  },
  appointmentService: {
    fontSize: 14,
    marginBottom: 4,
    fontFamily: "Inter-Regular",
  },
  appointmentDate: {
    fontSize: 12,
    color: "#666",
    fontFamily: "Inter-Regular",
  },
  noDataText: {
    textAlign: "center",
    color: "#666",
    fontStyle: "italic",
    padding: 20,
    fontFamily: "Inter-Regular",
  },
})
