import React, { useEffect, useState } from "react";
import {
  View, Text, FlatList,
  TouchableOpacity
} from "react-native";

import { db, auth } from "../firebase/config";
import { signOut } from "firebase/auth";
import {
  collection, query, where,
  onSnapshot, updateDoc, doc
} from "firebase/firestore";

export default function DeliveryScreen({ user }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "orders"),
      where("assignedTo", "==", user.email)
    );

    const unsub = onSnapshot(q, (snap) => {
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return unsub;
  }, []);

  const delivered = async (id) => {
    await updateDoc(doc(db, "orders", id), {
      deliveryStatus: "delivered",
      status: "completed"
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
            <Text>Status: {item.deliveryStatus}</Text>

            {item.deliveryStatus !== "delivered" && (
              <TouchableOpacity
                style={{ backgroundColor: "green", padding: 10, marginTop: 10 }}
                onPress={() => delivered(item.id)}
              >
                <Text style={{ color: "#fff" }}>Mark Delivered</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />
    </View>
  );
}
