import React, { useState, useEffect } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert
} from "react-native";

import { Audio } from "expo-av";
import { db, auth } from "../firebase/config";
import { collection, addDoc } from "firebase/firestore";

export default function CreateOrder() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pickup, setPickup] = useState("");
  const [delivery, setDelivery] = useState("");
  const [distance, setDistance] = useState("");
  const [price, setPrice] = useState(0);

  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/success.mp3")
    );
    await sound.playAsync();
  };

  useEffect(() => {
    if (!distance) return setPrice(0);

    const km = parseFloat(distance);
    if (!isNaN(km)) {
      setPrice(60 + km * 10 + 20);
    }
  }, [distance]);

  const placeOrder = async () => {
    if (!name || !phone || !pickup || !delivery || !distance) {
      Alert.alert("Fill all fields");
      return;
    }

    await addDoc(collection(db, "orders"), {
      name,
      phone,
      pickupAddress: pickup,
      deliveryAddress: delivery,
      distance,
      price,
      userEmail: auth.currentUser.email,
      status: "pending",
      createdAt: new Date()
    });

    await playSound();

    setName("");
    setPhone("");
    setPickup("");
    setDelivery("");
    setDistance("");

    Alert.alert("Order placed successfully ✅");
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create Order</Text>

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
        onChangeText={setPhone}
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
        placeholder="Distance (km)"
        style={styles.input}
        value={distance}
        onChangeText={setDistance}
        keyboardType="numeric"
      />

      <Text style={styles.price}>Total: ₹{price}</Text>

      <TouchableOpacity style={styles.button} onPress={placeOrder}>
        <Text style={styles.buttonText}>PLACE ORDER</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f6fa"
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#800020"
  },
  input: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 14,
    marginBottom: 12
  },
  price: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 20
  },
  button: {
    backgroundColor: "#800020",
    padding: 18,
    borderRadius: 14,
    alignItems: "center"
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16
  }
});
