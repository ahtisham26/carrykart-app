import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function HomeScreen({ user }) {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Welcome, {user.name}</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Your Orders</Text>
        <Text style={styles.text}>No orders yet</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Place Order</Text>
        <Text style={styles.text}>Coming soon...</Text>
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
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#1a1111",
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: "#800020",
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
