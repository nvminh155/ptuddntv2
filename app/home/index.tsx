import { useAuth } from "@/contexts/auth-context";
import { router } from "expo-router";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Home() {
  const { user } = useAuth();

  const navigateToRestaurant = () => {
    router.push("/(drawer-cuisine)/cuisine");
  };

  const navigateToProfile = () => {
    router.push("/profile");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.welcomeText}>
          Welcome, {user?.displayName || "User"}!
        </Text>

        <Text style={styles.subtitle}>
          Explore restaurants and order your favorite food
        </Text>

        <TouchableOpacity style={styles.button} onPress={navigateToRestaurant}>
          <Text style={styles.buttonText}>Explore Restaurants</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.profileButton]}
          onPress={navigateToProfile}
        >
          <Text style={styles.profileButtonText}>View Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#E74C3C",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginBottom: 16,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  profileButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E74C3C",
  },
  profileButtonText: {
    color: "#E74C3C",
    fontSize: 16,
    fontWeight: "bold",
  },
});
