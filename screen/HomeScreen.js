import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity
} from "react-native";

import { Audio } from "expo-av";   // 🔊 SOUND

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

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pickup, setPickup] = useState("");
  const [delivery, setDelivery] = useState("");
  const [distance, setDistance] = useState("");

  const [price, setPrice] = useState(0);

  // 🔊 SOUND FUNCTION
  const playSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require("../assets/success.mp3")
      );
      await sound.playAsync();
    } catch (e) {
      console.log("sound error", e);
    }
  };

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

  // 💸 PRICE
  useEffect(() => {
    if (!distance) return setPrice(0);

    const km = parseFloat(distance);
    if (isNaN(km)) return setPrice(0);

    setPrice(60 + (km * 10) + 20);
  }, [distance]);

  // 🛒 PLACE ORDER (FIXED + SOUND)
  const placeOrder = async () => {
    if (!name || !phone || !pickup || !delivery || !distance) {
      alert("Fill all fields");
      return;
    }

    await addDoc(collection(db, "orders"), {
      name,
      phone,
      pickupAddress: pickup,
      deliveryAddress: delivery,
      distance,
      price,
      userEmail: user.email,
      status: "pending",
      createdAt: new Date()
    });

    // 🔊 SOUND PLAY
    playSound();

    // RESET
    setName("");
    setPhone("");
    setPickup("");
    setDelivery("");
    setDistance("");

    alert("Order placed ✅");
  };

  const logout = () => signOut(auth);

  return (
    <ScrollView style={styles.container}>

      <Text style={styles.title}>Welcome {user.email}</Text>

      <TouchableOpacity onPress={logout}>
        <Text style={styles.logout}>Logout</Text>
      </TouchableOpacity>

      {/* FORM */}
      <View style={styles.card}>
        <TextInput
          placeholder="Name"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />

        <TextInput
          placeholder="Phone"
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
        />

        <TextInput
          placeholder="Pickup"
          style={styles.input}
          value={pickup}
          onChangeText={setPickup}
        />

        <TextInput
          placeholder="Delivery"
          style={styles.input}
          value={delivery}
          onChangeText={setDelivery}
        />

        <TextInput
          placeholder="Distance (km)"
          style={styles.input}
          value={distance}
          onChangeText={setDistance}
          keyboardType="numeric"
        />

        <Text style={styles.price}>₹ {price}</Text>

        <TouchableOpacity style={styles.button} onPress={placeOrder}>
          <Text style={styles.btnText}>PLACE ORDER</Text>
        </TouchableOpacity>
      </View>

      {/* ORDERS */}
      <View style={styles.card}>
        <Text style={styles.sub}>My Orders</Text>

        {orders.map(order => (
          <View key={order.id} style={styles.order}>
            <Text>{order.pickupAddress} → {order.deliveryAddress}</Text>
            <Text>₹{order.price}</Text>
          </View>
        ))}
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 15
  },

  title: {
    fontSize: 20,
    fontWeight: "bold"
  },

  logout: {
    color: "red",
    marginBottom: 10
  },

  card: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15
  },

  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 8
  },

  button: {
    backgroundColor: "#800020",
    padding: 15,
    borderRadius: 10,
    alignItems: "center"
  },

  btnText: {
    color: "#fff",
    fontWeight: "bold"
  },

  price: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10
  },

  sub: {
    fontWeight: "bold",
    marginBottom: 10
  },

  order: {
    padding: 10,
    backgroundColor: "#fff",
    marginBottom: 5,
    borderRadius: 8
  }
});
