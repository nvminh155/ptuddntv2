import { Ionicons } from "@expo/vector-icons";
import { router, Slot, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useAuth } from "@/contexts/auth-context";
import firestore from "@react-native-firebase/firestore";
import { DrawerActions } from "@react-navigation/native";

const CuisineLayout = () => {
  const { signOut } = useAuth();
  const navigation = useNavigation();

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

  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {
          navigation.dispatch(DrawerActions.openDrawer())
        }}>
          <Ionicons name="menu-outline" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Restaurant App</Text>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => {
              router.push("/cart");
            }}
          >
            <Ionicons name="cart" size={22} color="#333" />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cartCount}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={async () => {
              signOut();
            }}
          >
            <Ionicons name="log-out" size={22} color="#333" />
          </TouchableOpacity>
        </View>
      </View>
      <Slot />
    </>
  );
};

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

export default CuisineLayout;
