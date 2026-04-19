import React from "react";
import { View, Text, TouchableOpacity, ImageBackground } from "react-native";

export default function HomeScreen({ navigation, user }) {
  return (
    <ImageBackground
      source={{ uri: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6" }}
      style={{ flex: 1, justifyContent: "center", padding: 20 }}
    >
      <View style={{ backgroundColor: "rgba(0,0,0,0.6)", padding: 20, borderRadius: 20 }}>
        
        <Text style={{ color: "white", fontSize: 28, fontWeight: "bold" }}>
          🌺 CarryKart
        </Text>

        <Text style={{ color: "#ccc", marginTop: 5 }}>
          Welcome {user?.name}
        </Text>

        <TouchableOpacity
          onPress={() => navigation.navigate("CreateOrder")}
          style={{ marginTop: 20, backgroundColor: "#800020", padding: 15, borderRadius: 12 }}
        >
          <Text style={{ color: "white", textAlign: "center" }}>
            Create Order
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("MyOrders")}
          style={{ marginTop: 10, backgroundColor: "#1e293b", padding: 15, borderRadius: 12 }}
        >
          <Text style={{ color: "white", textAlign: "center" }}>
            My Orders
          </Text>
        </TouchableOpacity>

      </View>
    </ImageBackground>
  );
}
