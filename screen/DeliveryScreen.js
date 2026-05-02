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

    if (!user?.email) return;

    const q = query(
      collection(db, "orders"),
      where("assignedTo", "==", user.email)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {

      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setOrders(list);
    });

    return unsubscribe;

  }, [user]);

  const markDelivered = async (id) => {

    await updateDoc(doc(db, "orders", id), {
      deliveryStatus: "delivered",
      status: "completed"
    });

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

            <Text>{item.pickupAddress} → {item.deliveryAddress}</Text>

            <Text>Distance: {item.distance} km</Text>
            <Text>Amount: ₹{item.amount}</Text>

            <Text>Status: {item.deliveryStatus}</Text>

            {item.deliveryStatus !== "delivered" && (
              <TouchableOpacity
                onPress={() => markDelivered(item.id)}
                style={{
                  backgroundColor: "green",
                  padding: 8,
                  marginTop: 10,
                  borderRadius: 5
                }}
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
