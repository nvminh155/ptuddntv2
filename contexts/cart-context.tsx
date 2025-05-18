"use client"

import firestore from "@react-native-firebase/firestore"
import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { Alert } from "react-native"
import { useAuth } from "./auth-context"

// Define types for cart items
export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  restaurantId: string
  restaurantName: string
  category?: string
  image?: any
  notes?: string
}

// Define the shape of our cart context
interface CartContextType {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  loading: boolean
  addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => Promise<void>
  removeFromCart: (itemId: string) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
}

// Create the cart context with default values
const CartContext = createContext<CartContextType>({
  items: [],
  totalItems: 0,
  totalPrice: 0,
  loading: false,
  addToCart: async () => {},
  removeFromCart: async () => {},
  updateQuantity: async () => {},
  clearCart: async () => {},
})

// Provider component that wraps the app and makes cart object available
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const { user } = useAuth()

  // Calculate total items and price
  const totalItems = items.reduce((total, item) => total + item.quantity, 0)
  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0)

  // Load cart from Firestore when user changes
  useEffect(() => {
    const loadCart = async () => {
      if (!user) {
        setItems([])
        setLoading(false)
        return
      }

      setLoading(true)
      try {
        const userDoc = await firestore().collection("users").doc(user.uid).get()

        if (userDoc.exists()) {
          const userData = userDoc.data()
          if (userData && userData.cart) {
            setItems(userData.cart)
          } else {
            // Initialize cart if it doesn't exist
            await firestore().collection("users").doc(user.uid).update({
              cart: [],
            })
            setItems([])
          }
        } else {
          // Create user document if it doesn't exist
          await firestore().collection("users").doc(user.uid).set({
            email: user.email,
            displayName: user.displayName,
            cart: [],
            createdAt: firestore.FieldValue.serverTimestamp(),
          })
          setItems([])
        }
      } catch (error) {
        console.error("Error loading cart from Firestore:", error)
        Alert.alert("Error", "Failed to load your cart")
      } finally {
        setLoading(false)
      }
    }

    loadCart()
  }, [user])

  // Save cart to Firestore
  const saveCartToFirestore = async (updatedItems: CartItem[]) => {
    if (!user) return

    try {
      await firestore().collection("users").doc(user.uid).update({
        cart: updatedItems,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      })
    } catch (error) {
      console.error("Error saving cart to Firestore:", error)
      throw error
    }
  }

  // Add item to cart
  const addToCart = async (item: Omit<CartItem, "quantity">, quantity = 1) => {
    if (!user) {
      Alert.alert("Error", "You must be logged in to add items to your cart")
      return
    }

    setLoading(true)
    try {
      let updatedItems: CartItem[]

      // Check if the item is already in the cart
      const existingItemIndex = items.findIndex((i) => i.id === item.id)

      if (existingItemIndex !== -1) {
        // Item exists, update quantity
        updatedItems = [...items]
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity,
        }
      } else {
        // Item doesn't exist, add it
        updatedItems = [...items, { ...item, quantity }]
      }

      // Save to Firestore first
      await saveCartToFirestore(updatedItems)

      // Then update local state
      setItems(updatedItems)

      // Show success message
      Alert.alert("Success", `${item.name} added to cart`)
    } catch (error) {
      console.error("Error adding item to cart:", error)
      Alert.alert("Error", "Failed to add item to cart")
    } finally {
      setLoading(false)
    }
  }

  // Remove item from cart
  const removeFromCart = async (itemId: string) => {
    if (!user) return

    setLoading(true)
    try {
      const updatedItems = items.filter((item) => item.id !== itemId)

      // Save to Firestore first
      await saveCartToFirestore(updatedItems)

      // Then update local state
      setItems(updatedItems)
    } catch (error) {
      console.error("Error removing item from cart:", error)
      Alert.alert("Error", "Failed to remove item from cart")
    } finally {
      setLoading(false)
    }
  }

  // Update item quantity
  const updateQuantity = async (itemId: string, quantity: number) => {
    if (!user) return

    if (quantity <= 0) {
      // If quantity is 0 or negative, remove the item
      await removeFromCart(itemId)
      return
    }

    setLoading(true)
    try {
      const updatedItems = items.map((item) => (item.id === itemId ? { ...item, quantity } : item))

      // Save to Firestore first
      await saveCartToFirestore(updatedItems)

      // Then update local state
      setItems(updatedItems)
    } catch (error) {
      console.error("Error updating item quantity:", error)
      Alert.alert("Error", "Failed to update item quantity")
    } finally {
      setLoading(false)
    }
  }

  // Clear cart
  const clearCart = async () => {
    if (!user) return

    setLoading(true)
    try {
      // Save empty cart to Firestore first
      await saveCartToFirestore([])

      // Then update local state
      setItems([])
    } catch (error) {
      console.error("Error clearing cart:", error)
      Alert.alert("Error", "Failed to clear cart")
    } finally {
      setLoading(false)
    }
  }

  const value = {
    items,
    totalItems,
    totalPrice,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// Custom hook to use the cart context
export function useCart() {
  return useContext(CartContext)
}
