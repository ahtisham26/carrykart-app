import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { db, auth } from "../firebase/config";
import { collection, query, where, onSnapshot } from "firebase/firestore";

export default function OrdersScreen() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const user = auth.currentUser;

    if (!user) {
      console.log("No user logged in");
      return;
    }

    const q = query(
      collection(db, "orders"),
      where("userEmail", "==", user.email)
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const data = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(data);
      },
      (error) => {
        console.log("Firestore Error:", error);
      }
    );

    return () => unsub();
  }, []);

  return (
    <FlatList
      style={{ padding: 15 }}
      data={orders}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={
        <Text style={{ textAlign: "center", marginTop: 50 }}>
          No orders yet 📭
        </Text>
      }
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

  price: {
    fontWeight: "bold",
    marginTop: 5,
    fontSize: 18,
  },

  status: {
    marginTop: 5,
    color: "green",
    fontWeight: "bold",
  },
});
