import React from "react";
import { View, Text } from "react-native";
import CreateOrderScreen from "./CreateOrderScreen";

export default function HomeScreen({ user }) {
  return (
    <View style={{ flex: 1 }}>
      <Text style={{ fontSize: 20, margin: 20 }}>
        Welcome {user.email}
      </Text>

      {/* ORDER FORM */}
      <CreateOrderScreen user={user} />
    </View>
  );
}
