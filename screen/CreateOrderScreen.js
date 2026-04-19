import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
} from "react-native";

import { db } from "../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function CreateOrderScreen({ user }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [dropAddress, setDropAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const createOrder = async () => {
    if (!name || !phone || !pickupAddress || !dropAddress) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      await addDoc(collection(db, "orders"), {
        name,
        phone,
        pickupAddress,
        dropAddress,
        notes: notes || "",
        userId: user?.uid || "",
        userEmail: user?.email || "",
        status: "pending",
        createdAt: serverTimestamp(),
        price: Math.floor(Math.random() * 500) + 100, // optional earning system
      });

      Alert.alert("Success", "Order Created Successfully 🚀");

      setName("");
      setPhone("");
      setPickupAddress("");
      setDropAddress("");
      setNotes("");
    } catch (error) {
      console.log(error);
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>✨ Create Order</Text>

        <TextInput
          placeholder="Full Name"
          placeholderTextColor="#aaa"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <TextInput
          placeholder="Phone Number"
          placeholderTextColor="#aaa"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          style={styles.input}
        />

        <TextInput
          placeholder="Pickup Address"
          placeholderTextColor="#aaa"
          value={pickupAddress}
          onChangeText={setPickupAddress}
          multiline
          style={[styles.input, { height: 80 }]}
        />

        <TextInput
          placeholder="Drop Address"
          placeholderTextColor="#aaa"
          value={dropAddress}
          onChangeText={setDropAddress}
          multiline
          style={[styles.input, { height: 80 }]}
        />

        <TextInput
          placeholder="Notes (optional)"
          placeholderTextColor="#aaa"
          value={notes}
          onChangeText={setNotes}
          style={styles.input}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={createOrder}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Placing Order..." : "🚀 Submit Order"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  card: {
    margin: 20,
    padding: 20,
    backgroundColor: "#1e293b",
    borderRadius: 20,
  },
  title: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#0b1220",
    color: "white",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#22c55e",
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});
