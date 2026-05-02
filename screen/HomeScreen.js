import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity
} from "react-native";

import { auth, db } from "../firebase/config";
import { signOut } from "firebase/auth";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot
} from "firebase/firestore";

export default function HomeScreen({ user }) {
  const [tab, setTab] = useState("home");

  const [orders, setOrders] = useState([]);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pickup, setPickup] = useState("");
  const [delivery, setDelivery] = useState("");
  const [area, setArea] = useState("");
  const [landmark, setLandmark] = useState("");

  // 💸 NEW
  const [distance, setDistance] = useState("");
  const [price, setPrice] = useState(0);

  // 🔥 REALTIME ORDERS
  useEffect(() => {
    const q = query(
      collection(db, "orders"),
      where("userEmail", "==", user.email)
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

  // 💸 AUTO PRICE CALCULATION
  useEffect(() => {
    if (!distance) {
      setPrice(0);
      return;
    }

    const total = 60 + (parseFloat(distance) * 10) + 20;
    setPrice(total);
  }, [distance]);

  // 🛒 PLACE ORDER
  const placeOrder = async () => {
    if (!name || !phone || !pickup || !delivery || !distance) {
      alert("Fill required fields");
      return;
    }

    await addDoc(collection(db, "orders"), {
      name,
      phone,
      pickupAddress: pickup,
      deliveryAddress: delivery,
      area,
      landmark,
      distance,
      price,
      userEmail: user.email,
      status: "pending",
      deliveryStatus: "waiting",
      createdAt: new Date()
    });

    // reset
    setName("");
    setPhone("");
    setPickup("");
    setDelivery("");
    setArea("");
    setLandmark("");
    setDistance("");
    setPrice(0);

    setTab("orders");
  };

  const logout = () => {
    signOut(auth);
  };

  return (
    <ScrollView style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.welcome}>
          Welcome, {user.email.split("@")[0]}
        </Text>

        <TouchableOpacity onPress={logout}>
          <Text style={styles.logout}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* HOME */}
      {tab === "home" && (
        <>
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => setTab("create")}
            >
              <Text style={styles.actionTitle}>Create Order</Text>
              <Text style={styles.actionSub}>Send a parcel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => setTab("orders")}
            >
              <Text style={styles.actionTitle}>My Orders</Text>
              <Text style={styles.actionSub}>Track orders</Text>
            </TouchableOpacity>
          </View>

          {/* RECENT */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Recent Orders</Text>

            {orders.length === 0 ? (
              <Text style={styles.empty}>No orders yet</Text>
            ) : (
              orders.slice(0, 3).map(order => (
                <View key={order.id} style={styles.orderCard}>
                  <Text style={styles.route}>
                    {order.pickupAddress} → {order.deliveryAddress}
                  </Text>
                  <Text style={styles.meta}>
                    Status: {order.status}
                  </Text>
                </View>
              ))
            )}
          </View>
        </>
      )}

      {/* CREATE ORDER */}
      {tab === "create" && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Create Order</Text>

          <TextInput placeholder="Full Name" style={styles.input} value={name} onChangeText={setName} />
          <TextInput placeholder="Phone" style={styles.input} value={phone} onChangeText={setPhone} />
          <TextInput placeholder="Pickup Address" style={styles.input} value={pickup} onChangeText={setPickup} />
          <TextInput placeholder="Delivery Address" style={styles.input} value={delivery} onChangeText={setDelivery} />
          <TextInput placeholder="Area" style={styles.input} value={area} onChangeText={setArea} />
          <TextInput placeholder="Landmark" style={styles.input} value={landmark} onChangeText={setLandmark} />

          {/* 💸 DISTANCE */}
          <TextInput
            placeholder="Distance (km)"
            style={styles.input}
            value={distance}
            onChangeText={setDistance}
            keyboardType="numeric"
          />

          {/* 💸 PRICE */}
          <Text style={styles.price}>
            Total Price: ₹{price}
          </Text>

          <TouchableOpacity style={styles.button} onPress={placeOrder}>
            <Text style={styles.buttonText}>PLACE ORDER</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* MY ORDERS */}
      {tab === "orders" && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>My Orders</Text>

          {orders.length === 0 ? (
            <Text style={styles.empty}>No orders</Text>
          ) : (
            orders.map(order => (
              <View key={order.id} style={styles.orderCard}>
                <Text style={styles.route}>
                  {order.pickupAddress} → {order.deliveryAddress}
                </Text>

                <Text style={styles.meta}>
                  Status: {order.status}
                </Text>

                {/* 💸 SHOW PRICE */}
                <Text style={styles.meta}>
                  Price: ₹{order.price}
                </Text>

                <Text style={styles.meta}>
                  Delivery: {order.deliveryStatus}
                </Text>
              </View>
            ))
          )}
        </View>
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
    marginBottom: 10,
    color: "#800020"
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

  empty: {
    color: "#888"
  }
});
