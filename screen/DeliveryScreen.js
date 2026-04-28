import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity
} from "react-native";

import { db } from "../firebase/config";
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc
} from "firebase/firestore";

export default function DeliveryScreen({ user }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
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
  }, []);

  const markDelivered = async (id) => {
    await updateDoc(doc(db, "orders", id), {
      deliveryStatus: "delivered",
      status: "completed"
    });
  };

  return (
    <View style={{ padding: 20 }}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 15 }}>

            <Text>
              {item.pickupAddress} → {item.deliveryAddress}
            </Text>

            <Text>
              Status: {item.deliveryStatus}
            </Text>

            {/* 🔥 FIX: hide after delivered */}
            {item.deliveryStatus !== "delivered" && (
              <TouchableOpacity
                onPress={() => markDelivered(item.id)}
              >
                <Text style={{ color: "green" }}>
                  Mark Delivered
                </Text>
              </TouchableOpacity>
            )}

          </View>
        )}
      />
    </View>
  );
}
