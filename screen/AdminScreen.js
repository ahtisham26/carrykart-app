import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { db } from "../firebase/config";
import { collection, onSnapshot } from "firebase/firestore";

export default function AdminScreen() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "orders"), (snap) => {
      setOrders(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsub;
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#0f172a", padding: 20 }}>
      <Text style={{ fontSize: 22, color: "white", marginBottom: 10 }}>
        Admin Dashboard
      </Text>

      <FlatList
        data={orders}
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: "#1e293b",
              padding: 15,
              borderRadius: 12,
              marginBottom: 10,
            }}
          >
            <Text style={{ color: "white" }}>{item.name}</Text>
            <Text style={{ color: "#94a3b8" }}>{item.phone}</Text>
            <Text style={{ color: "#94a3b8" }}>
              {item.pickupAddress} → {item.dropAddress}
            </Text>
          </View>
        )}
      />
    </View>
  );
}
