import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { db } from "../firebase/config";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";

export default function DeliveryScreen() {
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

  const updateStatus = async (id, status) => {
    await updateDoc(doc(db, "orders", id), { status });
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>🚴 Delivery Panel</Text>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {

          if (item.status !== "pending" && item.status !== "accepted") return null;

          return (
            <View style={styles.card}>
              
              <Text style={styles.route}>
                📍 {item.pickup} → {item.drop}
              </Text>

              <Text>📦 {item.item}</Text>
              <Text>💰 ₹{item.price}</Text>

              <Text style={{ marginTop: 5 }}>
                Status: {item.status}
              </Text>

              {item.status === "pending" && (
                <TouchableOpacity
                  onPress={() => updateStatus(item.id, "accepted")}
                  style={[styles.button, { backgroundColor: "#2196f3" }]}
                >
                  <Text style={styles.buttonText}>Accept Order</Text>
                </TouchableOpacity>
              )}

              {item.status === "accepted" && (
                <TouchableOpacity
                  onPress={() => updateStatus(item.id, "delivered")}
                  style={[styles.button, { backgroundColor: "green" }]}
                >
                  <Text style={styles.buttonText}>Mark Delivered</Text>
                </TouchableOpacity>
              )}

            </View>
          );
        }}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f4f6f8"
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20
  },
  card: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 3
  },
  route: {
    fontWeight: "bold",
    marginBottom: 5
  },
  button: {
    marginTop: 8,
    padding: 10,
    borderRadius: 8
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold"
  }
});
