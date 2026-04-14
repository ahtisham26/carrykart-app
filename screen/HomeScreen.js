import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import MyOrders from "./MyOrders";
import AdminScreen from "./AdminScreen";

export default function HomeScreen() {
  const [view, setView] = useState("home");

  if (view === "orders") {
    return <MyOrders />;
  }

  if (view === "admin") {
    return <AdminScreen />;
  }

  return (
    <View style={styles.container}>

      <Text style={styles.title}>🚀 CarryKart</Text>
      <Text style={styles.subtitle}>Fast & Reliable Delivery</Text>

      <View style={styles.card}>

        <TouchableOpacity
          style={styles.button}
          onPress={() => alert("Create Order screen already built — connect next")}
        >
          <Text style={styles.buttonText}>📦 Create Order</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#28a745" }]}
          onPress={() => setView("orders")}
        >
          <Text style={styles.buttonText}>📜 My Orders</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#ff9800" }]}
          onPress={() => setView("admin")}
        >
          <Text style={styles.buttonText}>🛠 Admin Panel</Text>
        </TouchableOpacity>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f8",
    justifyContent: "center",
    alignItems: "center",
    padding: 20
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 5
  },
  subtitle: {
    fontSize: 14,
    color: "gray",
    marginBottom: 30
  },
  card: {
    width: "100%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    elevation: 5
  },
  button: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold"
  }
});
