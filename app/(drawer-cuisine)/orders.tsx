import { Order } from "@/types";
import firestore from "@react-native-firebase/firestore";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  console.log(orders)
  useEffect(() => {
    // Replace with Firestore fetch using react-native-firebase
    const fetchOrders = async () => {
      try {
        const snapshot = await firestore().collection("orders").get();
        const orders: Order[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Order[];
        setOrders(orders);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        setOrders([]); // fallback or handle error as needed
      }
    };

    fetchOrders();
  }, []);

  return (
    <ScrollView style={{ maxWidth: 600, alignSelf: "center", padding: 24,  }} contentContainerStyle={{
      paddingBottom: 60
    }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>Order History</Text>
      {orders.length === 0 ? (
        <Text>No orders found.</Text>
      ) : (
        <View>
          {orders.map((order) => (
            <View
              key={order.id}
              style={{
                borderWidth: 1,
                borderColor: "#ddd",
                borderRadius: 8,
                marginBottom: 16,
                padding: 16,
                backgroundColor: "#fff",
              }}
            >
              <Text style={{ fontWeight: "bold", marginBottom: 4 }}>
                Order #{order.id}
              </Text>
              <Text style={{ marginBottom: 4 }}>
                Status:{" "}
                <Text style={{ textTransform: "capitalize" }}>
                  {order.status}
                </Text>
              </Text>
              <View style={{ marginBottom: 4 }}>
                {order.items.map((item, idx) => (
                  <Text key={idx}>
                    {item.name} x{item.quantity}
                  </Text>
                ))}
              </View>
              <Text>
                <Text style={{ fontWeight: "bold" }}>Total:</Text> ${order.totalAmount}
              </Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default OrderHistory;
