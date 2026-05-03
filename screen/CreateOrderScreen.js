import React, { useState, useEffect } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet
} from "react-native";

import { Audio } from "expo-av";
import { db, auth } from "../firebase/config";
import { addDoc, collection } from "firebase/firestore";

export default function CreateOrder() {
  const [distance, setDistance] = useState("");
  const [price, setPrice] = useState(0);

  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/success.mp3")
    );
    await sound.playAsync();
  };

  useEffect(() => {
    const km = parseFloat(distance);
    if (!isNaN(km)) setPrice(60 + km * 10 + 20);
  }, [distance]);

  const placeOrder = async () => {
    await addDoc(collection(db, "orders"), {
      distance,
      price,
      userEmail: auth.currentUser.email,
      status: "pending",
    });

    playSound();
    setDistance("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Order</Text>

      <TextInput
        placeholder="Distance (km)"
        value={distance}
        onChangeText={setDistance}
        style={styles.input}
        keyboardType="numeric"
      />

      <Text style={styles.price}>₹ {price}</Text>

      <TouchableOpacity style={styles.btn} onPress={placeOrder}>
        <Text style={{ color: "#fff" }}>PLACE ORDER</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 22, fontWeight: "bold" },

  input: {
    borderWidth: 1,
    marginTop: 15,
    padding: 10,
    borderRadius: 10,
  },

  price: { fontSize: 20, marginTop: 10 },

  btn: {
    backgroundColor: "#800020",
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
    alignItems: "center",
  },
});
