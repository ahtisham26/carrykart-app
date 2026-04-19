import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

export default function LoginScreen({ setUser }) {
  const [name, setName] = useState("");

  const handleLogin = () => {
    if (!name) return;

    if (name.toLowerCase() === "admin") {
      setUser({ name, role: "admin" });
    } else {
      setUser({ name, role: "user" });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>CarryKart</Text>

      <TextInput
        placeholder="Enter your name"
        placeholderTextColor="#888"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>ENTER</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0a0a",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logo: {
    fontSize: 36,
    color: "#c9a227",
    marginBottom: 40,
    fontWeight: "bold",
    letterSpacing: 2,
  },
  input: {
    width: "100%",
    backgroundColor: "#1a1111",
    padding: 15,
    borderRadius: 12,
    color: "#fff
