import React from "react";
import { View, Text } from "react-native";
import CreateOrderScreen from "./CreateOrderScreen";

export default function HomeScreen({ user }) {
  return (
    <View style={{ flex: 1, backgroundColor: "#0f172a" }}>
      <Text
        style={{
          fontSize: 24,
          color: "white",
          marginTop: 60,
          marginLeft: 20,
          fontWeight: "bold",
        }}
      >
        Welcome 👋
      </Text>

      <Text style={{ color: "#94a3b8", marginLeft: 20 }}>
        {user.email}
      </Text>

      <CreateOrderScreen user={user} />
    </View>
  );
}
