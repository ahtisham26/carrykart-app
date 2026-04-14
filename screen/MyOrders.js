import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { db } from "../firebase/config";
import { collection, getDocs } from "firebase/firestore";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const data = await getDocs(collection(db, "orders"));
      setOrders(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    };

    fetchOrders();
  }, []);

  return (
    <View style={{ flex: 1, padding: 20 }}>

      <Text style={{ fontSize: 24, marginBottom: 20 }}>
        📜 My Orders
      </Text>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderWidth: 1, marginBottom: 10 }}>
            <Text>Pickup: {item.pickup}</Text>
            <Text>Drop: {item.drop}</Text>
            <Text>Item: {item.item}</Text>
            <Text>Status: {item.status}</Text>
          </View>
        )}
      />

    </View>
  );
}
