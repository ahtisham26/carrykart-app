import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
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

    // 💰 PRICE CALCULATION
    const price = 70;

    try {
      await addDoc(collection(db, "orders"), {
        name,
        phone,
        pickupAddress,
        dropAddress,
        notes,
        userId: user?.uid || "",
        userEmail: user?.email || "",

        // 🔥 IMPORTANT FIELDS
        status: "pending",
        payment: "unpaid",
        price: price,

        createdAt: new Date(),
      });

      alert("Order Created 🚀\nTotal: ₹" + price);

      // RESET
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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        keyboardShouldPersistTaps="handled"
      >
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

          <TextInput
            placeholder="Full Name"
            placeholderTextColor="#94a3b8"
            value={name}
            onChangeText={setName}
            style={{
              backgroundColor: "#0f172a",
              color: "white",
              padding: 12,
              borderRadius: 10,
              marginBottom: 10,
            }}
          />

          <TextInput
            placeholder="Phone Number"
            placeholderTextColor="#94a3b8"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            style={{
              backgroundColor: "#0f172a",
              color: "white",
              padding: 12,
              borderRadius: 10,
              marginBottom: 10,
            }}
          />

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
            placeholder="Notes (optional)"
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
    </KeyboardAvoidingView>
  );
}
