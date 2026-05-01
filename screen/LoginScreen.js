import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground
} from "react-native";

import { signInAnonymously } from "firebase/auth";
import { auth } from "../firebase/config";

export default function LoginScreen({ setUser, goToSignup }) {
  const [name, setName] = useState("");

  const handleLogin = async () => {
    if (!name) return;

    try {
      // 🔥 Firebase ko trigger karega (important)
      await signInAnonymously(auth);

      // 🔥 local role bhi set (UI same rahe)
      if (name.toLowerCase() === "admin") {
        setUser({ name, role: "admin", email: "admin@gmail.com" });
      } else {
        setUser({ name, role: "user", email: `${name}@user.com` });
      }

    } catch (e) {
      alert(e.message);
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

const styles = StyleSheet.create({
  bg: { flex: 1 },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15,10,10,0.85)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logo: {
    fontSize: 40,
    color: "#c9a227",
    marginBottom: 30,
    fontWeight: "bold",
    letterSpacing: 3,
  },
  card: {
    width: "100%",
    backgroundColor: "rgba(26,17,17,0.9)",
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#800020",
  },
  input: {
    backgroundColor: "#0f0a0a",
    padding: 15,
    borderRadius: 10,
    color: "#fff",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#333",
  },
  button: {
    backgroundColor: "#800020",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
