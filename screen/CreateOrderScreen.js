import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { db } from "../firebase/config";
import { collection, addDoc } from "firebase/firestore";

export default function CreateOrderScreen({ user }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [dropAddress, setDropAddress] = useState("");
  const [notes, setNotes] = useState("");

  const createOrder = async () => {
    if (!name || !phone || !pickupAddress || !dropAddress) {
      alert("Please fill all required fields");
      return;
    }

    try {
      await addDoc(collection(db, "orders"), {
        name,
        phone,
        pickupAddress,
        dropAddress,
        notes,
        userId: user.uid,
        userEmail: user.email,
        status: "pending",
        createdAt: new Date()
      });

      alert("Order Created Successfully!");

      setName("");
      setPhone("");
      setPickupAddress("");
      setDropAddress("");
      setNotes("");
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, marginBottom: 20 }}>
        Create New Order
      </Text>

      <TextInput
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />

      <TextInput
        placeholder="Phone Number"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />

      <TextInput
        placeholder="Pickup Address (Full)"
        value={pickupAddress}
        onChangeText={setPickupAddress}
        multiline
        style={{ borderWidth: 1, padding: 10, marginBottom: 10, height: 80 }}
      />

      <TextInput
        placeholder="Drop Address (Full)"
        value={dropAddress}
        onChangeText={setDropAddress}
        multiline
        style={{ borderWidth: 1, padding: 10, marginBottom: 10, height: 80 }}
      />

      <TextInput
        placeholder="Notes (optional)"
        value={notes}
        onChangeText={setNotes}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />

      <TouchableOpacity
        onPress={createOrder}
        style={{ backgroundColor: "black", padding: 15, marginTop: 10 }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>
          Submit Order
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
