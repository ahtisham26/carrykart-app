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
  onSnapshot,
  updateDoc,
  doc
} from "firebase/firestore";

export default function AdminScreen() {
  const [orders, setOrders] = useState([]);

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

  return (
    <View style={{ padding: 20 }}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 15 }}>
            <Text>{item.item} ({item.userEmail})</Text>

            <TouchableOpacity onPress={() => updateStatus(item.id, "accepted")}>
              <Text style={{ color: "green" }}>Accept</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => updateStatus(item.id, "rejected")}>
              <Text style={{ color: "red" }}>Reject</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
