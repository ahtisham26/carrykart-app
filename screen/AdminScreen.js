import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet
} from "react-native";

import { auth, db } from "../firebase/config";
import { signOut } from "firebase/auth";

import {
  collection,
  onSnapshot,
  updateDoc,
  doc
} from "firebase/firestore";

export default function AdminScreen({ user }) {
  const [orders, setOrders] = useState([]);

  // 💸 STATS
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [completedOrders, setCompletedOrders] = useState(0);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "orders"), (snapshot) => {
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setOrders(list);

      // 💸 CALCULATIONS
      let earnings = 0;
      let pending = 0;
      let completed = 0;

      list.forEach(order => {
        if (order.status === "completed") {
          earnings += order.price || 0;
          completed++;
        } else {
          pending++;
        }
      });

      setTotalEarnings(earnings);
      setTotalOrders(list.length);
      setPendingOrders(pending);
      setCompletedOrders(completed);
    });

    return unsubscribe;
  }, []);

  // ACTIONS
  const acceptOrder = async (id) => {
    await updateDoc(doc(db, "orders", id), {
      status: "accepted"
    });
  };

  const rejectOrder = async (id) => {
    await updateDoc(doc(db, "orders", id), {
      status: "rejected"
    });
  };

  const assignOrder = async (id) => {
    await updateDoc(doc(db, "orders", id), {
      assignedTo: "delivery@gmail.com",
      deliveryStatus: "assigned"
    });
  };

  const logout = () => {
    signOut(auth);
  };

  return (
    <ScrollView style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <TouchableOpacity onPress={logout}>
          <Text style={styles.logout}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* 💸 STATS CARDS */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>₹{totalEarnings}</Text>
          <Text style={styles.statLabel}>Earnings</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>{totalOrders}</Text>
          <Text style={styles.statLabel}>Orders</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{pendingOrders}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>{completedOrders}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
      </View>

      {/* ORDERS */}
      <Text style={styles.section}>All Orders</Text>

      {orders.length === 0 ? (
        <Text style={styles.empty}>No orders</Text>
      ) : (
        orders.map(order => (
          <View key={order.id} style={styles.card}>

            <Text style={styles.route}>
              {order.pickupAddress} → {order.deliveryAddress}
            </Text>

            <Text style={styles.meta}>Name: {order.name}</Text>
            <Text style={styles.meta}>Phone: {order.phone}</Text>

            {/* 💸 PRICE */}
            <Text style={styles.price}>
              ₹{order.price}
            </Text>

            <Text style={styles.status}>
              Status: {order.status}
            </Text>

            <Text style={styles.meta}>
              Assigned: {order.assignedTo || "none"}
            </Text>

            {/* BUTTONS */}
            <View style={styles.buttons}>
              <TouchableOpacity style={styles.accept} onPress={() => acceptOrder(order.id)}>
                <Text style={styles.btnText}>Accept</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.reject} onPress={() => rejectOrder(order.id)}>
                <Text style={styles.btnText}>Reject</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.assign} onPress={() => assignOrder(order.id)}>
                <Text style={styles.btnText}>Assign</Text>
              </TouchableOpacity>
            </View>

          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fb",
    padding: 15
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20
  },

  title: {
    fontSize: 22,
    fontWeight: "bold"
  },

  logout: {
    color: "#800020",
    fontWeight: "bold"
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10
  },

  statCard: {
    backgroundColor: "#fff",
    width: "48%",
    padding: 20,
    borderRadius: 15,
    elevation: 3,
    alignItems: "center"
  },

  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#800020"
  },

  statLabel: {
    color: "#888",
    marginTop: 5
  },

  section: {
    marginTop: 15,
    fontSize: 18,
    fontWeight: "bold"
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    marginTop: 10,
    elevation: 3
  },

  route: {
    fontWeight: "bold"
  },

  meta: {
    color: "#555",
    marginTop: 3
  },

  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#800020",
    marginTop: 5
  },

  status: {
    marginTop: 5,
    fontWeight: "bold"
  },

  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10
  },

  accept: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 8
  },

  reject: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 8
  },

  assign: {
    backgroundColor: "#800020",
    padding: 10,
    borderRadius: 8
  },

  btnText: {
    color: "#fff",
    fontWeight: "bold"
  },

  empty: {
    color: "#888",
    textAlign: "center"
  }
});
