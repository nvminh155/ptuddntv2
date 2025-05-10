"use client"

import { Button } from "@/components/kamispa/button"
import { Card } from "@/components/kamispa/card"
import { TextInput } from "@/components/kamispa/text-input"
import { useAuth } from "@/contexts/kamispa/auth-context"
import { changePassword, updateProfile } from "@/services/kamispa/auth-service"
import { Ionicons } from "@expo/vector-icons"
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

export default function ProfileScreen() {
  const { user, signOut, refreshUserData } = useAuth()

  const [activeTab, setActiveTab] = useState("profile")

  // Profile update state
  const [name, setName] = useState(user?.displayName || "")
  const [email, setEmail] = useState(user?.email || "")
  const [phone, setPhone] = useState(user?.phone || "")
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const handleUpdateProfile = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Name is required")
      return
    }

    setIsUpdatingProfile(true)

    try {
      await updateProfile({
        displayName: name,
        phone,
      })

      await refreshUserData()
      Alert.alert("Success", "Profile updated successfully")
    } catch (err: any) {
      Alert.alert("Error", "Failed to update profile. Please! Check your form")
    } finally {
      setIsUpdatingProfile(false)
    }
  }

  const handleChangePassword = async () => {
    if (!currentPassword) {
      Alert.alert("Error", "Current password is required")
      return
    }

    if (!newPassword) {
      Alert.alert("Error", "New password is required")
      return
    }

    if (newPassword.length < 6) {
      Alert.alert("Error", "New password must be at least 6 characters")
      return
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match")
      return
    }

    setIsChangingPassword(true)

    try {
      await changePassword(currentPassword, newPassword)

      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")

      Alert.alert("Success", "Password changed successfully")
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to change password")
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: signOut },
    ])
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoid}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <View style={styles.profileAvatar}>
              <Text style={styles.avatarText}>
                {user?.displayName
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase() || "U"}
              </Text>
            </View>
            <Text style={styles.profileName}>{user?.displayName || "User"}</Text>
            <Text style={styles.profileRole}>{user?.role === "admin" ? "Administrator" : "Customer"}</Text>
          </View>

          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, activeTab === "profile" && styles.activeTab]}
              onPress={() => setActiveTab("profile")}
            >
              <Text style={[styles.tabText, activeTab === "profile" && styles.activeTabText]}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === "password" && styles.activeTab]}
              onPress={() => setActiveTab("password")}
            >
              <Text style={[styles.tabText, activeTab === "password" && styles.activeTabText]}>Password</Text>
            </TouchableOpacity>
          </View>

          {activeTab === "profile" ? (
            <Card style={styles.card}>
              <TextInput label="Name" value={name} onChangeText={setName} placeholder="Enter your name" />
              <TextInput label="Email" value={email} editable={false} style={styles.disabledInput} />
              <TextInput
                label="Phone"
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
              />
              <Button
                title={isUpdatingProfile ? "Updating..." : "Update Profile"}
                onPress={handleUpdateProfile}
                disabled={isUpdatingProfile}
                style={styles.button}
              >
                {isUpdatingProfile && <ActivityIndicator color="#fff" style={styles.loader} />}
              </Button>
            </Card>
          ) : (
            <Card style={styles.card}>
              <View style={styles.passwordContainer}>
                <TextInput
                  label="Current Password"
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  placeholder="Enter current password"
                  secureTextEntry={!showCurrentPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
                  <Ionicons name={showCurrentPassword ? "eye-off" : "eye"} size={24} color="#666" />
                </TouchableOpacity>
              </View>

              <View style={styles.passwordContainer}>
                <TextInput
                  label="New Password"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Enter new password"
                  secureTextEntry={!showNewPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowNewPassword(!showNewPassword)}>
                  <Ionicons name={showNewPassword ? "eye-off" : "eye"} size={24} color="#666" />
                </TouchableOpacity>
              </View>

              <View style={styles.passwordContainer}>
                <TextInput
                  label="Confirm New Password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm new password"
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Ionicons name={showConfirmPassword ? "eye-off" : "eye"} size={24} color="#666" />
                </TouchableOpacity>
              </View>

              <Button
                title={isChangingPassword ? "Changing..." : "Change Password"}
                onPress={handleChangePassword}
                disabled={isChangingPassword}
                style={styles.button}
              >
                {isChangingPassword && <ActivityIndicator color="#fff" style={styles.loader} />}
              </Button>
            </Card>
          )}

          <Button title="Sign Out" onPress={handleSignOut} variant="outline" style={styles.signOutButton} />
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
    alignItems: "center",
    marginBottom: 24,
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarText: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "bold",
    fontFamily: "Inter-Bold",
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
    fontFamily: "Inter-Bold",
  },
  profileRole: {
    fontSize: 16,
    color: "#666",
    fontFamily: "Inter-Regular",
  },
  tabs: {
    flexDirection: "row",
    marginBottom: 24,
    borderRadius: 8,
    backgroundColor: "#e1e1e1",
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: "#fff",
  },
  tabText: {
    fontSize: 16,
    color: "#666",
    fontFamily: "Inter-Medium",
  },
  activeTabText: {
    color: "#007AFF",
    fontWeight: "bold",
  },
  card: {
    marginBottom: 24,
    padding: 16,
  },
  disabledInput: {
    backgroundColor: "#f0f0f0",
  },
  button: {
    marginTop: 16,
  },
  loader: {
    marginLeft: 10,
  },
  passwordContainer: {
    position: "relative",
  },
  eyeIcon: {
    position: "absolute",
    right: 15,
    top: 38,
  },
  signOutButton: {
    marginBottom: 24,
  },
})
