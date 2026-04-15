import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { signInAnonymously } from "firebase/auth";
import { auth } from "../firebase/config";

export default function LoginScreen({ setUser }) {
  const [name, setName] = useState("");

  const login = async () => {
    try {
      const userCred = await signInAnonymously(auth);

      setUser({
        uid: userCred.user.uid,
        name: name,
        role: name === "admin" ? "admin" : "user"
      });
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Enter Name</Text>

      <TextInput
        placeholder="Name"
        onChangeText={setName}
        style={{ borderWidth: 1, marginBottom: 10 }}
      />

      <TouchableOpacity onPress={login}>
        <Text>Login</Text>
      </TouchableOpacity>
    </View>
  );
}
