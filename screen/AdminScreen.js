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
  doc,
  updateDoc
} from "firebase/firestore";

export default function AdminScreen() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "orders"), (snap) => {
      setOrders(
        snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    });
    return unsub;
  }, []);

  const acceptOrder = async (id) => {
    await updateDoc(doc(db, "orders", id), {
      status: "accepted",
    });
  };

  const rejectOrder = async (id) => {
    await updateDoc(doc(db, "orders", id), {
      status: "rejected",
    });
  };

  const markPaid = async (id) => {
    await updateDoc(doc(db, "orders", id), {
      payment: "paid",
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#0f172a", padding: 20 }}>
      <Text style={{ fontSize: 22, color: "white", marginBottom: 10 }}>
        Admin Dashboard
      </Text>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: "#1e293b",
              padding: 15,
              borderRadius: 12,
              marginBottom: 10,
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>
              {item.name}
            </Text>

            <Text style={{ color: "#94a3b8" }}>
              {item.phone}
            </Text>

            <Text style={{ color: "#94a3b8" }}>
              {item.pickupAddress} → {item.dropAddress}
            </Text>

            <Text style={{ color: "#22c55e", fontWeight: "bold" }}>
              ₹ {item.price}
            </Text>

            <Text style={{ color: "yellow" }}>
              Status: {item.status}
            </Text>

            <Text style={{ color: "orange" }}>
              Payment: {item.payment}
            </Text>

            {/* ACTION BUTTONS */}
            {item.status === "pending" && (
              <View style={{ flexDirection: "row", marginTop: 10 }}>
                <TouchableOpacity
                  onPress={() => acceptOrder(item.id)}
                  style={{
                    backgroundColor: "green",
                    padding: 10,
                    borderRadius: 8,
                    marginRight: 10,
                  }}
                >
                  <Text style={{ color: "white" }}>Accept</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => rejectOrder(item.id)}
                  style={{
                    backgroundColor: "red",
                    padding: 10,
                    borderRadius: 8,
                  }}
                >
                  <Text style={{ color: "white" }}>Reject</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* PAYMENT BUTTON */}
            {item.payment === "unpaid" && item.status === "accepted" && (
              <TouchableOpacity
                onPress={() => markPaid(item.id)}
                style={{
                  backgroundColor: "#22c55e",
                  padding: 10,
                  borderRadius: 8,
                  marginTop: 10,
                }}
              >
                <Text style={{ color: "white", textAlign: "center" }}>
                  Mark as Paid
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />
    </View>
  );
}
