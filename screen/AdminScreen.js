import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function AdminScreen({ user }) {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Admin Panel</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Incoming Orders</Text>
        <Text style={styles.text}>No orders</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Manage Users</Text>
        <Text style={styles.text}>Coming soon</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0a0a",
    padding: 15,
  },
  title: {
    color: "#c9a227",
    fontSize: 26,
    marginBottom: 20,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#1a1111",
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    borderRightWidth: 4,
    borderRightColor: "#800020",
  },
  cardTitle: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 10,
  },
  text: {
    color: "#aaa",
  },
});
