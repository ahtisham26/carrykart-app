import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function HomeScreen({ user, logout, goCreateOrder }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome {user.name}</Text>

      <TouchableOpacity style={styles.button} onPress={goCreateOrder}>
        <Text style={styles.btnText}>Create Order</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.btnText}>My Orders</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.btnText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a0f12",
    justifyContent: "center",
    alignItems: "center",
  },
  title: { color: "#fff", fontSize: 22, marginBottom: 30 },
  button: {
    backgroundColor: "#800020",
    padding: 15,
    width: "80%",
    marginBottom: 10,
    borderRadius: 10,
  },
  logoutBtn: {
    backgroundColor: "#3a0a15",
    padding: 15,
    width: "80%",
    marginTop: 20,
    borderRadius: 10,
  },
  btnText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
});
