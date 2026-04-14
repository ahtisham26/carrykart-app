import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { db } from "../firebase/config";
import { collection, addDoc } from "firebase/firestore";

export default function CreateOrder() {
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [item, setItem] = useState("");
  const [distance, setDistance] = useState("");

  const calculatePrice = (dist) => {
    const base = 60;
    const perKm = 10;
    const platformFee = 20;

    return base + (dist * perKm) + platformFee;
  };

  const submitOrder = async () => {
    if (!pickup || !drop || !item || !distance) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    const price = calculatePrice(Number(distance));

    try {
      await addDoc(collection(db, "orders"), {
        pickup,
        drop,
        item,
        distance,
        price,
        status: "pending",
        createdAt: new Date()
      });

      Alert.alert("Success 🚀", "Order placed! Total: ₹" + price);

      setPickup("");
      setDrop("");
      setItem("");
      setDistance("");

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
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
      />

      <TextInput
        placeholder="Distance (KM)"
        value={distance}
        keyboardType="numeric"
        onChangeText={setDistance}
        style={{ borderWidth: 1, marginBottom: 20, padding: 10 }}
      />

      <TouchableOpacity
        onPress={submitOrder}
        style={{ backgroundColor: "black", padding: 15 }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>
          Calculate & Submit Order
        </Text>
      </TouchableOpacity>

    </View>
  );
}
