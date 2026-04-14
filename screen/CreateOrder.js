import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";

import { db } from "../firebase/config";
import { collection, addDoc } from "firebase/firestore";

export default function CreateOrder() {
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [item, setItem] = useState("");

  const submitOrder = async () => {
    if (!pickup || !drop || !item) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      await addDoc(collection(db, "orders"), {
        pickup,
        drop,
        item,
        status: "pending",
        createdAt: new Date()
      });

      Alert.alert("Success 🚀", "Order saved successfully");

      setPickup("");
      setDrop("");
      setItem("");

    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>

      <Text style={{ fontSize: 24, marginBottom: 20 }}>
        📦 Create Order
      </Text>

      <TextInput
        placeholder="Pickup Address"
        value={pickup}
        onChangeText={setPickup}
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
      />

      <TextInput
        placeholder="Drop Address"
        value={drop}
        onChangeText={setDrop}
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
      />

      <TextInput
        placeholder="Item Description"
        value={item}
        onChangeText={setItem}
        style={{ borderWidth: 1, marginBottom: 20, padding: 10 }}
      />

      <TouchableOpacity
        onPress={submitOrder}
        style={{ backgroundColor: "black", padding: 15 }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>
          Submit Order
        </Text>
      </TouchableOpacity>

    </View>
  );
}
