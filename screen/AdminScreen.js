import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { getOrders } from "../utils/orders";

export default function AdminScreen() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const data = await getOrders();
    setOrders(data);
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20 }}>Admin Dashboard</Text>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderWidth: 1, marginTop: 10 }}>
            <Text>Pickup: {item.pickup}</Text>
            <Text>Drop: {item.drop}</Text>
            <Text>User: {item.user}</Text>
          </View>
        )}
      />
    </View>
  );
}
