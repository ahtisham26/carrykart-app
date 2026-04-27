import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { db, auth } from "../firebase/config";
import { collection, query, where, onSnapshot } from "firebase/firestore";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "orders"),
      where("userEmail", "==", auth.currentUser.email)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(list);
    });

    return unsubscribe;
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={{ marginBottom: 10 }}>
            {item.item} - {item.status}
          </Text>
        )}
      />
    </View>
  );
}
