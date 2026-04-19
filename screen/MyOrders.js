import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { db } from "../firebase/config";
import { collection, onSnapshot } from "firebase/firestore";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "orders"), (snapshot) => {
      setOrders(
        snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        }))
      );
    });

    return () => unsubscribe();
  }, []);

  const getStatusColor = (status) => {
    if (status === "pending") return "orange";
    if (status === "accepted") return "blue";
    if (status === "delivered") return "green";
    return "gray";
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#f4f6f8" }}>

      <Text style={{ fontSize: 24, marginBottom: 20 }}>
        📜 My Orders
      </Text>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{
            padding: 15,
            borderRadius: 12,
            backgroundColor: "white",
            marginBottom: 10,
            elevation: 3
          }}>
            <Text>📍 {item.pickup} → {item.drop}</Text>
            <Text>📦 {item.item}</Text>
            <Text>📏 {item.distance} KM</Text>
            <Text>💰 ₹{item.price}</Text>

            <Text style={{
              marginTop: 5,
              color: getStatusColor(item.status),
              fontWeight: "bold"
            }}>
              Status: {item.status}
            </Text>

          </View>
        )}
      />

    </View>
  );
}
