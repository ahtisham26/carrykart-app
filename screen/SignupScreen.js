import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground
} from "react-native";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";

export default function SignupScreen({ setUser, goToLogin }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    if (!email || !password) {
      alert("Enter email & password");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // 🔥 Firestore me user save (VERY IMPORTANT)
      await setDoc(doc(db, "users", email), {
        email: email,
        role: "user"
      });

      setUser({
        email: userCredential.user.email,
        role: "user"
      });

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
            placeholder="Email"
            placeholderTextColor="#aaa"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            placeholder="Password"
            placeholderTextColor="#aaa"
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.button} onPress={handleSignup}>
            <Text style={styles.buttonText}>SIGN UP</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={goToLogin}>
            <Text style={{ color: "#c9a227", textAlign: "center", marginTop: 15 }}>
              Already have an account? Login
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
  },
  card: {
    width: "100%",
    backgroundColor: "rgba(26,17,17,0.9)",
    padding: 20,
    borderRadius: 20,
  },
  input: {
    backgroundColor: "#0f0a0a",
    padding: 15,
    borderRadius: 10,
    color: "#fff",
    marginBottom: 20,
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
