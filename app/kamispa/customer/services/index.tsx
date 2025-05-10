import { fetchServices, searchServices } from "@/services/kamispa/service-service"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { useEffect, useState } from "react"
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"

type Service = {
  id: string
  name: string
  description: string
  price: number
  duration?: number
  category?: string
}

export default function ServicesScreen() {
  const [services, setServices] = useState<Service[]>([])
  const [filteredServices, setFilteredServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  useEffect(() => {
    loadServices()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredServices(services)
    } else {
      handleSearch(searchQuery)
    }
  }, [searchQuery, services])

  const loadServices = async () => {
    try {
      setIsLoading(true)
      const data = await fetchServices()
      setServices(data)
      setFilteredServices(data)
    } catch (err: any) {
      setError(err.message || "Failed to load services")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = async (query: string) => {
    if (query.trim() === "") {
      setFilteredServices(services)
      return
    }

    try {
      const results = await searchServices(query)
      setFilteredServices(results)
    } catch (err: any) {
      console.error("Search error:", err)
      // Fall back to client-side filtering if search API fails
      const filtered = services.filter(
        (service) =>
          service.name.toLowerCase().includes(query.toLowerCase()) ||
          (service.description && service.description.toLowerCase().includes(query.toLowerCase())) ||
          (service.category && service.category.toLowerCase().includes(query.toLowerCase()))
      )
      setFilteredServices(filtered)
    }
  }

  const renderServiceItem = ({ item }: { item: Service }) => (
    <TouchableOpacity
      style={styles.serviceItem}
      onPress={() => router.push({
        pathname: `/kamispa/customer/services/[id]`,
        params: {
          id: item.id
        }
      })}
    >
      <View style={styles.serviceContent}>
        <View style={styles.serviceInfo}>
          <Text style={styles.serviceName}>{item.name}</Text>
          {item.description && <Text style={styles.serviceDescription}>{item.description}</Text>}
          {item.duration && (
            <Text style={styles.serviceDuration}>
              <Ionicons name="time-outline" size={14} color="#666" /> {item.duration} min
            </Text>
          )}
        </View>
        <Text style={styles.servicePrice}>{item.price.toLocaleString()} đ</Text>
      </View>
    </TouchableOpacity>
  )

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F05A77" />
        <Text style={styles.loadingText}>Loading services...</Text>
      </View>
    )
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
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search services..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {filteredServices.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="search" size={64} color="#ccc" />
          <Text style={styles.emptyText}>
            {searchQuery.trim() !== "" ? "No services match your search" : "No services available"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredServices}
          renderItem={renderServiceItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.serviceList}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    margin: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    fontFamily: "Roboto-Regular",
  },
  clearButton: {
    padding: 4,
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
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    fontFamily: "Roboto-Regular",
  },
  serviceList: {
    padding: 16,
  },
  serviceItem: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  serviceContent: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  serviceInfo: {
    flex: 1,
    marginRight: 16,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
    fontFamily: "Roboto-Bold",
  },
  serviceDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
    fontFamily: "Roboto-Regular",
  },
  serviceDuration: {
    fontSize: 14,
    color: "#666",
    fontFamily: "Roboto-Regular",
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#F05A77",
    fontFamily: "Roboto-Bold",
  },
})
