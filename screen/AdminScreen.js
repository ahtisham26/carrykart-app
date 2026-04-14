import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { db } from "../firebase/config";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

export default function AdminScreen() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const data = await getDocs(collection(db, "orders"));
    setOrders(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, newStatus) => {
    const orderRef = doc(db, "orders", id);
    await updateDoc(orderRef, { status: newStatus });
    fetchOrders();
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>

      <Text style={{ fontSize: 24, marginBottom: 20 }}>
        🛠 Admin Dashboard
      </Text>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{
            padding: 15,
            backgroundColor: "white",
            marginBottom: 10,
            borderRadius: 10
          }}>
            <Text>📍 {item.pickup} → {item.drop}</Text>
            <Text>📦 {item.item}</Text>
            <Text>💰 ₹{item.price}</Text>
            <Text>Status: {item.status}</Text>

            <TouchableOpacity
              onPress={() => updateStatus(item.id, "accepted")}
              style={{ backgroundColor: "blue", padding: 8, marginTop: 5 }}
            >
              <Text style={{ color: "white" }}>Accept</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => updateStatus(item.id, "delivered")}
              style={{ backgroundColor: "green", padding: 8, marginTop: 5 }}
            >
              <Text style={{ color: "white" }}>Mark Delivered</Text>
            </TouchableOpacity>

          </View>
        )}
      />

    </View>
  );
}
