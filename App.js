import React, { useEffect, useState } from "react";
import LoginScreen from "./screen/LoginScreen";
import HomeScreen from "./screen/HomeScreen";
import AdminScreen from "./screen/AdminScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, ActivityIndicator } from "react-native";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // AUTO LOGIN
  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const savedUser = await AsyncStorage.getItem("user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  // LOGIN HANDLER
  const handleLogin = async (userData) => {
    setUser(userData);
    await AsyncStorage.setItem("user", JSON.stringify(userData));
  };

  // LOGOUT
  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem("user");
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#800020" />
      </View>
    );
  }

  if (!user) {
    return <LoginScreen setUser={handleLogin} />;
  }

  if (user.role === "admin") {
    return <AdminScreen user={user} logout={logout} />;
  }

  return <HomeScreen user={user} logout={logout} />;
}
