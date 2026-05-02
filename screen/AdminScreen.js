import React, { useEffect, useState } from "react";
import {
  View, Text, FlatList,
  TouchableOpacity, TextInput
} from "react-native";

import { db, auth } from "../firebase/config";
import { signOut } from "firebase/auth";
import {
  collection, onSnapshot,
  updateDoc, doc
} from "firebase/firestore";

export default function AdminScreen() {
  const [orders, setOrders] = useState([]);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "orders"), (snap) => {
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  const assign = async (id) => {
    await updateDoc(doc(db, "orders", id), {
      assignedTo: email,
      deliveryStatus: "assigned"
    });
  };

  return (
    <View style={{ flex: 1, padding: 15, backgroundColor: "#f5f5f5" }}>

      {/* LOGOUT */}
      <TouchableOpacity
        style={{ backgroundColor: "#800020", padding: 10, borderRadius: 10, marginBottom: 10 }}
        onPress={() => signOut(auth)}
      >
        <Text style={{ color: "#fff", textAlign: "center" }}>Logout</Text>
      </TouchableOpacity>

      <TextInput
        placeholder="Delivery Boy Email"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />

      <FlatList
        data={orders}
        renderItem={({ item }) => (
          <View style={{
            backgroundColor: "#fff",
            padding: 15,
            borderRadius: 10,
            marginBottom: 10
          }}>
            <Text>{item.pickupAddress} → {item.deliveryAddress}</Text>
            <Text>Status: {item.status}</Text>

            <TouchableOpacity
              style={{ backgroundColor: "blue", padding: 8, marginTop: 5 }}
              onPress={() => assign(item.id)}
            >
              <Text style={{ color: "#fff" }}>Assign</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
