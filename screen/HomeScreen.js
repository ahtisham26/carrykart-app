import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>

      <Text style={styles.title}>Dashboard</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Total Orders</Text>
        <Text style={styles.value}>12</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Earnings</Text>
        <Text style={styles.value}>₹2400</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Pending</Text>
        <Text style={styles.value}>5</Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f2f2f2" },

  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },

  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 5,
  },

  cardTitle: { fontSize: 16, color: "gray" },
  value: { fontSize: 22, fontWeight: "bold", marginTop: 5 },
});
