import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground
} from "react-native";

export default function LoginScreen({ setUser, goToSignup }) {
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
    <ImageBackground
      source={{ uri: "https://images.unsplash.com/photo-1524594154908-edd89c543d0b" }}
      style={styles.bg}
      blurRadius={3}
    >
      <View style={styles.overlay}>

        <Text style={styles.logo}>CarryKart</Text>

        <View style={styles.card}>
          <TextInput
            placeholder="Enter your name"
            placeholderTextColor="#aaa"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>ENTER</Text>
          </TouchableOpacity>

          {/* 👇 NEW LINE (signup switch) */}
          <TouchableOpacity onPress={goToSignup}>
            <Text style={{ color: "#c9a227", textAlign: "center", marginTop: 15 }}>
              Create an Account
            </Text>
          </TouchableOpacity>

        </View>

      </View>
    </ImageBackground>
  );
}
