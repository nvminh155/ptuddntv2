"use client"

import { useAuth } from "@/contexts/auth-context"
import { Ionicons } from "@expo/vector-icons"
import { Stack, router } from "expo-router"
import { useState } from "react"
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"

export default function SignIn() {
  const { signIn, loading, resetPassword } = useAuth()
  const [email, setEmail] = useState("minhns123@gmail.com")
  const [password, setPassword] = useState("")

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields")
      return
    }

    try {
      await signIn(email, password)
      // On successful login, the user will be redirected in index.tsx
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to sign in")
    }
  }

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address")
      return
    }

    try {
      await resetPassword(email)
      Alert.alert("Success", "Password reset email sent")
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to send reset email")
    }
  }

  const navigateToSignUp = () => {
    router.push("/sign-up")
  }

  const goBack = () => {
    router.back()
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoidingView}>
        <View style={styles.header}>
          <TouchableOpacity onPress={goBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.appTitle}>Restaurant App</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#999"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#999"
          />

          <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPasswordContainer}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.signInButton]} onPress={handleSignIn} disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color="#666" />
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.signUpButton]} onPress={navigateToSignUp} disabled={loading}>
            <Text style={[styles.buttonText, styles.signUpButtonText]}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    padding: 5,
  },
  appTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#E74C3C",
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  input: {
    backgroundColor: "#EEEEEE",
    borderRadius: 8,
    padding: 15,
    marginBottom: 16,
    fontSize: 16,
    color: "#333",
  },
  forgotPasswordContainer: {
    alignSelf: "flex-start",
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: "#D4AF37", // Gold color
    fontSize: 14,
  },
  button: {
    borderRadius: 25,
    padding: 15,
    alignItems: "center",
    marginBottom: 16,
  },
  signInButton: {
    backgroundColor: "#DDDDDD",
  },
  signUpButton: {
    backgroundColor: "#4A5CDB", // Blue/purple color
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000000",
  },
  signUpButtonText: {
    color: "#FFFFFF",
  },
})
