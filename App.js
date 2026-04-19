import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

import LoginScreen from "./screen/LoginScreen";
import HomeScreen from "./screen/HomeScreen";
import AdminScreen from "./screen/AdminScreen";
import CreateOrderScreen from "./screen/CreateOrderScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const saved = await AsyncStorage.getItem("user");
      if (saved) setUser(JSON.parse(saved));
      setLoading(false);
    };
    loadUser();
  }, []);

  const loginUser = async (data) => {
    setUser(data);
    await AsyncStorage.setItem("user", JSON.stringify(data));
  };

  const logoutUser = async () => {
    setUser(null);
    await AsyncStorage.removeItem("user");
  };

  if (loading) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!user ? (
          <Stack.Screen name="Login">
            {(props) => <LoginScreen {...props} setUser={loginUser} />}
          </Stack.Screen>
        ) : user.role === "admin" ? (
          <Stack.Screen name="Admin">
            {(props) => (
              <AdminScreen {...props} user={user} logout={logoutUser} />
            )}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen name="Home">
              {(props) => (
                <HomeScreen {...props} user={user} logout={logoutUser} />
              )}
            </Stack.Screen>

            <Stack.Screen
              name="CreateOrder"
              component={CreateOrderScreen}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
