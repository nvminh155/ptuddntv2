"use client";

import { Card } from "@/components/kamispa/card";
import { SearchInput } from "@/components/kamispa/search-input";
import {
  deleteService,
  fetchServices,
} from "@/services/kamispa/service-service";
import { Ionicons } from "@expo/vector-icons";
import firestore from '@react-native-firebase/firestore';
import { useRouter } from "expo-router";
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

type Service = {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
};

export default function ServicesScreen() {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    loadServices();
    const servicesCollection = firestore().collection('services');

    const unsubscribe = servicesCollection.onSnapshot(
      (snapshot) => {
        const servicesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Service[];
        setServices(servicesData);
        setFilteredServices(servicesData);
      },
      (error) => {
        setError(error.message || "Failed to load services");
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredServices(services);
    } else {
      const filtered = services.filter(
        (service) =>
          service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          service.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredServices(filtered);
    }
  }, [searchQuery, services]);

  const loadServices = async () => {
    try {
      setIsLoading(true);
      const data = await fetchServices();
      setServices(data);
      setFilteredServices(data);
    } catch (err: any) {
      setError(err.message || "Failed to load services");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteService = (serviceId: string) => {
    Alert.alert(
      "Delete Service",
      "Are you sure you want to delete this service? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteService(serviceId);
              setServices((prevServices) =>
                prevServices.filter((service) => service.id !== serviceId)
              );
            } catch (err: any) {
              Alert.alert("Error", err.message || "Failed to delete service");
            }
          },
        },
      ]
    );
  };

  const renderServiceItem = ({ item }: { item: Service }) => (
    <Card style={styles.serviceCard}>
      <View style={styles.serviceHeader}>
        <Text style={styles.serviceName}>{item.name}</Text>
        <Text style={styles.servicePrice}>${item.price.toFixed(2)}</Text>
      </View>
      <Text style={styles.serviceDescription}>{item.description}</Text>
      <View style={styles.serviceDetails}>
        <Text style={styles.serviceDetail}>
          <Ionicons name="time-outline" size={14} color="#666" />{" "}
          {item.duration} min
        </Text>
        <Text style={styles.serviceDetail}>
          <Ionicons name="pricetag-outline" size={14} color="#666" />{" "}
          {item.category}
        </Text>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.viewButton]}
          onPress={() =>
            router.push({
              pathname: `/kamispa/admin/services/[id]`,
              params: {
                id: item.id,
              },
            })
          }
        >
          <Ionicons name="eye-outline" size={18} color="#007AFF" />
          <Text style={styles.viewButtonText}>View</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteService(item.id)}
        >
          <Ionicons name="trash-outline" size={18} color="#ff3b30" />
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading services...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={48} color="#ff3b30" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadServices}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <SearchInput
          placeholder="Search services..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/kamispa/admin/services/new")}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {filteredServices.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="list" size={64} color="#ccc" />
          <Text style={styles.emptyText}>
            {searchQuery.trim() !== ""
              ? "No services match your search"
              : "No services available"}
          </Text>
          {searchQuery.trim() === "" && (
            <TouchableOpacity
              style={styles.addFirstButton}
              onPress={() => router.push("/kamispa/admin/services/new")}
            >
              <Text style={styles.addFirstButtonText}>
                Add Your First Service
              </Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredServices}
          renderItem={renderServiceItem}
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
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e1e1e1",
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
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
  addFirstButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#007AFF",
    borderRadius: 8,
  },
  addFirstButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Inter-Medium",
  },
  serviceCard: {
    marginBottom: 16,
    padding: 16,
  },
  serviceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    fontFamily: "Inter-Bold",
  },
  servicePrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007AFF",
    fontFamily: "Inter-Bold",
  },
  serviceDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
    fontFamily: "Inter-Regular",
  },
  serviceDetails: {
    flexDirection: "row",
    marginBottom: 16,
  },
  serviceDetail: {
    fontSize: 14,
    color: "#666",
    marginRight: 16,
    fontFamily: "Inter-Regular",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginLeft: 8,
  },
  viewButton: {
    backgroundColor: "rgba(0, 122, 255, 0.1)",
  },
  viewButtonText: {
    color: "#007AFF",
    marginLeft: 4,
    fontSize: 14,
    fontFamily: "Inter-Medium",
  },
  deleteButton: {
    backgroundColor: "rgba(255, 59, 48, 0.1)",
  },
  deleteButtonText: {
    color: "#ff3b30",
    marginLeft: 4,
    fontSize: 14,
    fontFamily: "Inter-Medium",
  },
});
