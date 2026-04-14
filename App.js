import React, { useState, useEffect } from "react";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import * as Notifications from "expo-notifications";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    Notifications.requestPermissionsAsync();
  }, []);

  if (!user) {
    return <LoginScreen setUser={setUser} />;
  }

  return <HomeScreen />;
}
