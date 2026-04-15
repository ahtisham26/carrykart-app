import React from "react";
import { View, Text } from "react-native";

export default function HomeScreen({ user }) {
  return (
    <View>
      <Text>Welcome {user.name}</Text>
    </View>
  );
}
