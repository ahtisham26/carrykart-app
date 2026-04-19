import React from "react";
import { View, Text, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen() {
  const logout = async () => {
    await AsyncStorage.removeItem("user");
    global.location.reload(); // simple reset
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Welcome Home 🎉</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
}
