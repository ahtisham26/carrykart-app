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

  // 🔥 FIX: email normalize
  const assignOrder = async (id) => {
    const cleanEmail = boyEmail.trim().toLowerCase();

    if (!cleanEmail) {
      alert("Enter delivery boy email");
      return;
    }

    await updateDoc(doc(db, "orders", id), {
      assignedTo: cleanEmail,
      deliveryStatus: "assigned"
    });

    alert("Assigned 🚚");
  };

  return (
    <View style={{ padding: 20 }}>

      <TextInput
        placeholder="Delivery boy email"
        value={boyEmail}
        onChangeText={setBoyEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{
          borderWidth: 1,
          marginBottom: 15,
          padding: 10
        }}
      />

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 15 }}>

            <Text>
              {item.item} ({item.userEmail})
            </Text>

            <Text>
              Assigned: {item.assignedTo || "none"}
            </Text>

            <TouchableOpacity
              onPress={() => updateStatus(item.id, "accepted")}
            >
              <Text style={{ color: "green" }}>Accept</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => updateStatus(item.id, "rejected")}
            >
              <Text style={{ color: "red" }}>Reject</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => assignOrder(item.id)}>
              <Text style={{ color: "blue" }}>Assign</Text>
            </TouchableOpacity>

          </View>
        )}
      />
    </View>
  );
}
