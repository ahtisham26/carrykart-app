import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";

export default function LoginScreen({ setUser }) {
  const [email, setEmail] = useState("");

  const login = () => {
    if (email.trim().length > 3) {
      setUser({ email });
      Alert.alert("Login Success");
    } else {
      Alert.alert("Enter valid email");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>CarryKart Login</Text>

      <TextInput
        placeholder="Email"
        onChangeText={setEmail}
        style={{ borderWidth: 1, padding: 10 }}
      />

      <TouchableOpacity
        onPress={login}
        style={{ backgroundColor: "black", padding: 15, marginTop: 20 }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}
