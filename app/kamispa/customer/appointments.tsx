"use client";

import { useAuth } from "@/contexts/kamispa/auth-context";
import {
  deleteAppointment,
  fetchCustomerAppointments,
  updateAppointment,
} from "@/services/kamispa/appointment-service";
import { Appointment } from "@/types/kamispa";
import { Ionicons } from "@expo/vector-icons";
import firestore from "@react-native-firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AppointmentsScreen() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      const unsubscribe = firestore()
        .collection("appointments")
        .where("customerId", "==", user.uid)
        .onSnapshot(
          (snapshot) => {
            const appointmentsData: Appointment[] = snapshot.docs.map(
              (doc) => ({
                id: doc.id,
                ...doc.data(),
              })
            ) as Appointment[];
            setAppointments(appointmentsData);
            setIsLoading(false);
          },
          (error) => {
            setError(error.message || "Failed to load appointments");
            setIsLoading(false);
          }
        );

      return () => unsubscribe();
    }
  }, [user]);

  const loadAppointments = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const data = await fetchCustomerAppointments(user.uid);
      setAppointments(data);
    } catch (err: any) {
      setError(err.message || "Failed to load appointments");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelAppointment = (appointmentId: string) => {
    Alert.alert(
      "Cancel Appointment",
      "Are you sure you want to cancel this appointment?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes",
          style: "destructive",
          onPress: async () => {
            try {
              await updateAppointment(appointmentId, { status: "cancelled" });
              // Update the local state
              setAppointments(
                appointments.map((appointment) =>
                  appointment.id === appointmentId
                    ? { ...appointment, status: "cancelled" }
                    : appointment
                )
              );
              Alert.alert("Success", "Appointment cancelled successfully");
            } catch (err: any) {
              Alert.alert(
                "Error",
                err.message || "Failed to cancel appointment"
              );
            }
          },
        },
      ]
    );
  };

  const handleDeleteAppointment = (appointmentId: string) => {
    if (!appointmentId) {
      Alert.alert("appointmentId is false");
      return;
    }
    Alert.alert(
      "Delete Appointment",
      "Are you sure you want to delete this appointment? This action cannot be undone.",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteAppointment(appointmentId);
              // Update the local state
              setAppointments(
                appointments.filter(
                  (appointment) => appointment.id !== appointmentId
                )
              );
              Alert.alert("Success", "Appointment deleted successfully");
            } catch (err: any) {
              Alert.alert(
                "Error",
                err.message || "Failed to delete appointment"
              );
            }
          },
        },
      ]
    );
  };

  const renderAppointmentItem = ({ item }: { item: Appointment }) => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case "pending":
          return "#ff9500";
        case "confirmed":
          return "#34c759";
        case "completed":
          return "#007aff";
        case "cancelled":
          return "#ff3b30";
        default:
          return "#8e8e93";
      }
    };

    return (
      <View style={styles.appointmentItem}>
        <View style={styles.appointmentHeader}>
          <Text style={styles.serviceName}>{item.serviceName}</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: `${getStatusColor(item.status)}20` },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: getStatusColor(item.status) },
              ]}
            >
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
        </View>

        <View style={styles.appointmentDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={16} color="#666" />
            <Text style={styles.detailText}>{item.date}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text style={styles.detailText}>{item.time}</Text>
          </View>
        </View>

        {item.notes && <Text style={styles.notes}>{item.notes}</Text>}

        <View style={styles.actionButtons}>
          {item.status === "pending" && (
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={() => handleCancelAppointment(item.id)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          )}

          {(item.status === "completed" || item.status === "cancelled") && (
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => handleDeleteAppointment(item.id)}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F05A77" />
        <Text style={styles.loadingText}>Loading appointments...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={48} color="#ff3b30" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadAppointments}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {appointments.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No appointments found</Text>
          <TouchableOpacity style={styles.bookButton} onPress={() => {}}>
            <Text style={styles.bookButtonText}>Book a Service</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={appointments}
          renderItem={renderAppointmentItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.appointmentList}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    marginTop: 16,
    marginBottom: 24,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    fontFamily: "Roboto-Regular",
  },
  bookButton: {
    backgroundColor: "#F05A77",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Roboto-Bold",
  },
  appointmentList: {
    padding: 16,
  },
  appointmentItem: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  appointmentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    fontFamily: "Roboto-Bold",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontFamily: "Roboto-Medium",
  },
  appointmentDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
    fontFamily: "Roboto-Regular",
  },
  notes: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
    fontStyle: "italic",
    fontFamily: "Roboto-Regular",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: "rgba(255, 59, 48, 0.1)",
  },
  cancelButtonText: {
    color: "#ff3b30",
    fontSize: 14,
    fontFamily: "Roboto-Medium",
  },
  deleteButton: {
    backgroundColor: "rgba(255, 59, 48, 0.1)",
  },
  deleteButtonText: {
    color: "#ff3b30",
    fontSize: 14,
    fontFamily: "Roboto-Medium",
  },
});
