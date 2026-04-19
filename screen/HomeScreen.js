import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export default function HomeScreen({ user, logout, navigation }) {
  return (
    <View style={styles.container}>
      
      {/* HEADER */}
      <Text style={styles.title}>Welcome 👋</Text>
      <Text style={styles.subtitle}>
        {user?.name ? user.name : "User"}
      </Text>

      {/* MY ORDERS */}
      <View style={styles.btnBox}>
        <Button
          title="📦 My Orders"
          onPress={() => navigation.navigate("MyOrders")}
        />
      </View>

      {/* CREATE ORDER */}
      <View style={styles.btnBox}>
        <Button
          title="➕ Create Order"
          onPress={() => navigation.navigate("CreateOrder")}
        />
      </View>

      {/* LOGOUT */}
      <View style={styles.logoutBox}>
        <Button title="🚪 Logout" color="red" onPress={logout} />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 40,
    color: "gray",
  },

  btnBox: {
    marginVertical: 10,
  },

  logoutBox: {
    marginTop: 40,
  },
});
