  import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { db } from "../firebase/config";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

export default function AdminDashboard() {
  const [email, setEmail] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    remaining: 0,
    earnings: 0,
  });

  const fetchStats = async () => {
    const snap = await getDocs(collection(db, "orders"));

    let total = snap.size;
    let completed = 0;
    let earnings = 0;

    snap.forEach((d) => {
      const data = d.data();
      if (data.status === "completed") {
        completed++;
        earnings += data.price || 0;
      }
    });

    setStats({
      total,
      completed,
      remaining: total - completed,
      earnings,
    });
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // 📦 Assign by email (OLD STYLE)
  const assignOrder = async () => {
    if (!email) {
      Alert.alert("Enter delivery boy email");
      return;
    }

    try {
      const orderRef = doc(db, "orders", "CURRENT_ORDER_ID"); // replace dynamic id
      await updateDoc(orderRef, {
        assignedTo: email,
        status: "assigned",
      });

      Alert.alert("Assigned", `Order assigned to ${email}`);
      setEmail("");
      fetchStats();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>

      {/* 📊 STATS */}
      <View style={styles.card}>
        <Text>Total Orders: {stats.total}</Text>
        <Text>Completed: {stats.completed}</Text>
        <Text>Remaining: {stats.remaining}</Text>
        <Text style={styles.earnings}>Earnings: ₹{stats.earnings}</Text>
      </View>

      {/* 📧 EMAIL INPUT */}
      <TextInput
        placeholder="Enter delivery boy email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      {/* 📌 ASSIGN BUTTON */}
      <TouchableOpacity style={styles.button} onPress={assignOrder}>
        <Text style={styles.buttonText}>ASSIGN ORDER</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f5f6fa",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3,
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  earnings: {
    marginTop: 5,
    fontWeight: "bold",
    color: "green",
  },
});  
