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

  const updateStatus = async (id, status) => {
    await updateDoc(doc(db, "orders", id), {
      status: status
    });
  };

  const assignOrder = async (id) => {
    if (!boyEmail) {
      alert("Enter delivery boy email");
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
        style={{ backgroundColor: "#800020", padding: 10, borderRadius: 10, marginBottom: 10 }}
        onPress={() => signOut(auth)}
      >
        <Text style={{ color: "#fff", textAlign: "center" }}>Logout</Text>
      </TouchableOpacity>

      {/* INPUT */}
      <TextInput
        placeholder="Delivery boy email"
        value={boyEmail}
        onChangeText={setBoyEmail}
        style={{
          borderWidth: 1,
          padding: 10,
          borderRadius: 10,
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

            <Text>From: {item.pickupAddress}</Text>
            <Text>To: {item.deliveryAddress}</Text>
            <Text>Status: {item.status}</Text>
            <Text>Assigned: {item.assignedTo || "none"}</Text>

            {/* BUTTONS */}
            <View style={{ flexDirection: "row", marginTop: 10 }}>

              <TouchableOpacity
                style={{ backgroundColor: "green", padding: 8, marginRight: 5 }}
                onPress={() => updateStatus(item.id, "accepted")}
              >
                <Text style={{ color: "#fff" }}>Accept</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ backgroundColor: "red", padding: 8, marginRight: 5 }}
                onPress={() => updateStatus(item.id, "rejected")}
              >
                <Text style={{ color: "#fff" }}>Reject</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ backgroundColor: "blue", padding: 8 }}
                onPress={() => assignOrder(item.id)}
              >
                <Text style={{ color: "#fff" }}>Assign</Text>
              </TouchableOpacity>

            </View>

          </View>
        )}
      />
    </View>
  );
}
