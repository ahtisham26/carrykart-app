import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { auth } from "../firebase/config";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "firebase/auth";

export default function LoginScreen({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert("Signup Success");
      setUser(true);
    } catch (e) {
      Alert.alert(e.message);
    }
  };

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Login Success");
      setUser(true);
    } catch (e) {
      Alert.alert(e.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text style={{ fontSize: 26, marginBottom: 20 }}>
        CarryKart Login
      </Text>

      <TextInput
        placeholder="Email"
        onChangeText={setEmail}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
        style={{ borderWidth: 1, padding: 10 }}
      />

      <TouchableOpacity
        onPress={login}
        style={{ backgroundColor: "black", padding: 15, marginTop: 15 }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>
          Login
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={signup}
        style={{ backgroundColor: "green", padding: 15, marginTop: 10 }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>
          Signup
        </Text>
      </TouchableOpacity>
    </View>
  );
}
