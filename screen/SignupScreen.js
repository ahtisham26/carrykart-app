import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ImageBackground
} from "react-native";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";

export default function SignupScreen({ goToLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <ImageBackground
      source={{ uri: "https://i.ibb.co/2kR5zqX/lily-bg.jpg" }}
      style={styles.bg}
    >
      <View style={styles.overlay}>
        <Text style={styles.logo}>Delivery</Text>

        <View style={styles.card}>
          <Text style={styles.title}>Create Account</Text>

          <TextInput
            placeholder="Email"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            placeholder="Password"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.button} onPress={handleSignup}>
            <Text style={styles.btnText}>SIGN UP</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={goToLogin}>
            <Text style={styles.link}>
              Already have account? Login
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
    justifyContent: "center",
    padding: 20
  },
  logo: {
    textAlign: "center",
    fontSize: 28,
    color: "#800020",
    marginBottom: 20
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    elevation: 5
  },
  title: {
    fontSize: 22,
    marginBottom: 15,
    color: "#800020"
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10
  },
  button: {
    backgroundColor: "#800020",
    padding: 15,
    borderRadius: 10
  },
  btnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold"
  },
  link: {
    textAlign: "center",
    marginTop: 10,
    color: "#800020"
  }
});
