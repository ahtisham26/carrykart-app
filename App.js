import React, { useEffect, useState } from "react";
import LoginScreen from "./screen/LoginScreen";
import SignupScreen from "./screen/SignupScreen";
import HomeScreen from "./screen/HomeScreen";
import AdminScreen from "./screen/AdminScreen";
import { auth } from "./firebase/config";
import { onAuthStateChanged } from "firebase/auth";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [screen, setScreen] = useState("login");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          email: user.email,
          role: user.email === "admin@gmail.com" ? "admin" : "user"
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // ⛔ loading state
  if (loading) return null;

  // ❌ not logged in
  if (!user) {
    if (screen === "login") {
      return (
        <LoginScreen
          setUser={setUser}
          goToSignup={() => setScreen("signup")}
        />
      );
    }

    return (
      <SignupScreen
        setUser={setUser}
        goToLogin={() => setScreen("login")}
      />
    );
  }

  // ✅ logged in
  if (user.role === "admin") return <AdminScreen user={user} />;

  return <HomeScreen user={user} />;
}
