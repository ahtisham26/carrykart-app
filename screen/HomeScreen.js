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

  const [showForm, setShowForm] = useState(false);
  const [showOrders, setShowOrders] = useState(true);

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

    setName("");
    setPhone("");
    setPickup("");
    setDelivery("");
    setArea("");
    setLandmark("");

    setShowForm(false);
    setShowOrders(true);
  };

  const logout = () => {
    signOut(auth);
  };

  return (
    <ScrollView style={styles.container}>

      {/* HEADER */}
      <Text style={styles.title}>Welcome, {user.email}</Text>

      <TouchableOpacity style={styles.logout} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* BUTTON CARDS */}
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.cardBtn}
          onPress={() => {
            setShowForm(true);
            setShowOrders(false);
          }}
        >
          <Text style={styles.cardBtnText}>Create Order</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cardBtn}
          onPress={() => {
            setShowForm(false);
            setShowOrders(true);
          }}
        >
          <Text style={styles.cardBtnText}>My Orders</Text>
        </TouchableOpacity>
      </View>

      {/* FORM */}
      {showForm && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Place Order</Text>

          <TextInput style={styles.input} placeholder="Full Name" value={name} onChangeText={setName} />
          <TextInput style={styles.input} placeholder="Phone Number" value={phone} onChangeText={setPhone} />
          <TextInput style={styles.input} placeholder="Pickup Address" value={pickup} onChangeText={setPickup} />
          <TextInput style={styles.input} placeholder="Delivery Address" value={delivery} onChangeText={setDelivery} />
          <TextInput style={styles.input} placeholder="Area" value={area} onChangeText={setArea} />
          <TextInput style={styles.input} placeholder="Landmark" value={landmark} onChangeText={setLandmark} />

          <TouchableOpacity style={styles.button} onPress={placeOrder}>
            <Text style={styles.buttonText}>PLACE ORDER</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ORDERS */}
      {showOrders && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>My Orders</Text>

          {orders.length === 0 ? (
            <Text>No orders yet</Text>
          ) : (
            orders.map(order => (
              <View key={order.id} style={styles.orderBox}>
                <Text>From: {order.pickupAddress}</Text>
                <Text>To: {order.deliveryAddress}</Text>
                <Text>Status: {order.status}</Text>
              </View>
            ))
          )}
        </View>
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 15 },

  title: { fontSize: 22, color: "#800020", marginBottom: 10 },

  logout: {
    backgroundColor: "#800020",
    padding: 10,
    borderRadius: 10,
    marginBottom: 15
  },

  logoutText: { color: "#fff", textAlign: "center" },

  row: { flexDirection: "row", justifyContent: "space-between" },

  cardBtn: {
    backgroundColor: "#fff",
    width: "48%",
    padding: 20,
    borderRadius: 15,
    alignItems: "center"
  },

  cardBtnText: { color: "#800020", fontWeight: "bold" },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    marginTop: 15
  },

  cardTitle: { fontSize: 18, marginBottom: 10 },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10
  },

  button: {
    backgroundColor: "#800020",
    padding: 15,
    borderRadius: 10
  },

  buttonText: { color: "#fff", textAlign: "center" },

  orderBox: {
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 10,
    marginTop: 10
  }
});
