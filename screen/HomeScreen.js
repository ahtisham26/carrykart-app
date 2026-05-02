import React, { useState, useEffect } from "react";
import {
  View, Text, StyleSheet, ScrollView,
  TextInput, TouchableOpacity
} from "react-native";

import { auth, db } from "../firebase/config";
import { signOut } from "firebase/auth";
import {
  collection, addDoc, query,
  where, onSnapshot
} from "firebase/firestore";

export default function HomeScreen({ user }) {

  const [orders, setOrders] = useState([]);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pickup, setPickup] = useState("");
  const [delivery, setDelivery] = useState("");
  const [distance, setDistance] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [showOrders, setShowOrders] = useState(true);

  // 🔥 REALTIME ORDERS
  useEffect(() => {
    if (!user?.email) return;

    const q = query(
      collection(db, "orders"),
      where("userEmail", "==", user.email)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      .filter(item => item.deliveryStatus !== "delivered"); // clean UI

      setOrders(list);
    });

    return unsubscribe;
  }, [user]);

  // 💰 PRICE LOGIC
  const calculatePrice = () => {
    const d = parseFloat(distance) || 0;
    return 80 + (d * 10);
  };

  // 🛒 PLACE ORDER
  const placeOrder = async () => {
    if (!name || !phone || !pickup || !delivery || !distance) {
      alert("Fill all fields");
      return;
    }

    await addDoc(collection(db, "orders"), {
      name,
      phone,
      pickupAddress: pickup,
      deliveryAddress: delivery,
      distance: parseFloat(distance),
      amount: calculatePrice(),

      userEmail: user.email,
      status: "pending",
      deliveryStatus: "pending",
      assignedTo: "",

      createdAt: new Date()
    });

    setName("");
    setPhone("");
    setPickup("");
    setDelivery("");
    setDistance("");

    setShowForm(false);
    setShowOrders(true);
  };

  const logout = () => signOut(auth);

  return (
    <ScrollView style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.welcome}>
          Hi, {user.email.split("@")[0]} 👋
        </Text>

        <TouchableOpacity onPress={logout}>
          <Text style={styles.logout}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* ACTIONS */}
      <View style={styles.actions}>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => {
            setShowForm(true);
            setShowOrders(false);
          }}
        >
          <Text style={styles.actionTitle}>Create Order</Text>
          <Text style={styles.actionSub}>Place new delivery</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => {
            setShowForm(false);
            setShowOrders(true);
          }}
        >
          <Text style={styles.actionTitle}>My Orders</Text>
          <Text style={styles.actionSub}>Track deliveries</Text>
        </TouchableOpacity>

      </View>

      {/* FORM */}
      {showForm && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>New Order</Text>

          <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName}/>
          <TextInput style={styles.input} placeholder="Phone" value={phone} onChangeText={setPhone}/>
          <TextInput style={styles.input} placeholder="Pickup" value={pickup} onChangeText={setPickup}/>
          <TextInput style={styles.input} placeholder="Delivery" value={delivery} onChangeText={setDelivery}/>
          <TextInput style={styles.input} placeholder="Distance (km)" value={distance} onChangeText={setDistance}/>

          <Text style={styles.price}>
            Total: ₹{calculatePrice()}
          </Text>

          <TouchableOpacity style={styles.button} onPress={placeOrder}>
            <Text style={styles.buttonText}>Place Order</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ORDERS */}
      {showOrders && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Active Orders</Text>

          {orders.length === 0 ? (
            <Text style={styles.empty}>No orders yet</Text>
          ) : (
            orders.map(order => (
              <View key={order.id} style={styles.orderCard}>
                <Text style={styles.route}>
                  {order.pickupAddress} → {order.deliveryAddress}
                </Text>

                <Text style={styles.meta}>
                  ₹{order.amount} • {order.distance} km
                </Text>

                <Text style={styles.status}>
                  {order.deliveryStatus}
                </Text>
              </View>
            ))
          )}
        </View>
      )}

    </ScrollView>
  );
}

// 🎨 STYLES
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

  welcome: {
    fontSize: 22,
    fontWeight: "bold"
  },

  logout: {
    color: "#800020",
    fontWeight: "bold"
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between"
  },

  actionCard: {
    backgroundColor: "#fff",
    width: "48%",
    padding: 20,
    borderRadius: 15,
    elevation: 3
  },

  actionTitle: {
    fontSize: 16,
    fontWeight: "bold"
  },

  actionSub: {
    color: "#888",
    marginTop: 5
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    marginTop: 20,
    elevation: 3
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10
  },

  button: {
    backgroundColor: "#800020",
    padding: 15,
    borderRadius: 10,
    alignItems: "center"
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold"
  },

  price: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10
  },

  orderCard: {
    backgroundColor: "#f1f1f1",
    padding: 15,
    borderRadius: 10,
    marginTop: 10
  },

  route: {
    fontWeight: "bold"
  },

  meta: {
    color: "#666",
    marginTop: 3
  },

  status: {
    marginTop: 5,
    color: "#800020",
    fontWeight: "bold"
  },

  empty: {
    color: "#888"
  }
});
