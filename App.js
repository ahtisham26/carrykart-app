import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoginScreen from "./screen/LoginScreen";
import HomeScreen from "./screen/HomeScreen";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const data = await AsyncStorage.getItem("user");
    if (data) setUser(JSON.parse(data));
    setLoading(false);
  };

  const login = async (userData) => {
    await AsyncStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = async () => {
    await AsyncStorage.removeItem("user");
    setUser(null);
  };

  if (loading) return null;

  if (!user) {
    return <LoginScreen setUser={login} />;
  }

  return <HomeScreen user={user} logout={logout} />;
}
