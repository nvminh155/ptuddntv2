"use client"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import { Ionicons } from "@expo/vector-icons"
import { Stack, router, useLocalSearchParams } from "expo-router"
import { useState } from "react"
import { ActivityIndicator, Image, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native"

interface MenuItem {
  id: string
  name: string
  category: string
  price: number
  currency: string
  image: any
  description?: string
}

export default function RestaurantMenu() {
  const { id } = useLocalSearchParams()
  const { addToCart, totalItems, loading: cartLoading } = useCart()
  const { user } = useAuth()
  const [addingItemId, setAddingItemId] = useState<string | null>(null)

  // Mock data for the restaurant
  const restaurant = {
    id: id as string,
    name: "KFC",
    location: "Block 12",
    image: '',
  }

  // Mock data for menu items
  const menuItems: MenuItem[] = [
    {
      id: "1",
      name: "Noodles",
      category: "chinese",
      price: 100,
      currency: "₹",
      image: '',
      description: "Delicious noodles with vegetables and sauce",
    },
    {
      id: "2",
      name: "Fried Chicken",
      category: "american",
      price: 150,
      currency: "₹",
      image: '',
      description: "Crispy fried chicken with special spices",
    },
    {
      id: "3",
      name: "Burger",
      category: "fast food",
      price: 120,
      currency: "₹",
      image: '',
      description: "Juicy burger with cheese and fresh vegetables",
    },
  ]

  const handleAddToCart = async (item: MenuItem) => {
    if (!user) {
      router.push("/sign-in")
      return
    }
    
    setAddingItemId(item.id)
    try {
      await addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        category: item.category,
        image: item.image,
      })
    } finally {
      setAddingItemId(null)
    }
  }

  const handleBack = () => {
    router.back()
  }

  const navigateToCart = () => {
    if (!user) {
      router.push("/sign-in")
      return
    }
    router.push("/cart")
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{restaurant.name}</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton} onPress={navigateToCart} disabled={cartLoading}>
            {totalItems > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{totalItems}</Text>
              </View>
            )}
            <Ionicons name="cart-outline" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="ellipsis-horizontal" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Restaurant Banner */}
      <View style={styles.banner}>
        <Image source={restaurant.image as any} style={styles.bannerImage} resizeMode="cover" />
      </View>

      {/* Restaurant Info */}
      <View style={styles.restaurantInfo}>
        <Text style={styles.restaurantName}>{restaurant.name}</Text>
        <Text style={styles.restaurantLocation}>{restaurant.location}</Text>
      </View>

      {/* Menu Title */}
      <View style={styles.menuTitleContainer}>
        <Text style={styles.menuTitle}>Menu</Text>
      </View>

      {/* Menu Items */}
      <ScrollView style={styles.menuContainer}>
        {menuItems.map((item) => (
          <View key={item.id} style={styles.menuItem}>
            <View style={styles.menuItemImageContainer}>
              <Image source={item.image} style={styles.menuItemImage} />
            </View>
            <View style={styles.menuItemDetails}>
              <Text style={styles.menuItemName}>{item.name}</Text>
              <Text style={styles.menuItemCategory}>{item.category}</Text>
              {item.description && (
                <Text style={styles.menuItemDescription} numberOfLines={2}>
                  {item.description}
                </Text>
              )}
            </View>
            <View style={styles.menuItemPrice}>
              <Text style={styles.priceText}>
                {item.currency} {item.price}
              </Text>
              <TouchableOpacity 
                style={styles.addButton} 
                onPress={() => handleAddToCart(item)}
                disabled={addingItemId === item.id || cartLoading}
              >
                {addingItemId === item.id ? (
                  <ActivityIndicator size="small" color="#2196F3" />
                ) : (
                  <Text style={styles.addButtonText}>ADD TO CART</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "#fff",
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    marginLeft: 15,
    position: "relative",
  },
  cartBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#E74C3C",
    borderRadius: 10,
    width: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  cartBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  banner: {
    width: "100%",
    height: 120,
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },
  restaurantInfo: {
    padding: 16,
    backgroundColor: "#fff",
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#B22222", // Dark red color for KFC
  },
  restaurantLocation: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  menuTitleContainer: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#B22222", // Dark red color for KFC
  },
  menuContainer: {
    flex: 1,
  },
  menuItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 8,
    borderRadius: 4,
  },
  menuItemImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#3b5998", // Facebook blue color for the circle
  },
  menuItemImage: {
    width: 30,
    height: 30,
    tintColor: "#3b5998", // Facebook blue color for the icon
  },
  menuItemDetails: {
    flex: 1,
    marginLeft: 16,
    justifyContent: "center",
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  menuItemCategory: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  menuItemDescription: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  menuItemPrice: {
    justifyContent: "center",
    alignItems: "flex-end",
  },
  priceText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  addButton: {
    backgroundColor: "#fff",
    paddingVertical: 6,
    paddingHorizontal: 12,
    minWidth: 90,
    alignItems: "center",
  },
  addButtonText: {
    color: "#2196F3", // Blue color for the button text
    fontWeight: "bold",
    fontSize: 12,
  },
})
