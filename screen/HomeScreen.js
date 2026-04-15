import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export default function HomeScreen({ user, logout }) {
  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>

      <Text>Welcome: {user.email}</Text>
      <Text>Role: {user.role}</Text>

      {user.role === "admin" ? (
        <Text style={{ marginTop: 20 }}>ADMIN DASHBOARD ACCESS</Text>
      ) : (
        <Text style={{ marginTop: 20 }}>USER DASHBOARD</Text>
      )}

      <TouchableOpacity
        onPress={logout}
        style={{ backgroundColor: "red", padding: 15, marginTop: 20 }}
      >
        <Text style={{ color: "white" }}>Logout</Text>
      </TouchableOpacity>

    </View>
  );
}
