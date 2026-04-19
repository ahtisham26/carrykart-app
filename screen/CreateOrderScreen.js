import React, { useState } from "react";
import { View, TextInput, Button, Alert } from "react-native";
import { db } from "../firebase";
import { addDoc, collection } from "firebase/firestore";

export default function CreateOrder() {
  const [product, setProduct] = useState("");
  const [qty, setQty] = useState("");

  const submitOrder = async () => {
    if (!product || !qty) {
      Alert.alert("Fill all fields");
      return;
    }

    try {
      await addDoc(collection(db, "orders"), {
        product,
        qty,
        createdAt: new Date(),
      });

      Alert.alert("Order placed successfully");

      setProduct("");
      setQty("");
    } catch (e) {
      console.log(e);
      Alert.alert("Error: Check Firebase rules");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Product Name"
        value={product}
        onChangeText={setProduct}
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
      />

      <TextInput
        placeholder="Quantity"
        value={qty}
        onChangeText={setQty}
        keyboardType="numeric"
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
      />

      <Button title="Submit Order" onPress={submitOrder} />
    </View>
  );
}
