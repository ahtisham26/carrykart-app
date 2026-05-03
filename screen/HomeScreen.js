import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import { auth } from "../firebase/config";
import { signOut } from "firebase/auth";

export default function HomeScreen({ user }) {
  const logout = () => signOut(auth);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CarryKart</Text>

      <View style={styles.card}>
        <Text style={styles.welcome}>Welcome</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.info}>📦 Create orders from Add tab</Text>
        <Text style={styles.info}>🛒 View orders in Cart tab</Text>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f6fa"
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#800020",
    marginBottom: 20
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    marginBottom: 15,
    elevation: 4
  },
  welcome: {
    fontSize: 20,
    fontWeight: "bold"
  },
  email: {
    color: "gray",
    marginTop: 8
  },
  info: {
    fontSize: 16,
    marginBottom: 8
  },
  logoutBtn: {
    backgroundColor: "#800020",
    padding: 15,
    borderRadius: 14,
    alignItems: "center"
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold"
  }
});
