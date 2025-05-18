"use client";

import { useCart } from "@/contexts/cart-context";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Dish {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
}

export default function CuisineDetail() {
  const { id, name } = useLocalSearchParams();
  const { addToCart, totalItems, loading: cartLoading } = useCart();
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        // In a real app, you would fetch this data from Firebase
        // For now, we'll use mock data
        setTimeout(() => {
          const mockDishes: Dish[] = [
            {
              id: "1",
              name: "Dish 1",
              price: 12.99,
              description: "Delicious dish from this cuisine category",
              image:
                "https://lavenderstudio.com.vn/wp-content/uploads/2017/03/studio-chup-anh-thuc-an-dep.jpg",
            },
            {
              id: "2",
              name: "Dish 2",
              price: 9.99,
              description: "Another tasty option from this cuisine",
              image:
                "https://lavenderstudio.com.vn/wp-content/uploads/2017/03/studio-chup-anh-thuc-an-dep.jpg",
            },
            {
              id: "3",
              name: "Dish 3",
              price: 14.99,
              description: "Premium dish with special ingredients",
              image:
                "https://lavenderstudio.com.vn/wp-content/uploads/2017/03/studio-chup-anh-thuc-an-dep.jpg",
            },
          ];

          setDishes(mockDishes);
          setLoading(false);
        }, 1000);

        // Uncomment this to fetch from Firebase when you have data
        /*
        const dishesQuery = query(
          collection(db, 'dishes'),
          where('cuisineId', '==', id)
        );
        
        const dishesSnapshot = await getDocs(dishesQuery);
        const dishesList = dishesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Dish[];
        
        setDishes(dishesList);
        setLoading(false);
        */
      } catch (error) {
        console.error("Error fetching dishes:", error);
        setLoading(false);
      }
    };

    fetchDishes();
  }, [id]);

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E74C3C" />
        </View>
      ) : (
        <FlatList
          data={dishes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.dishCard}>
              <Image
                source={{
                  uri: "https://lavenderstudio.com.vn/wp-content/uploads/2017/03/studio-chup-anh-thuc-an-dep.jpg",
                }}
                style={styles.dishImage}
              />
              <View style={styles.dishInfo}>
                <Text style={styles.dishName}>{item.name}</Text>
                <Text style={styles.dishDescription}>{item.description}</Text>
                <Text style={styles.dishPrice}>${item.price.toFixed(2)}</Text>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => {
                    addToCart({
                      id: item.id + " - " + id,
                      name: item.name,
                      price: item.price,
                      restaurantId: id as any,
                      restaurantName: "??",
                      category: id as any,
                      image: item.image,
                      notes: item.description,
                    });
                  }}
                >
                  <Text style={styles.addButtonText}>Add to Cart</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
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
  listContent: {
    padding: 16,
  },
  dishCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dishImage: {
    width: 100,
    height: 100,
  },
  dishInfo: {
    flex: 1,
    padding: 12,
  },
  dishName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  dishDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  dishPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#E74C3C",
    marginBottom: 8,
  },
  addButton: {
    backgroundColor: "#E74C3C",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
});
