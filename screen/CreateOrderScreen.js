import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
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
      alert("Fill all fields");
      return;
    }

    await addDoc(collection(db, "orders"), {
      name,
      phone,
      pickupAddress,
      dropAddress,
      notes,
      userId: user.uid,
      userEmail: user.email,
      status: "pending",
      createdAt: new Date(),
    });

    alert("Order Created 🚀");

    setName("");
    setPhone("");
    setPickupAddress("");
    setDropAddress("");
    setNotes("");
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <View
        style={{
          backgroundColor: "#1e293b",
          padding: 20,
          borderRadius: 20,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            color: "white",
            marginBottom: 15,
            fontWeight: "bold",
          }}
        >
          Create Order
        </Text>

        {/* INPUT STYLE */}
        {[ 
          { placeholder: "Full Name", value: name, set: setName },
          { placeholder: "Phone", value: phone, set: setPhone },
        ].map((item, i) => (
          <TextInput
            key={i}
            placeholder={item.placeholder}
            placeholderTextColor="#94a3b8"
            value={item.value}
            onChangeText={item.set}
            style={{
              backgroundColor: "#0f172a",
              color: "white",
              padding: 12,
              borderRadius: 10,
              marginBottom: 10,
            }}
          />
        ))}

        <TextInput
          placeholder="Pickup Address"
          placeholderTextColor="#94a3b8"
          value={pickupAddress}
          onChangeText={setPickupAddress}
          multiline
          style={{
            backgroundColor: "#0f172a",
            color: "white",
            padding: 12,
            borderRadius: 10,
            marginBottom: 10,
            height: 70,
          }}
        />

        <TextInput
          placeholder="Drop Address"
          placeholderTextColor="#94a3b8"
          value={dropAddress}
          onChangeText={setDropAddress}
          multiline
          style={{
            backgroundColor: "#0f172a",
            color: "white",
            padding: 12,
            borderRadius: 10,
            marginBottom: 10,
            height: 70,
          }}
        />

        <TextInput
          placeholder="Notes"
          placeholderTextColor="#94a3b8"
          value={notes}
          onChangeText={setNotes}
          style={{
            backgroundColor: "#0f172a",
            color: "white",
            padding: 12,
            borderRadius: 10,
            marginBottom: 15,
          }}
        />

        <TouchableOpacity
          onPress={createOrder}
          style={{
            backgroundColor: "#22c55e",
            padding: 15,
            borderRadius: 12,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: "white",
              fontWeight: "bold",
              fontSize: 16,
            }}
          >
            🚀 Submit Order
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
