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
  const [boyEmail, setBoyEmail] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "orders"), (snapshot) => {

      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setOrders(list);
    });

    return unsubscribe;
  }, []);

  const assignOrder = async (id) => {
    if (!boyEmail) {
      alert("Enter delivery email");
      return;
    }

    await updateDoc(doc(db, "orders", id), {
      assignedTo: boyEmail,
      deliveryStatus: "assigned"
    });

    setBoyEmail("");
  };

  return (
    <View style={{ flex: 1, padding: 15, backgroundColor: "#f5f5f5" }}>

      {/* LOGOUT */}
      <TouchableOpacity
        onPress={() => signOut(auth)}
        style={{ backgroundColor: "#800020", padding: 10, borderRadius: 10 }}
      >
        <Text style={{ color: "#fff", textAlign: "center" }}>Logout</Text>
      </TouchableOpacity>

      {/* INPUT */}
      <TextInput
        placeholder="Delivery Boy Email"
        value={boyEmail}
        onChangeText={setBoyEmail}
        style={{
          borderWidth: 1,
          padding: 10,
          borderRadius: 10,
          marginTop: 10,
          marginBottom: 10
        }}
      />

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (

          <View style={{
            backgroundColor: "#fff",
            padding: 15,
            borderRadius: 10,
            marginBottom: 10
          }}>

            <Text>Name: {item.name}</Text>
            <Text>Phone: {item.phone}</Text>

            <Text>From: {item.pickupAddress}</Text>
            <Text>To: {item.deliveryAddress}</Text>

            <Text>Distance: {item.distance} km</Text>
            <Text>Amount: ₹{item.amount}</Text>

            <Text>Status: {item.status}</Text>
            <Text>Delivery: {item.deliveryStatus}</Text>

            <Text>Assigned: {item.assignedTo || "none"}</Text>

            <TouchableOpacity
              onPress={() => assignOrder(item.id)}
              style={{
                backgroundColor: "blue",
                padding: 8,
                marginTop: 10,
                borderRadius: 5
              }}
            >
              <Text style={{ color: "#fff" }}>Assign</Text>
            </TouchableOpacity>

          </View>
        )}
      />

    </View>
  );
}
