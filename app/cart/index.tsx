"use client"

import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import { Ionicons } from "@expo/vector-icons"
import firestore from "@react-native-firebase/firestore"
import { Stack, router } from "expo-router"
import { useState } from "react"
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"

export default function Cart() {
  const { items, totalItems, totalPrice, removeFromCart, updateQuantity, clearCart, loading: cartLoading } = useCart()
  const { user } = useAuth()
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [processingItemId, setProcessingItemId] = useState<string | null>(null)

  const handleBack = () => {
    router.back()
  }

  const handleCheckout = async () => {
    if (!user) {
      Alert.alert("Error", "You must be logged in to checkout")
      return
    }

    if (items.length === 0) {
      Alert.alert("Error", "Your cart is empty")
      return
    }

    setCheckoutLoading(true)
    try {
      // Create a new order in Firestore
      const orderRef = await firestore().collection("orders").add({
        userId: user.uid,
        items: items,
        totalAmount: totalPrice,
        status: "pending",
        createdAt: firestore.FieldValue.serverTimestamp(),
      })

      // Clear the cart after successful order
      await clearCart()

      // Navigate to order confirmation
      router.push({
        pathname: "/order-confirmation",
        params: { orderId: orderRef.id },
      })
    } catch (error) {
      console.error("Error creating order:", error)
      Alert.alert("Error", "Failed to place order. Please try again.")
    } finally {
      setCheckoutLoading(false)
    }
  }

  const handleIncreaseQuantity = async (itemId: string, currentQuantity: number) => {
    setProcessingItemId(itemId)
    try {
      await updateQuantity(itemId, currentQuantity + 1)
    } finally {
      setProcessingItemId(null)
    }
  }

  const handleDecreaseQuantity = async (itemId: string, currentQuantity: number) => {
    setProcessingItemId(itemId)
    try {
      if (currentQuantity > 1) {
        await updateQuantity(itemId, currentQuantity - 1)
      } else {
        // Confirm before removing the item
        Alert.alert("Remove Item", "Are you sure you want to remove this item from your cart?", [
          { text: "Cancel", style: "cancel", onPress: () => setProcessingItemId(null) },
          { 
            text: "Remove", 
            style: "destructive", 
            onPress: async () => {
              await removeFromCart(itemId)
              setProcessingItemId(null)
            } 
          },
        ])
      }
    } catch (error) {
      setProcessingItemId(null)
    }
  }

  const handleRemoveItem = async (itemId: string) => {
    Alert.alert("Remove Item", "Are you sure you want to remove this item from your cart?", [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Remove", 
        style: "destructive", 
        onPress: async () => {
          setProcessingItemId(itemId)
          try {
            await removeFromCart(itemId)
          } finally {
            setProcessingItemId(null)
          }
        } 
      },
    ])
  }

  const renderEmptyCart = () => (
    <View style={styles.emptyCartContainer}>
      <Ionicons name="cart-outline" size={80} color="#ccc" />
      <Text style={styles.emptyCartText}>Your cart is empty</Text>
      <TouchableOpacity style={styles.browseButton} onPress={() => router.push("/home")}>
        <Text style={styles.browseButtonText}>Browse Restaurants</Text>
      </TouchableOpacity>
    </View>
  )

  if (cartLoading && items.length === 0) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" />
        <Stack.Screen
          options={{
            title: "My Cart",
            headerLeft: () => (
              <TouchableOpacity onPress={handleBack} style={{ marginLeft: 16 }}>
                <Ionicons name="arrow-back" size={24} color="#E74C3C" />
              </TouchableOpacity>
            ),
          }}
        />
        <ActivityIndicator size="large" color="#E74C3C" />
        <Text style={styles.loadingText}>Loading your cart...</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Stack.Screen
        options={{
          title: "My Cart",
          headerLeft: () => (
            <TouchableOpacity onPress={handleBack} style={{ marginLeft: 16 }}>
              <Ionicons name="arrow-back" size={24} color="#E74C3C" />
            </TouchableOpacity>
          ),
        }}
      />

      {items.length === 0 ? (
        renderEmptyCart()
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.cartItem}>
                <View style={styles.itemImageContainer}>
                  <Image source={require("@/assets/images/placeholder-food.png")} style={styles.itemImage} />
                </View>
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>₹{item.price}</Text>
                </View>
                <View style={styles.quantityContainer}>
                  {processingItemId === item.id ? (
                    <ActivityIndicator size="small" color="#E74C3C" style={{ marginRight: 10 }} />
                  ) : (
                    <>
                      <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => handleDecreaseQuantity(item.id, item.quantity)}
                        disabled={cartLoading || processingItemId !== null}
                      >
                        <Ionicons name="remove" size={16} color="#E74C3C" />
                      </TouchableOpacity>
                      <Text style={styles.quantityText}>{item.quantity}</Text>
                      <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => handleIncreaseQuantity(item.id, item.quantity)}
                        disabled={cartLoading || processingItemId !== null}
                      >
                        <Ionicons name="add" size={16} color="#E74C3C" />
                      </TouchableOpacity>
                    </>
                  )}
                </View>
                <TouchableOpacity 
                  style={styles.removeButton} 
                  onPress={() => handleRemoveItem(item.id)}
                  disabled={cartLoading || processingItemId !== null}
                >
                  <Ionicons name="trash-outline" size={20} color="#E74C3C" />
                </TouchableOpacity>
              </View>
            )}
            contentContainerStyle={styles.cartList}
            style={{
              flex: 1,

            }}
/>

          <View style={styles.cartSummary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal ({totalItems} items)</Text>
              <Text style={styles.summaryValue}>₹{totalPrice.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>
              <Text style={styles.summaryValue}>₹40.00</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax</Text>
              <Text style={styles.summaryValue}>₹{(totalPrice * 0.05).toFixed(2)}</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>₹{(totalPrice + 40 + totalPrice * 0.05).toFixed(2)}</Text>
            </View>

            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={handleCheckout}
              disabled={checkoutLoading || cartLoading || items.length === 0 || processingItemId !== null}
            >
              {checkoutLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
              )}
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    maxHeight: 640

  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  cartList: {
    padding: 16,
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  itemImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#3b5998",
  },
  itemImage: {
    width: 50,
    height: 50,
    tintColor: "#3b5998",
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemRestaurant: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#E74C3C",
    marginTop: 4,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
    minWidth: 80,
    justifyContent: "center",
  },
  quantityButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  quantityText: {
    fontSize: 14,
    fontWeight: "bold",
    marginHorizontal: 8,
  },
  removeButton: {
    padding: 5,
  },
  cartSummary: {
    backgroundColor: "#fff",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#666",
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "500",
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#E74C3C",
  },
  checkoutButton: {
    backgroundColor: "#E74C3C",
    borderRadius: 25,
    padding: 15,
    alignItems: "center",
    marginTop: 16,
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyCartText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: "#E74C3C",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  browseButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
})
