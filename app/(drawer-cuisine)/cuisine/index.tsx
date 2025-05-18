import { Cuisine } from "@/types";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useAuth } from "@/contexts/auth-context";
import firestore from "@react-native-firebase/firestore";

const mockCuisines: Cuisine[] = [
  { id: '1', name: 'Chinese', image: 'chinese.png' },
  { id: '2', name: 'South Indian', image: 'south-indian.png' },
  { id: '3', name: 'Beverages', image: 'beverages.png' },
  { id: '4', name: 'North India', image: 'north-indian.png' },
  { id: '5', name: 'Fast Food', image: 'desserts.png' },
  { id: '6', name: 'Rice', image: 'biryani.png' },
];



export default function Home() {
  const { signOut } = useAuth();
  const [cuisines, setCuisines] = useState<Cuisine[]>([]);
  const [loading, setLoading] = useState(true);

  const [cartCount, setCartCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const unsubscribe = firestore()
      .collection("users")
      .doc(user.uid)
      .onSnapshot((doc) => {
        const cart = doc.data()?.cart || [];
        setCartCount(cart.length);
      });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    const fetchCuisines = async () => {
      try {
        setLoading(true);

        // In a real app, you would fetch this data from Firebase
        // For now, we'll use mock data that matches the image
        const mockCuisines: Cuisine[] = [
          {
            id: "1",
            name: "Chinese",
            image: require("@/assets/images/chinese.png"),
          },
          {
            id: "2",
            name: "South Indian",
            image: require("@/assets/images/south-indian.png"),
          },
          {
            id: "3",
            name: "Beverages",
            image: require("@/assets/images/beverages.png"),
          },
          {
            id: "4",
            name: "North India",
            image: require("@/assets/images/north-indian.png"),
          },
          {
            id: "5",
            name: "Fast Food",
            image: require("@/assets/images/desserts.png"),
          },
          {
            id: "6",
            name: "Rice",
            image: require("@/assets/images/biryani.png"),
          },
        ];
        
        setCuisines(mockCuisines);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cuisines:", error);
        setLoading(false);
      }
    };

    fetchCuisines();
  }, []);





  const handleCuisinePress = (cuisine: Cuisine) => {
    // Navigate to the cuisine detail page
    router.push({
      pathname: "/cuisine/[id]",
      params: { id: cuisine.id, name: cuisine.name },
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E74C3C" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Cuisine Title */}
      <Text style={styles.cuisineTitle}>Cuisine</Text>

      {/* Cuisine Grid */}
      <ScrollView style={styles.scrollView}>
        <View style={styles.cuisineGrid}>
          {cuisines.map((cuisine) => (
            <TouchableOpacity
              key={cuisine.id}
              style={styles.cuisineCard}
              onPress={() => handleCuisinePress(cuisine)}
            >
              <Image
                source={cuisine.image as any}
                style={styles.cuisineImage}
              />
              <Text style={styles.cuisineName}>{cuisine.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#E74C3C",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    marginLeft: 15,
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#E74C3C",
    borderRadius: 10,
    width: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  cuisineTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#E74C3C",
    marginTop: 20,
    marginLeft: 16,
    marginBottom: 15,
  },
  scrollView: {
    flex: 1,
  },
  cuisineGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  cuisineCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cuisineImage: {
    width: 80,
    height: 80,
    marginBottom: 10,
    resizeMode: "contain",
  },
  cuisineName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#E74C3C",
  },
});
