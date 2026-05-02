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

  // 🔥 REALTIME ORDERS
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "orders"), (snapshot) => {
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // ❗ remove delivered orders
      const activeOrders = list.filter(
        o => o.status !== "completed"
      );

      setOrders(activeOrders);
    });

    return unsubscribe;
  }, []);

  // ✅ ACCEPT
  const acceptOrder = async (id) => {
    await updateDoc(doc(db, "orders", id), {
      status: "accepted"
    });
  };

  // ❌ REJECT
  const rejectOrder = async (id) => {
    await updateDoc(doc(db, "orders", id), {
      status: "rejected"
    });
  };

  // 🚚 ASSIGN DELIVERY BOY
  const assignOrder = async (id) => {
    await updateDoc(doc(db, "orders", id), {
      assignedTo: "delivery@gmail.com", // change later dynamically
      deliveryStatus: "assigned"
    });
  };

  // 🚪 LOGOUT
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

      {/* ORDERS */}
      {orders.length === 0 ? (
        <Text style={styles.empty}>No active orders</Text>
      ) : (
        orders.map(order => (
          <View key={order.id} style={styles.card}>

            <Text style={styles.orderId}>
              Order ID: {order.id}
            </Text>

            <Text style={styles.text}>
              Name: {order.name}
            </Text>

            <Text style={styles.text}>
              Phone: {order.phone}
            </Text>

            <Text style={styles.text}>
              From: {order.pickupAddress}
            </Text>

            <Text style={styles.text}>
              To: {order.deliveryAddress}
            </Text>

            <Text style={styles.text}>
              Area: {order.area}
            </Text>

            <Text style={styles.status}>
              Status: {order.status}
            </Text>

            <Text style={styles.text}>
              Assigned: {order.assignedTo || "none"}
            </Text>

            {/* ACTION BUTTONS */}
            <View style={styles.buttons}>
              
              <TouchableOpacity
                style={styles.accept}
                onPress={() => acceptOrder(order.id)}
              >
                <Text style={styles.btnText}>Accept</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.reject}
                onPress={() => rejectOrder(order.id)}
              >
                <Text style={styles.btnText}>Reject</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.assign}
                onPress={() => assignOrder(order.id)}
              >
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

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 3
  },

  orderId: {
    fontWeight: "bold",
    marginBottom: 5
  },

  text: {
    color: "#444",
    marginTop: 3
  },

  status: {
    marginTop: 5,
    fontWeight: "bold",
    color: "#800020"
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
    textAlign: "center",
    color: "#888"
  }
});
