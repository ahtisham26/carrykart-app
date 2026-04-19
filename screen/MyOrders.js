import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { db } from "../firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function MyOrders({ user }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const q = query(
      collection(db, "orders"),
      where("userId", "==", user.uid)
    );

    const snap = await getDocs(q);
    setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20 }}>My Orders</Text>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderWidth: 1, marginTop: 10 }}>
            <Text>Pickup: {item.pickupAddress}</Text>
            <Text>Drop: {item.dropAddress}</Text>
            <Text>Status: {item.status}</Text>
          </View>
        )}
      />
    </View>
  );
}
