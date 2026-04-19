import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import LoginScreen from "./screen/LoginScreen";
import HomeScreen from "./screen/HomeScreen";
import AdminScreen from "./screen/AdminScreen";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 AUTO LOGIN CHECK
  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
    try {
      const savedUser = await AsyncStorage.getItem("user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  // 🔥 LOGIN FUNCTION
  const handleLogin = async (userData) => {
    setUser(userData);
    await AsyncStorage.setItem("user", JSON.stringify(userData));
  };

  // 🔥 LOGOUT FUNCTION
  const handleLogout = async () => {
    setUser(null);
    await AsyncStorage.removeItem("user");
  };

  if (loading) return null;

  if (!user) return <LoginScreen setUser={handleLogin} />;

  if (user.role === "admin")
    return <AdminScreen user={user} logout={handleLogout} />;

  return <HomeScreen user={user} logout={handleLogout} />;
}
