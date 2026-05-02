import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

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
  const [tab, setTab] = useState("home");

  // 🔥 STATES (FIXED — all separate)
  const [orders, setOrders] = useState([]);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");        // ✅ separate
  const [pickup, setPickup] = useState("");
  const [delivery, setDelivery] = useState("");
  const [area, setArea] = useState("");
  const [landmark, setLandmark] = useState("");

  const [distance, setDistance] = useState("");  // ✅ separate
  const [price, setPrice] = useState(0);

  // 📦 FETCH ORDERS
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

  // 💸 PRICE CALCULATION
  useEffect(() => {
    if (!distance) return setPrice(0);

    const km = parseFloat(distance);
    if (isNaN(km)) return setPrice(0);

    setPrice(60 + (km * 10) + 20);
  }, [distance]);

  // 🛒 PLACE ORDER
  const placeOrder = async () => {
    if (!name || !phone || !pickup || !delivery || !distance) {
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
      distance,
      price,
      userEmail: user.email,
      status: "pending",
      deliveryStatus: "waiting",
      createdAt: new Date()
    });

    // RESET
    setName("");
    setPhone("");
    setPickup("");
    setDelivery("");
    setArea("");
    setLandmark("");
    setDistance("");

    setTab("orders");
  };

  const logout = () => signOut(auth);

  return (
    <ScrollView style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.welcome}>
          👋 {user.email.split("@")[0]}
        </Text>

        <TouchableOpacity onPress={logout}>
          <Ionicons name="log-out-outline" size={26} color="#800020" />
        </TouchableOpacity>
      </View>

      {/* HOME */}
      {tab === "home" && (
        <>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.cardBtn} onPress={() => setTab("create")}>
              <Ionicons name="add-circle" size={32} color="#800020" />
              <Text style={styles.cardText}>Create Order</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cardBtn} onPress={() => setTab("orders")}>
              <Ionicons name="cube" size={32} color="#800020" />
              <Text style={styles.cardText}>My Orders</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Orders</Text>

            {orders.length === 0 ? (
              <Text style={styles.empty}>No orders yet</Text>
            ) : (
              orders.slice(0, 3).map(order => (
                <View key={order.id} style={styles.orderCard}>
                  <Text style={styles.route}>
                    {order.pickupAddress} → {order.deliveryAddress}
                  </Text>
                  <Text style={styles.meta}>₹{order.price}</Text>
                </View>
              ))
            )}
          </View>
        </>
      )}

      {/* CREATE ORDER */}
      {tab === "create" && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Create Order</Text>

          <TextInput
            placeholder="Full Name"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />

          <TextInput
            placeholder="Phone Number"
            style={styles.input}
            value={phone}
            onChangeText={setPhone}   // ✅ FIXED
            keyboardType="number-pad"
          />

          <TextInput
            placeholder="Pickup Address"
            style={styles.input}
            value={pickup}
            onChangeText={setPickup}
          />

          <TextInput
            placeholder="Delivery Address"
            style={styles.input}
            value={delivery}
            onChangeText={setDelivery}
          />

          <TextInput
            placeholder="Area"
            style={styles.input}
            value={area}
            onChangeText={setArea}
          />

          <TextInput
            placeholder="Landmark"
            style={styles.input}
            value={landmark}
            onChangeText={setLandmark}
          />

          <TextInput
            placeholder="Distance (km)"
            style={styles.input}
            value={distance}
            onChangeText={setDistance}   // ✅ FIXED
            keyboardType="numeric"
          />

          <Text style={styles.price}>₹ {price}</Text>

          <TouchableOpacity style={styles.button} onPress={placeOrder}>
            <Text style={styles.buttonText}>PLACE ORDER</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* MY ORDERS */}
      {tab === "orders" && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Orders</Text>

          {orders.length === 0 ? (
            <Text style={styles.empty}>No orders</Text>
          ) : (
            orders.map(order => (
              <View key={order.id} style={styles.orderCard}>
                <Text style={styles.route}>
                  {order.pickupAddress} → {order.deliveryAddress}
                </Text>

                <Text style={styles.meta}>₹{order.price}</Text>
                <Text style={styles.meta}>Status: {order.status}</Text>
              </View>
            ))
          )}
        </View>
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6fb",
    padding: 15
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20
  },

  welcome: {
    fontSize: 22,
    fontWeight: "bold"
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between"
  },

  cardBtn: {
    backgroundColor: "#fff",
    width: "48%",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    elevation: 5
  },

  cardText: {
    marginTop: 10,
    fontWeight: "bold"
  },

  section: {
    marginTop: 20,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 20,
    elevation: 5
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10
  },

  button: {
    backgroundColor: "#800020",
    padding: 15,
    borderRadius: 12,
    alignItems: "center"
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold"
  },

  price: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10
  },

  orderCard: {
    backgroundColor: "#f1f1f1",
    padding: 15,
    borderRadius: 12,
    marginTop: 10
  },

  route: {
    fontWeight: "bold"
  },

  meta: {
    color: "#666"
  },

  empty: {
    color: "#888"
  }
});
