import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView } from "react-native";
import { db, auth } from "../firebase/config";
import { collection, addDoc } from "firebase/firestore";
import * as Notifications from "expo-notifications";

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

    if (!auth.currentUser) {
      Alert.alert("Error", "User not logged in");
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
        userId: auth.currentUser.uid, // ⭐ IMPORTANT
        createdAt: new Date()
      });

      // 🔔 Notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Order Placed 🚀",
          body: "Your order has been successfully placed"
        },
        trigger: null
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
    <ScrollView contentContainerStyle={styles.container}>

      <Text style={styles.title}>📦 Create Order</Text>
      <Text style={styles.subtitle}>Fast pickup & delivery service</Text>

      <View style={styles.card}>

        <TextInput
          placeholder="Pickup Address"
          value={pickup}
          onChangeText={setPickup}
          style={styles.input}
        />

        <TextInput
          placeholder="Drop Address"
          value={drop}
          onChangeText={setDrop}
          style={styles.input}
        />

        <TextInput
          placeholder="Item Description"
          value={item}
          onChangeText={setItem}
          style={styles.input}
        />

        <TextInput
          placeholder="Distance (KM)"
          value={distance}
          keyboardType="numeric"
          onChangeText={setDistance}
          style={styles.input}
        />

        <TouchableOpacity
          onPress={submitOrder}
          style={styles.button}
        >
          <Text style={styles.buttonText}>
            Calculate & Submit Order 💰
          </Text>
        </TouchableOpacity>

      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f4f6f8",
    justifyContent: "center"
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5
  },
  subtitle: {
    textAlign: "center",
    color: "gray",
    marginBottom: 20
  },
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    elevation: 5
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10
  },
  button: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 10,
    marginTop: 10
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold"
  }
});
