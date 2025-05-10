"use client";

import { Card } from "@/components/kamispa/card";
import { SearchInput } from "@/components/kamispa/search-input";
import { Tabs } from "@/components/kamispa/tabs";
import {
  fetchAppointments,
  updateAppointment
} from "@/services/kamispa/appointment-service";
import { Ionicons } from "@expo/vector-icons";
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

type Appointment = {
  id: string;
  customerId: string;
  customerName: string;
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  notes?: string;
};

export default function TransactionsScreen() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<
    Appointment[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    loadAppointments();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [searchQuery, activeTab, appointments]);

  const loadAppointments = async () => {
    try {
      setIsLoading(true);
      const data = await fetchAppointments();
      setAppointments(data);
    } catch (err: any) {
      setError(err.message || "Failed to load appointments");
    } finally {
      setIsLoading(false);
    }
  };

  const filterAppointments = () => {
    let filtered = [...appointments];

    // Filter by status
    if (activeTab !== "all") {
      filtered = filtered.filter(
        (appointment) => appointment.status === activeTab
      );
    }

    // Filter by search query
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter(
        (appointment) =>
          appointment.customerName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          appointment.serviceName
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    setFilteredAppointments(filtered);
  };

  const handleUpdateStatus = async (
    appointmentId: string,
    newStatus: "confirmed" | "completed" | "cancelled"
  ) => {
    try {
      await updateAppointment(appointmentId, {
        status: newStatus,
      });

      // Update local state
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment.id === appointmentId
            ? { ...appointment, status: newStatus }
            : appointment
        )
      );

      Alert.alert("Success", "Appointment status updated successfully");
    } catch (err: any) {
      Alert.alert(
        "Error",
        err.message || "Failed to update appointment status"
      );
    }
  };

  const renderAppointmentItem = ({ item }: { item: Appointment }) => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case "pending":
          return "#ff9500";
        case "confirmed":
          return "#007AFF";
        case "completed":
          return "#34c759";
        case "cancelled":
          return "#ff3b30";
        default:
          return "#8e8e93";
      }
    };

    return (
      <Card style={styles.appointmentCard}>
        <View style={styles.appointmentHeader}>
          <Text style={styles.customerName}>{item.customerName}</Text>
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

        <Text style={styles.serviceName}>{item.serviceName}</Text>

        <View style={styles.appointmentDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="calendar-outline" size={16} color="#666" />
            <Text style={styles.detailText}>{item.date}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text style={styles.detailText}>{item.time}</Text>
          </View>
        </View>

        {item.notes && <Text style={styles.notes}>Notes: {item.notes}</Text>}

        <View style={styles.actionButtons}>
          {item.status === "pending" && (
            <>
              <TouchableOpacity
                style={[styles.actionButton, styles.confirmButton]}
                onPress={() => handleUpdateStatus(item.id, "confirmed")}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton]}
                onPress={() => handleUpdateStatus(item.id, "cancelled")}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </>
          )}

          {item.status === "confirmed" && (
            <TouchableOpacity
              style={[styles.actionButton, styles.completeButton]}
              onPress={() => handleUpdateStatus(item.id, "completed")}
            >
              <Text style={styles.completeButtonText}>Mark as Completed</Text>
            </TouchableOpacity>
          )}
        </View>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
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
      <View style={styles.header}>
        <SearchInput
          placeholder="Search appointments..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <Tabs
        tabs={[
          { id: "all", label: "All" },
          { id: "pending", label: "Pending" },
          { id: "confirmed", label: "Confirmed" },
          { id: "completed", label: "Completed" },
          { id: "cancelled", label: "Cancelled" },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        style={styles.tabs}
      />

      {filteredAppointments.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar" size={64} color="#ccc" />
          <Text style={styles.emptyText}>
            {searchQuery.trim() !== ""
              ? "No appointments match your search"
              : `No ${
                  activeTab !== "all" ? activeTab : ""
                } appointments available`}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredAppointments}
          renderItem={renderAppointmentItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e1e1e1",
  },
  tabs: {
    marginBottom: 8,
  },
  listContent: {
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    fontFamily: "Inter-Regular",
  },
  appointmentCard: {
    marginBottom: 16,
    padding: 16,
  },
  appointmentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  customerName: {
    fontSize: 18,
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
  serviceName: {
    fontSize: 16,
    marginBottom: 12,
    fontFamily: "Inter-Regular",
  },
  appointmentDetails: {
    flexDirection: "row",
    marginBottom: 12,
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
  notes: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
    fontStyle: "italic",
    fontFamily: "Inter-Regular",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginLeft: 8,
  },
  confirmButton: {
    backgroundColor: "rgba(0, 122, 255, 0.1)",
  },
  confirmButtonText: {
    color: "#007AFF",
    fontSize: 14,
    fontFamily: "Inter-Medium",
  },
  cancelButton: {
    backgroundColor: "rgba(255, 59, 48, 0.1)",
  },
  cancelButtonText: {
    color: "#ff3b30",
    fontSize: 14,
    fontFamily: "Inter-Medium",
  },
  completeButton: {
    backgroundColor: "rgba(52, 199, 89, 0.1)",
  },
  completeButtonText: {
    color: "#34c759",
    fontSize: 14,
    fontFamily: "Inter-Medium",
  },
});
