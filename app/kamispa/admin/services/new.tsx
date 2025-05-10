"use client"

import { Button } from "@/components/kamispa/button"
import { TextInput } from "@/components/kamispa/text-input"
import { createService } from "@/services/kamispa/service-service"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { useState } from "react"
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

export default function NewServiceScreen() {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [duration, setDuration] = useState("")
  const [category, setCategory] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const router = useRouter()

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

  const handleCreateService = async () => {
    if (!validateForm()) return

    setIsLoading(true)

    try {
      await createService({
        name,
        description,
        price: Number(price),
        duration: Number(duration),
        category,
      })

      Alert.alert("Success", "Service created successfully", [{ text: "OK", onPress: () => router.back() }])
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to create service")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SafeAreaView  style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoid}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Add New Service</Text>
            <View style={styles.placeholder} />
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
              title={isLoading ? "Creating..." : "Create Service"}
              onPress={handleCreateService}
              disabled={isLoading}
              style={styles.submitButton}
            >
              {isLoading && <ActivityIndicator color="#fff" style={styles.loader} />}
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
  placeholder: {
    width: 40,
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
