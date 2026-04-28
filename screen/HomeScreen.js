import React, { useState, useEffect } from "react";
import {
  View, Text, StyleSheet, ScrollView,
  TextInput, TouchableOpacity
} from "react-native";

import { auth, db } from "../firebase/config";
import { signOut } from "firebase/auth";
import {
  collection, addDoc, query,
  where, onSnapshot
} from "firebase/firestore";

export default function HomeScreen({ user }) {

  const [orders, setOrders] = useState([]);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [pickup, setPickup] = useState("");
  const [delivery, setDelivery] = useState("");

  const [area, setArea] = useState("");
  const [landmark, setLandmark] = useState("");

  // 🔥 FETCH ORDERS (REALTIME)
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

  // 🛒 PLACE ORDER
  const placeOrder = async () => {
    if (!name || !phone || !pickup || !delivery) {
      alert("Fill required fields");
      return;
    }

    await addDoc(collection(db, "orders"), {
      name,
      phone,
      pickupAddress: pickup,
      deliveryAddress: delivery,
      area,
      landmark,
      userEmail: user.email,
      status: "pending",
      createdAt: new Date()
    });

    // reset
    setName("");
    setPhone("");
    setPickup("");
    setDelivery("");
    setArea("");
    setLandmark("");
  };

  // 🚪 LOGOUT
  const logout = () => {
    signOut(auth);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Welcome, {user.email}</Text>

      {/* LOGOUT */}
      <TouchableOpacity style={styles.logout} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* ORDER FORM */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Place Order</Text>

        <TextInput
          placeholder="Full Name"
          placeholderTextColor="#aaa"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />

        <TextInput
          placeholder="Phone Number"
          placeholderTextColor="#aaa"
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          keyboardType="number-pad"
        />

        <TextInput
          placeholder="Pickup Address"
          placeholderTextColor="#aaa"
          style={styles.input}
          value={pickup}
          onChangeText={setPickup}
        />

        <TextInput
          placeholder="Delivery Address"
          placeholderTextColor="#aaa"
          style={styles.input}
          value={delivery}
          onChangeText={setDelivery}
        />

        <TextInput
          placeholder="Area"
          placeholderTextColor="#aaa"
          style={styles.input}
          value={area}
          onChangeText={setArea}
        />

        <TextInput
          placeholder="Landmark (optional)"
          placeholderTextColor="#aaa"
          style={styles.input}
          value={landmark}
          onChangeText={setLandmark}
        />

        <TouchableOpacity style={styles.button} onPress={placeOrder}>
          <Text style={styles.buttonText}>PLACE ORDER</Text>
        </TouchableOpacity>
      </View>

      {/* MY ORDERS */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>My Orders</Text>

        {orders.length === 0 ? (
          <Text style={styles.text}>No orders yet</Text>
        ) : (
          orders.map(order => (
            <View key={order.id} style={styles.orderBox}>
              <Text style={styles.text}>Name: {order.name}</Text>
              <Text style={styles.text}>From: {order.pickupAddress}</Text>
              <Text style={styles.text}>To: {order.deliveryAddress}</Text>
              <Text style={styles.text}>Area: {order.area}</Text>
              <Text style={styles.status}>Status: {order.status}</Text>
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
    marginBottom: 15,
    alignItems: "center",
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
  input: {
    backgroundColor: "#0f0a0a",
    padding: 12,
    borderRadius: 10,
    color: "#fff",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#800020",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  text: {
    color: "#aaa",
  },
  orderBox: {
    backgroundColor: "#0f0a0a",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  status: {
    color: "#c9a227",
  },
});
