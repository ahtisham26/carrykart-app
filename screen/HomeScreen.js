import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>

      <Text style={{ fontSize: 28, fontWeight: "bold", marginBottom: 20 }}>
        🚀 CarryKart Dashboard
      </Text>

      <TouchableOpacity
        style={{
          backgroundColor: "black",
          padding: 15,
          borderRadius: 10,
          marginBottom: 10
        }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>
          📦 Create Order
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          backgroundColor: "green",
          padding: 15,
          borderRadius: 10
        }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>
          📜 My Orders
        </Text>
      </TouchableOpacity>

    </View>
  );
}
