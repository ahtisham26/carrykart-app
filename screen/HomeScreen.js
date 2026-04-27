import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput
} from "react-native";

import { auth, db } from "../firebase/config";
import { signOut } from "firebase/auth";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot
} from "firebase/firestore";

export default function HomeScreen({ user }) {
  const [orders, setOrders] = useState([]);
  const [newOrder, setNewOrder] = useState("");

  // 🔥 Fetch Orders LIVE
  useEffect(() => {
    const q = query(
      collection(db, "orders"),
      where("userEmail", "==", user.email)
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

  // 🔥 Place Order
  const placeOrder = async () => {
    if (!newOrder) return;

    await addDoc(collection(db, "orders"), {
      item: newOrder,
      status: "pending",
      userEmail: user.email,
      createdAt: new Date()
    });

    setNewOrder("");
  };

  // 🔥 Logout
  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Welcome, {user.email}</Text>

      {/* 🔥 Logout */}
      <TouchableOpacity style={styles.logout} onPress={handleLogout}>
        <Text style={styles.logoutText}>LOGOUT</Text>
      </TouchableOpacity>

      {/* 🔥 Place Order */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Place Order</Text>

        <TextInput
          placeholder="Enter item..."
          placeholderTextColor="#aaa"
          style={styles.input}
          value={newOrder}
          onChangeText={setNewOrder}
        />

        <TouchableOpacity style={styles.button} onPress={placeOrder}>
          <Text style={styles.buttonText}>ORDER</Text>
        </TouchableOpacity>
      </View>

      {/* 🔥 My Orders */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>My Orders</Text>

        {orders.length === 0 ? (
          <Text style={styles.text}>No orders yet</Text>
        ) : (
          orders.map((order) => (
            <View key={order.id} style={styles.orderBox}>
              <Text style={styles.orderText}>{order.item}</Text>
              <Text style={styles.status}>{order.status}</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0a0a",
    padding: 15,
  },
  title: {
    color: "#c9a227",
    fontSize: 24,
    marginBottom: 10,
    fontWeight: "bold",
  },
  logout: {
    backgroundColor: "#800020",
    padding: 10,
    borderRadius: 10,
    alignSelf: "flex-end",
    marginBottom: 15,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#1a1111",
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: "#800020",
  },
  cardTitle: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 10,
  },
  text: {
    color: "#aaa",
  },
  input: {
    backgroundColor: "#0f0a0a",
    padding: 12,
    borderRadius: 10,
    color: "#fff",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#333",
  },
  button: {
    backgroundColor: "#800020",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  orderBox: {
    backgroundColor: "#0f0a0a",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  orderText: {
    color: "#fff",
  },
  status: {
    color: "#c9a227",
    fontSize: 12,
  },
});
