import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { db } from "../firebase/config";
import { collection, onSnapshot } from "firebase/firestore";

export default function AdminScreen() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "orders"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(data);
    });

    return unsubscribe;
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22 }}>Admin Dashboard</Text>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderWidth: 1, marginTop: 10 }}>
            <Text>Name: {item.name}</Text>
            <Text>Phone: {item.phone}</Text>
            <Text>Pickup: {item.pickupAddress}</Text>
            <Text>Drop: {item.dropAddress}</Text>
            <Text>Notes: {item.notes}</Text>
            <Text>User: {item.userEmail}</Text>
            <Text>Status: {item.status}</Text>
          </View>
        )}
      />
    </View>
  );
}
