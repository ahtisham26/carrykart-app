import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";

export default function LoginScreen({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const userCred = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const isAdmin =
        email === "ahtishamulhaq087@gmail.com" &&
        password === "orange26";

      setUser({
        uid: userCred.user.uid,
        email,
        role: isAdmin ? "admin" : "user",
      });
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <View style={{ padding: 20, marginTop: 100 }}>
      <Text style={{ fontSize: 22, marginBottom: 20 }}>
        CarryKart Login
      </Text>

      <TextInput
        placeholder="Email"
        onChangeText={setEmail}
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
      />

      <TouchableOpacity
        onPress={login}
        style={{ backgroundColor: "black", padding: 15 }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>
          Login
        </Text>
      </TouchableOpacity>
    </View>
  );
}
