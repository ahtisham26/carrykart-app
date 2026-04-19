import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

export default function CreateOrder({ user, goHome }) {
  const [item, setItem] = useState("");

  const submit = async () => {
    if (!item) return;

    await addDoc(collection(db, "orders"), {
      item,
      userId: user.id,
      createdAt: new Date(),
    });

    alert("Order Created!");
    setItem("");
    goHome(); // 🔥 back to home
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Order</Text>

      <TextInput
        value={item}
        onChangeText={setItem}
        placeholder="Enter item"
        style={styles.input}
        placeholderTextColor="#aaa"
      />

      <TouchableOpacity style={styles.button} onPress={submit}>
        <Text style={styles.btnText}>Submit</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={goHome}>
        <Text style={styles.back}>← Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a0f12",
    justifyContent: "center",
    padding: 20,
  },
  title: { color: "#fff", fontSize: 22, marginBottom: 20, textAlign: "center" },
  input: {
    backgroundColor: "#2a141a",
    color: "white",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#800020",
    padding: 15,
    borderRadius: 10,
  },
  btnText: { color: "white", textAlign: "center" },
  back: {
    color: "#fff",
    textAlign: "center",
    marginTop: 15,
    opacity: 0.7,
  },
});
