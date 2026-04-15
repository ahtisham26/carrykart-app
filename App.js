import React, { useState } from "react";
import LoginScreen from "./screen/LoginScreen";
import HomeScreen from "./screen/HomeScreen";
import AdminScreen from "./screen/AdminScreen";

export default function App() {
  const [user, setUser] = useState(null);

  if (!user) return <LoginScreen setUser={setUser} />;

  if (user.role === "admin") return <AdminScreen user={user} />;

  return <HomeScreen user={user} />;
}
