"use client"

import { Button } from "@/components/kamispa/button"
import { TextInput } from "@/components/kamispa/text-input"
import { deleteService, fetchServiceById, updateService } from "@/services/kamispa/service-service"
import { Service } from "@/types/kamispa"
import { Ionicons } from "@expo/vector-icons"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useEffect, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"



export default function ServiceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [service, setService] = useState<Service | null>(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [duration, setDuration] = useState("")
  const [category, setCategory] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const router = useRouter()

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
      setName(data.name)
      setDescription(data.description)
      setPrice(data.price.toString())
      setDuration(data.duration ? data.duration.toString() : "")
      setCategory(data.category ?? "")
    } catch (err: any) {
      setError(err.message || "Failed to load service details")
    } finally {
      setIsLoading(false)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!name.trim()) newErrors.name = "Service name is required"
    if (!description.trim()) newErrors.description = "Description is required"

    if (!price.trim()) {
      newErrors.price = "Price is required"
    } else if (isNaN(Number(price)) || Number(price) <= 0) {
      newErrors.price = "Price must be a positive number"
    }

    if (!duration.trim()) {
      newErrors.duration = "Duration is required"
    } else if (isNaN(Number(duration)) || Number(duration) <= 0) {
      newErrors.duration = "Duration must be a positive number"
    }

    if (!category.trim()) newErrors.category = "Category is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleUpdateService = async () => {
    if (!validateForm() || !service) return

    setIsSaving(true)

    try {
      await updateService(service.id, {
        name,
        description,
        price: Number(price),
        duration: Number(duration),
        category,
      })

      Alert.alert("Success", "Service updated successfully", [{ text: "OK", onPress: () => router.back() }])
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to update service")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteService = () => {
    if (!service) return

    Alert.alert("Delete Service", "Are you sure you want to delete this service? This action cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteService(service.id)
            Alert.alert("Success", "Service deleted successfully", [
              { text: "OK", onPress: () => router.replace("/kamispa/admin/services") },
            ])
          } catch (err: any) {
            Alert.alert("Error", err.message || "Failed to delete service")
          }
        },
      },
    ])
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
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

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoid}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Service Details</Text>
            <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteService}>
              <Ionicons name="trash-outline" size={24} color="#ff3b30" />
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <TextInput
              label="Service Name"
              value={name}
              onChangeText={setName}
              placeholder="Enter service name"
              error={errors.name}
            />

            <TextInput
              label="Description"
              value={description}
              onChangeText={setDescription}
              placeholder="Enter service description"
              multiline
              numberOfLines={4}
              error={errors.description}
            />

            <TextInput
              label="Price ($)"
              value={price}
              onChangeText={setPrice}
              placeholder="Enter price"
              keyboardType="numeric"
              error={errors.price}
            />

            <TextInput
              label="Duration (minutes)"
              value={duration}
              onChangeText={setDuration}
              placeholder="Enter duration in minutes"
              keyboardType="numeric"
              error={errors.duration}
            />

            <TextInput
              label="Category"
              value={category}
              onChangeText={setCategory}
              placeholder="Enter service category"
              error={errors.category}
            />

            <Button
              title={isSaving ? "Saving..." : "Update Service"}
              onPress={handleUpdateService}
              disabled={isSaving}
              style={styles.submitButton}
            >
              {isSaving && <ActivityIndicator color="#fff" style={styles.loader} />}
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  keyboardAvoid: {
    flex: 1,
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
  deleteButton: {
    padding: 8,
  },
  form: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  submitButton: {
    marginTop: 24,
  },
  loader: {
    marginLeft: 10,
  },
})
