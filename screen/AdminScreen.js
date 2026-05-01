import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput
} from "react-native";

import { db } from "../firebase/config";
import {
  collection,
  onSnapshot,
  updateDoc,
  doc
} from "firebase/firestore";

export default function AdminScreen() {
  const [orders, setOrders] = useState([]);
  const [boyEmail, setBoyEmail] = useState("");

  useEffect(() => {

    let unsubscribe;

    try {
      unsubscribe = onSnapshot(collection(db, "orders"), (snapshot) => {
        const list = snapshot.docs.map(d => ({
          id: d.id,
          ...d.data()
        }));
        setOrders(list);
      });
    } catch (e) {
      console.log("Admin fetch error:", e);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };

  }, []);

  const updateStatus = async (id, status) => {
    try {
      await updateDoc(doc(db, "orders", id), {
        status: status
      });
    } catch (e) {
      console.log("Update error:", e);
    }
  };

  const assignOrder = async (id) => {
    if (!boyEmail) {
      alert("Enter delivery boy email");
      return;
    }

    try {
      await updateDoc(doc(db, "orders", id), {
        assignedTo: boyEmail,
        deliveryStatus: "assigned"
      });
      alert("Assigned 🚚");
    } catch (e) {
      console.log("Assign error:", e);
    }
  };

  // 🔥 SAFETY (prevents blank)
  if (!orders) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "#fff" }}>Loading orders...</Text>
      </View>
    );
  }

  return (
    <View style={{ padding: 20, backgroundColor: "#0f0a0a", flex: 1 }}>

      <TextInput
        placeholder="Delivery boy email"
        placeholderTextColor="#aaa"
        value={boyEmail}
        onChangeText={setBoyEmail}
        style={{
          borderWidth: 1,
          borderColor: "#333",
          marginBottom: 15,
          padding: 10,
          color: "#fff"
        }}
      />

      {orders.length === 0 ? (
        <Text style={{ color: "#aaa" }}>No orders yet</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {

            // 🔥 SAFETY (avoid undefined crash)
            if (!item) return null;

            return (
              <View style={{ marginBottom: 15 }}>

                <Text style={{ color: "#fff" }}>
                  {item.item || "Order"} ({item.userEmail || "unknown"})
                </Text>

                <Text style={{ color: "#aaa" }}>
                  Assigned: {item.assignedTo || "none"}
                </Text>

                <TouchableOpacity onPress={() => updateStatus(item.id, "accepted")}>
                  <Text style={{ color: "green" }}>Accept</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => updateStatus(item.id, "rejected")}>
                  <Text style={{ color: "red" }}>Reject</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => assignOrder(item.id)}>
                  <Text style={{ color: "blue" }}>Assign</Text>
                </TouchableOpacity>

              </View>
            );
          }}
        />
      )}

    </View>
  );
    }
