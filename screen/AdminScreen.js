import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet
} from "react-native";

import { db } from "../firebase/config";
import {
  collection,
  onSnapshot,
  updateDoc,
  doc
} from "firebase/firestore";

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [emails, setEmails] = useState({});
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    earnings: 0
  });

  // 📦 FETCH + CALCULATE STATS
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "orders"), (snapshot) => {
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setOrders(list);

      // 🔥 CALCULATE STATS
      let total = list.length;
      let completed = 0;
      let earnings = 0;

      list.forEach(order => {
        if (order.status === "completed") {
          completed++;
          earnings += order.price || 0;
        }
      });

      setStats({
        total,
        completed,
        pending: total - completed,
        earnings
      });
    });

    return unsubscribe;
  }, []);

  // ✉️ EMAIL INPUT
  const handleEmailChange = (id, value) => {
    setEmails({ ...emails, [id]: value });
  };

  // 📌 ASSIGN
  const assignOrder = async (orderId) => {
    const email = emails[orderId];

    if (!email) return alert("Enter email");

    await updateDoc(doc(db, "orders", orderId), {
      assignedTo: email,
      status: "assigned"
    });
  };

  // ✅ MARK COMPLETE
  const markComplete = async (orderId) => {
    await updateDoc(doc(db, "orders", orderId), {
      status: "completed"
    });
  };

  return (
    <View style={{ flex: 1 }}>

      {/* 🔥 STATS */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text>Total</Text>
          <Text style={styles.big}>{stats.total}</Text>
        </View>

        <View style={styles.statCard}>
          <Text>Completed</Text>
          <Text style={styles.big}>{stats.completed}</Text>
        </View>

        <View style={styles.statCard}>
          <Text>Pending</Text>
          <Text style={styles.big}>{stats.pending}</Text>
        </View>

        <View style={styles.statCard}>
          <Text>Earnings</Text>
          <Text style={styles.big}>₹{stats.earnings}</Text>
        </View>
      </View>

      {/* 📦 ORDERS */}
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        style={{ padding: 10 }}
        renderItem={({ item }) => (
          <View style={styles.card}>

            <Text style={styles.name}>{item.name}</Text>
            <Text>📞 {item.phone}</Text>
            <Text>📍 {item.pickupAddress}</Text>
            <Text>➡️ {item.deliveryAddress}</Text>
            <Text>🚚 {item.distance} km</Text>
            <Text style={styles.price}>₹ {item.price}</Text>
            <Text>Status: {item.status}</Text>

            {/* EMAIL */}
            <TextInput
              placeholder="Delivery boy email"
              style={styles.input}
              value={emails[item.id] || ""}
              onChangeText={(text) =>
                handleEmailChange(item.id, text)
              }
            />

            {/* BUTTONS */}
            <View style={{ flexDirection: "row", gap: 10 }}>

              <TouchableOpacity
                style={styles.assignBtn}
                onPress={() => assignOrder(item.id)}
              >
                <Text style={styles.btnText}>Assign</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.completeBtn}
                onPress={() => markComplete(item.id)}
              >
                <Text style={styles.btnText}>Done</Text>
              </TouchableOpacity>

            </View>

          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    padding: 10
  },

  statCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    width: "45%",
    marginBottom: 10,
    elevation: 3
  },

  big: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 5
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    elevation: 4
  },

  name: {
    fontSize: 16,
    fontWeight: "bold"
  },

  price: {
    fontWeight: "bold",
    marginTop: 5
  },

  input: {
    borderWidth: 1,
    padding: 10,
    marginTop: 10,
    borderRadius: 10
  },

  assignBtn: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 10,
    marginTop: 10
  },

  completeBtn: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 10,
    marginTop: 10
  },

  btnText: {
    color: "#fff",
    fontWeight: "bold"
  }
});
