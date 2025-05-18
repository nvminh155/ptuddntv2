import type { Cuisine, Dish, Order } from "@/types"
import auth from "@react-native-firebase/auth"
import firestore from "@react-native-firebase/firestore"

// Authentication services
export const registerUser = async (email: string, password: string) => {
  try {
    const userCredential = await auth().createUserWithEmailAndPassword(email, password)
    return userCredential.user
  } catch (error) {
    throw error
  }
}

export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await auth().signInWithEmailAndPassword(email, password)
    return userCredential.user
  } catch (error) {
    throw error
  }
}

export const logoutUser = async () => {
  try {
    await auth().signOut()
  } catch (error) {
    throw error
  }
}

// Firestore services
export const getCuisines = async (): Promise<Cuisine[]> => {
  try {
    const cuisinesSnapshot = await firestore().collection("cuisines").get()
    return cuisinesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Cuisine[]
  } catch (error) {
    throw error
  }
}

export const getDishesForCuisine = async (cuisineId: string): Promise<Dish[]> => {
  try {
    const dishesSnapshot = await firestore().collection("dishes").where("cuisineId", "==", cuisineId).get()

    return dishesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Dish[]
  } catch (error) {
    throw error
  }
}

export const createOrder = async (order: Omit<Order, "id">): Promise<string> => {
  try {
    const orderRef = await firestore().collection("orders").add(order)
    return orderRef.id
  } catch (error) {
    throw error
  }
}

export const getUserOrders = async (userId: string): Promise<Order[]> => {
  try {
    const ordersSnapshot = await firestore().collection("orders").where("userId", "==", userId).get()

    return ordersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Order[]
  } catch (error) {
    throw error
  }
}

// Real-time listeners
export const subscribeToCuisines = (onUpdate: (cuisines: Cuisine[]) => void) => {
  return firestore()
    .collection("cuisines")
    .onSnapshot((snapshot) => {
      const cuisines = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Cuisine[]
      onUpdate(cuisines)
    })
}

export const subscribeToDishes = (cuisineId: string, onUpdate: (dishes: Dish[]) => void) => {
  return firestore()
    .collection("dishes")
    .where("cuisineId", "==", cuisineId)
    .onSnapshot((snapshot) => {
      const dishes = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Dish[]
      onUpdate(dishes)
    })
}

export const subscribeToOrders = (userId: string, onUpdate: (orders: Order[]) => void) => {
  return firestore()
    .collection("orders")
    .where("userId", "==", userId)
    .onSnapshot((snapshot) => {
      const orders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Order[]
      onUpdate(orders)
    })
}
