import React, { useState, useEffect } from "react";
import LoginScreen from "./screen/LoginScreen";
import HomeScreen from "./screen/HomeScreen";
import * as Notifications from "expo-notifications";

export default function App() {
  const [user, setUser] = useState(null);

  if (!user) {
    return <LoginScreen setUser={setUser} />;
  }

  return <HomeScreen />;
}
