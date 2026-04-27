import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet
} from "react-native";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase/config";

export default function CreateOrderScreen() {
  const [item, setItem] = useState("");

  const handleCreateOrder = async () => {
    if (!item) return;

    await addDoc(collection(db, "orders"), {
      item: item,
      userEmail: auth.currentUser.email,
      status: "pending",
      createdAt: serverTimestamp(),
    });

    setItem("");
    alert("Order placed!");
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Enter item"
        value={item}
        onChangeText={setItem}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleCreateOrder}>
        <Text style={styles.text}>Place Order</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 20
  },
  button: {
    backgroundColor: "black",
    padding: 15
  },
  text: { color: "white", textAlign: "center" }
});
