import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { db, auth } from "../firebase/config";
import { collection, query, where, onSnapshot } from "firebase/firestore";

export default function OrdersScreen() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "orders"),
      where("userEmail", "==", auth.currentUser.email)
    );

    const unsub = onSnapshot(q, snap => {
      setOrders(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return unsub;
  }, []);

  return (
    <FlatList
      style={{ padding: 15 }}
      data={orders}
      keyExtractor={(i) => i.id}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.text}>Distance: {item.distance} km</Text>
          <Text style={styles.price}>₹{item.price}</Text>
          <Text style={styles.status}>{item.status}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    elevation: 4,
  },

  text: { fontSize: 16 },
  price: { fontWeight: "bold", marginTop: 5 },

  status: {
    marginTop: 5,
    color: "green",
    fontWeight: "bold",
  },
});
