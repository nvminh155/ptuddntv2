"use client"

import { Button } from "@/components/kamispa/button"
import { Card } from "@/components/kamispa/card"
import { TextInput } from "@/components/kamispa/text-input"
import { fetchCustomerAppointments } from "@/services/kamispa/appointment-service"
import { fetchCustomerById, updateCustomer } from "@/services/kamispa/customer-service"
import { Appointment, Customer } from "@/types/kamispa"
import { Ionicons } from "@expo/vector-icons"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useEffect, useState } from "react"
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"



export default function CustomerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<Partial<Customer>>({})
  const router = useRouter()

  useEffect(() => {
    if (id) {
      loadCustomerData()
    }
  }, [id])

  const loadCustomerData = async () => {
    try {
      setIsLoading(true)
      const customerData = await fetchCustomerById(id)
      setCustomer(customerData)
      setFormData(customerData)

      const appointmentsData = await fetchCustomerAppointments(id)
      setAppointments(appointmentsData)
    } catch (err: any) {
      setError(err.message || "Failed to load customer data")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateCustomer = async () => {
    if (!customer || !formData.displayName || !formData.email) {
      Alert.alert("Error", "Name and email are required")
      return
    }

    setIsSaving(true)

    try {
      await updateCustomer(customer.id, formData)
      setCustomer({ ...customer, ...formData })
      setIsEditing(false)
      Alert.alert("Success", "Customer information updated successfully")
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to update customer")
    } finally {
      setIsSaving(false)
    }
  }

  const renderAppointmentItem = (appointment: Appointment) => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case "pending":
          return "#ff9500"
        case "confirmed":
          return "#007AFF"
        case "completed":
          return "#34c759"
        case "cancelled":
          return "#ff3b30"
        default:
          return "#8e8e93"
      }
    }

    return (
      <Card key={appointment.id} style={styles.appointmentCard}>
        <View style={styles.appointmentHeader}>
          <Text style={styles.appointmentService}>{appointment.serviceName}</Text>
          <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(appointment.status)}20` }]}>
            <Text style={[styles.statusText, { color: getStatusColor(appointment.status) }]}>
              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
            </Text>
          </View>
        </View>
        <View style={styles.appointmentDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="calendar-outline" size={16} color="#666" />
            <Text style={styles.detailText}>{appointment.date}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text style={styles.detailText}>{appointment.time}</Text>
          </View>
        </View>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading customer details...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={48} color="#ff3b30" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadCustomerData}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Customer Details</Text>
          <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(!isEditing)}>
            <Ionicons name={isEditing ? "close" : "create-outline"} size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>

        {isEditing ? (
          <Card style={styles.card}>
            <TextInput
              label="Name"
              value={formData.displayName}
              onChangeText={(text) => setFormData({ ...formData, displayName: text })}
              placeholder="Enter customer name"
            />
            <TextInput
              label="Email"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              placeholder="Enter customer email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              label="Phone"
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              placeholder="Enter customer phone"
              keyboardType="phone-pad"
            />
            <TextInput
              label="Address"
              value={formData.address}
              onChangeText={(text) => setFormData({ ...formData, address: text })}
              placeholder="Enter customer address"
              multiline
            />
            <TextInput
              label="Notes"
              value={formData.notes}
              onChangeText={(text) => setFormData({ ...formData, notes: text })}
              placeholder="Enter notes about this customer"
              multiline
            />
            <Button
              title={isSaving ? "Saving..." : "Save Changes"}
              onPress={handleUpdateCustomer}
              disabled={isSaving}
              style={styles.saveButton}
            >
              {isSaving && <ActivityIndicator color="#fff" style={styles.loader} />}
            </Button>
          </Card>
        ) : (
          <Card style={styles.card}>
            <View style={styles.customerAvatar}>
              <Text style={styles.avatarText}>
                {customer?.displayName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </Text>
            </View>
            <Text style={styles.customerName}>{customer?.displayName}</Text>

            <View style={styles.infoSection}>
              <View style={styles.infoItem}>
                <Ionicons name="mail-outline" size={20} color="#666" />
                <Text style={styles.infoText}>{customer?.email}</Text>
              </View>

              {customer?.phone && (
                <View style={styles.infoItem}>
                  <Ionicons name="call-outline" size={20} color="#666" />
                  <Text style={styles.infoText}>{customer.phone}</Text>
                </View>
              )}

              {customer?.address && (
                <View style={styles.infoItem}>
                  <Ionicons name="location-outline" size={20} color="#666" />
                  <Text style={styles.infoText}>{customer.address}</Text>
                </View>
              )}

              {customer?.notes && (
                <View style={styles.infoItem}>
                  <Ionicons name="document-text-outline" size={20} color="#666" />
                  <Text style={styles.infoText}>{customer.notes}</Text>
                </View>
              )}
            </View>
          </Card>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appointment History</Text>
          {appointments.length > 0 ? (
            appointments.map(renderAppointmentItem)
          ) : (
            <Card style={styles.emptyCard}>
              <Text style={styles.emptyText}>No appointment history</Text>
            </Card>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Inter-Bold",
  },
  editButton: {
    padding: 8,
  },
  card: {
    marginBottom: 24,
    padding: 16,
  },
  customerAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 16,
  },
  avatarText: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    fontFamily: "Inter-Bold",
  },
  customerName: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
    fontFamily: "Inter-Bold",
  },
  infoSection: {
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
    fontFamily: "Inter-Regular",
  },
  saveButton: {
    marginTop: 16,
  },
  loader: {
    marginLeft: 10,
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
  appointmentService: {
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
  appointmentDetails: {
    flexDirection: "row",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  detailText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
    fontFamily: "Inter-Regular",
  },
  emptyCard: {
    padding: 24,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    fontStyle: "italic",
    fontFamily: "Inter-Regular",
  },
})
