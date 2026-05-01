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

  const [tab, setTab] = useState("create"); // 🔥 tab switch

  const [orders, setOrders] = useState([]);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pickup, setPickup] = useState("");
  const [delivery, setDelivery] = useState("");
  const [area, setArea] = useState("");
  const [landmark, setLandmark] = useState("");

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

    alert("Order placed ✅");
  };

  const logout = () => {
    signOut(auth);
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Welcome, {user.email}</Text>

      <TouchableOpacity style={styles.logout} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* 🔥 TAB SWITCH */}
      <View style={styles.tabs}>
        <TouchableOpacity onPress={() => setTab("create")}>
          <Text style={tab === "create" ? styles.activeTab : styles.tab}>
            Create Order
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setTab("orders")}>
          <Text style={tab === "orders" ? styles.activeTab : styles.tab}>
            My Orders
          </Text>
        </TouchableOpacity>
      </View>

      {/* 🔥 CREATE ORDER */}
      {tab === "create" && (
        <ScrollView>
          <View style={styles.card}>
            <TextInput placeholder="Name" style={styles.input} value={name} onChangeText={setName}/>
            <TextInput placeholder="Phone" style={styles.input} value={phone} onChangeText={setPhone}/>
            <TextInput placeholder="Pickup" style={styles.input} value={pickup} onChangeText={setPickup}/>
            <TextInput placeholder="Delivery" style={styles.input} value={delivery} onChangeText={setDelivery}/>
            <TextInput placeholder="Area" style={styles.input} value={area} onChangeText={setArea}/>
            <TextInput placeholder="Landmark" style={styles.input} value={landmark} onChangeText={setLandmark}/>

            <TouchableOpacity style={styles.button} onPress={placeOrder}>
              <Text style={styles.buttonText}>PLACE ORDER</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {/* 🔥 MY ORDERS */}
      {tab === "orders" && (
        <ScrollView>
          {orders.length === 0 ? (
            <Text style={{ color: "#aaa" }}>No orders yet</Text>
          ) : (
            orders.map(order => (
              <View key={order.id} style={styles.orderBox}>
                <Text style={styles.text}>{order.pickupAddress} → {order.deliveryAddress}</Text>
                <Text style={styles.status}>{order.status}</Text>
              </View>
            ))
          )}
        </ScrollView>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0a0a", padding: 15 },
  title: { color: "#c9a227", fontSize: 20 },
  logout: { backgroundColor: "#800020", padding: 10, marginVertical: 10 },
  logoutText: { color: "#fff", textAlign: "center" },

  tabs: { flexDirection: "row", justifyContent: "space-around", marginBottom: 10 },
  tab: { color: "#aaa" },
  activeTab: { color: "#c9a227", fontWeight: "bold" },

  card: { backgroundColor: "#1a1111", padding: 15 },
  input: { backgroundColor: "#000", color: "#fff", marginBottom: 10, padding: 10 },
  button: { backgroundColor: "#800020", padding: 15 },
  buttonText: { color: "#fff", textAlign: "center" },

  orderBox: { backgroundColor: "#000", padding: 10, marginBottom: 10 },
  text: { color: "#fff" },
  status: { color: "#c9a227" }
});
