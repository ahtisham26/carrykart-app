import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

export default function CreateOrder() {
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [item, setItem] = useState("");

  return (
    <View style={{ flex: 1, padding: 20 }}>

      <Text style={{ fontSize: 24, marginBottom: 20 }}>
        📦 Create Order
      </Text>

      <TextInput placeholder="Pickup Address"
        onChangeText={setPickup}
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }} />

      <TextInput placeholder="Drop Address"
        onChangeText={setDrop}
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }} />

      <TextInput placeholder="Item Description"
        onChangeText={setItem}
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }} />

      <TouchableOpacity style={{ backgroundColor: "black", padding: 15 }}>
        <Text style={{ color: "white", textAlign: "center" }}>
          Submit Order
        </Text>
      </TouchableOpacity>

    </View>
  );
}
