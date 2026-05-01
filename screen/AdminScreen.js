import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput
} from "react-native";

import { db, auth } from "../firebase/config";

import {
  collection,
  onSnapshot,
  updateDoc,
  doc,
  setDoc
} from "firebase/firestore";

import {
  createUserWithEmailAndPassword
} from "firebase/auth";

export default function AdminScreen() {
  const [orders, setOrders] = useState([]);

  const [boyEmail, setBoyEmail] = useState("");
  const [boyPassword, setBoyPassword] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "orders"), (snapshot) => {
      const list = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      }));
      setOrders(list);
    });

    return unsubscribe;
  }, []);

  // ✅ ASSIGN ORDER
  const assignOrder = async (id) => {
    if (!boyEmail) {
      alert("Enter delivery boy email");
      return;
    }

    await updateDoc(doc(db, "orders", id), {
      assignedTo: boyEmail,
      deliveryStatus: "assigned"
    });

    alert("Assigned 🚚");
  };

  // 🔥 HIRE DELIVERY BOY
  const hireBoy = async () => {
    if (!boyEmail || !boyPassword) {
      alert("Enter email & password");
      return;
    }

    try {
      // 1️⃣ Create auth user
      const userCred = await createUserWithEmailAndPassword(
        auth,
        boyEmail,
        boyPassword
      );

      // 2️⃣ Save role in Firestore
      await setDoc(doc(db, "users", boyEmail), {
        email: boyEmail,
        role: "delivery"
      });

      alert("Delivery boy hired ✅");

      // reset
      setBoyEmail("");
      setBoyPassword("");

    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <View style={{ padding: 20, backgroundColor: "#0f0a0a", flex: 1 }}>

      {/* 🔥 HIRING SECTION */}
      <Text style={{ color: "#fff", fontSize: 18, marginBottom: 10 }}>
        Hire Delivery Boy
      </Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={boyEmail}
        onChangeText={setBoyEmail}
        style={{
          borderWidth: 1,
          borderColor: "#333",
          padding: 10,
          color: "#fff",
          marginBottom: 10
        }}
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#aaa"
        value={boyPassword}
        onChangeText={setBoyPassword}
        secureTextEntry
        style={{
          borderWidth: 1,
          borderColor: "#333",
          padding: 10,
          color: "#fff",
          marginBottom: 10
        }}
      />

      <TouchableOpacity
        onPress={hireBoy}
        style={{
          backgroundColor: "#800020",
          padding: 12,
          borderRadius: 10,
          marginBottom: 20
        }}
      >
        <Text style={{ color: "#fff", textAlign: "center" }}>
          Hire
        </Text>
      </TouchableOpacity>

      {/* 🔥 ORDERS */}
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 15 }}>

            <Text style={{ color: "#fff" }}>
              {item.pickupAddress} → {item.deliveryAddress}
            </Text>

            <Text style={{ color: "#aaa" }}>
              Assigned: {item.assignedTo || "none"}
            </Text>

            <TouchableOpacity onPress={() => assignOrder(item.id)}>
              <Text style={{ color: "blue" }}>Assign</Text>
            </TouchableOpacity>

          </View>
        )}
      />

    </View>
  );
}
