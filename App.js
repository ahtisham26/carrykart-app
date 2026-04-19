import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import LoginScreen from "./screen/LoginScreen";
import HomeScreen from "./screen/HomeScreen";
import AdminScreen from "./screen/AdminScreen";
import CreateOrder from "./screen/CreateOrder";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [screen, setScreen] = useState("home"); 
  // screens: home | createOrder

  useEffect(() => {
    const loadUser = async () => {
      const saved = await AsyncStorage.getItem("user");
      if (saved) setUser(JSON.parse(saved));
      setLoading(false);
    };
    loadUser();
  }, []);

  const handleLogin = async (data) => {
    setUser(data);
    await AsyncStorage.setItem("user", JSON.stringify(data));
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem("user");
    setScreen("home");
  };

  if (loading) return null;

  if (!user) return <LoginScreen setUser={handleLogin} />;

  // ADMIN
  if (user.role === "admin")
    return <AdminScreen user={user} logout={logout} />;

  // SIMPLE SCREEN SWITCHING
  if (screen === "createOrder")
    return (
      <CreateOrder
        user={user}
        goHome={() => setScreen("home")}
      />
    );

  return (
    <HomeScreen
      user={user}
      logout={logout}
      goCreateOrder={() => setScreen("createOrder")}
    />
  );
}
