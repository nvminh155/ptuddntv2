"use client"

import { useAuth } from "@/contexts/kamispa/auth-context"
import { createAppointment } from "@/services/kamispa/appointment-service"
import { fetchServiceById } from "@/services/kamispa/service-service"
import { Service } from "@/types/kamispa"
import { Ionicons } from "@expo/vector-icons"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useEffect, useState } from "react"
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"



export default function ServiceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [service, setService] = useState<Service | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isBooking, setIsBooking] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    if (id) {
      loadService()
    }
  }, [id])

  const loadService = async () => {
    try {
      setIsLoading(true)
      const data = await fetchServiceById(id)
      setService(data)
    } catch (err: any) {
      setError(err.message || "Failed to load service details")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBookAppointment = async () => {
    if (!service || !user) return

    setIsBooking(true)

    try {
      // In a real app, you would show a date/time picker here
      // For this example, we'll just create an appointment for tomorrow
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(10, 0, 0, 0)

      const appointmentData = {
        customerId: user.uid,
        customerName: user.displayName || "Customer",
        serviceId: service.id,
        serviceName: service.name,
        date: tomorrow.toISOString().split("T")[0],
        time: "10:00 AM",
        status: "pending" as const,
        notes: "Booked via mobile app",
      }

      await createAppointment(appointmentData)

      Alert.alert("Appointment Booked", "Your appointment has been successfully booked for tomorrow at 10:00 AM.", [
        { text: "OK", onPress: () => router.push("/kamispa/customer/appointments") },
      ])
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to book appointment")
    } finally {
      setIsBooking(false)
    }
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F05A77" />
        <Text style={styles.loadingText}>Loading service details...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={48} color="#ff3b30" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadService}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    )
  }

  if (!service) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Service not found</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => router.back()}>
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.serviceName}>{service.name}</Text>
          <Text style={styles.servicePrice}>{service.price.toLocaleString()} đ</Text>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={20} color="#666" />
            <Text style={styles.detailText}>{service.duration} minutes</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="pricetag-outline" size={20} color="#666" />
            <Text style={styles.detailText}>{service.category}</Text>
          </View>
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>Description</Text>
          <Text style={styles.descriptionText}>{service.description}</Text>
        </View>

        <TouchableOpacity style={styles.bookButton} onPress={handleBookAppointment} disabled={isBooking}>
          {isBooking ? <ActivityIndicator color="#fff" /> : <Text style={styles.bookButtonText}>Book Appointment</Text>}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
    fontFamily: "Roboto-Regular",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    fontFamily: "Roboto-Regular",
  },
  retryButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#F05A77",
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Roboto-Medium",
  },
  header: {
    marginBottom: 24,
  },
  serviceName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    fontFamily: "Roboto-Bold",
  },
  servicePrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#F05A77",
    fontFamily: "Roboto-Bold",
  },
  detailsContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  detailText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 12,
    fontFamily: "Roboto-Regular",
  },
  descriptionContainer: {
    marginBottom: 32,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    fontFamily: "Roboto-Bold",
  },
  descriptionText: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
    fontFamily: "Roboto-Regular",
  },
  bookButton: {
    backgroundColor: "#F05A77",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Roboto-Bold",
  },
})
