import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./screens/HomeScreen";
import CreateOrderScreen from "./screens/CreateOrderScreen";
import MyOrders from "./screens/MyOrders";
import AdminScreen from "./screens/AdminScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: "#800020" },
          headerTintColor: "white",
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="CreateOrder" component={CreateOrderScreen} />
        <Stack.Screen name="MyOrders" component={MyOrders} />
        <Stack.Screen name="Admin" component={AdminScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
