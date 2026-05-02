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
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [openAssignId, setOpenAssignId] = useState(null);

  const [totalEarnings, setTotalEarnings] = useState(0);

  // 🔥 FETCH ORDERS
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "orders"), (snap) => {
      const list = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setOrders(list);

      // 💸 earnings calc
      let total = 0;
      list.forEach(o => {
        if (o.status === "completed") {
          total += o.price || 0;
        }
      });

      setTotalEarnings(total);
    });

    return unsub;
  }, []);

  // 🚚 FETCH DELIVERY BOYS
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "deliveryBoys"), (snap) => {
      const list = snap.docs.map(doc => doc.data());
      setDeliveryBoys(list);
    });

    return unsub;
  }, []);

  // ✅ ASSIGN
  const assignOrder = async (orderId, email) => {
    await updateDoc(doc(db, "orders", orderId), {
      assignedTo: email,
      deliveryStatus: "assigned"
    });

    setOpenAssignId(null);
  };

  // ✅ ACCEPT / REJECT
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

  const logout = () => signOut(auth);

  return (
    <ScrollView style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <TouchableOpacity onPress={logout}>
          <Text style={styles.logout}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* 💸 EARNINGS */}
      <View style={styles.card}>
        <Text style={styles.big}>₹{totalEarnings}</Text>
        <Text>Total Earnings</Text>
      </View>

      {/* ORDERS */}
      {orders.map(order => (
        <View key={order.id} style={styles.orderCard}>

          <Text style={styles.route}>
            {order.pickupAddress} → {order.deliveryAddress}
          </Text>

          <Text>Name: {order.name}</Text>
          <Text>Phone: {order.phone}</Text>

          <Text style={styles.price}>₹{order.price}</Text>

          <Text>Status: {order.status}</Text>
          <Text>Assigned: {order.assignedTo || "none"}</Text>

          {/* ACTION BUTTONS */}
          <View style={styles.row}>
            <TouchableOpacity style={styles.accept} onPress={() => acceptOrder(order.id)}>
              <Text style={styles.btn}>Accept</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.reject} onPress={() => rejectOrder(order.id)}>
              <Text style={styles.btn}>Reject</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.assign}
              onPress={() =>
                setOpenAssignId(openAssignId === order.id ? null : order.id)
              }
            >
              <Text style={styles.btn}>Assign</Text>
            </TouchableOpacity>
          </View>

          {/* 👇 DELIVERY BOYS LIST */}
          {openAssignId === order.id && (
            <View style={styles.dropdown}>
              {deliveryBoys.map(boy => (
                <TouchableOpacity
                  key={boy.email}
                  style={styles.dropdownItem}
                  onPress={() => assignOrder(order.id, boy.email)}
                >
                  <Text>{boy.name} ({boy.email})</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

        </View>
      ))}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6fb",
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
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 20,
    elevation: 4
  },

  big: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#800020"
  },

  orderCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 3
  },

  route: {
    fontWeight: "bold"
  },

  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#800020"
  },

  row: {
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

  btn: {
    color: "#fff",
    fontWeight: "bold"
  },

  dropdown: {
    backgroundColor: "#fff",
    marginTop: 10,
    borderRadius: 10,
    padding: 10,
    elevation: 5
  },

  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#eee"
  }
});
