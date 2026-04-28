import React, { useEffect, useState } from "react";
import LoginScreen from "./screen/LoginScreen";
import SignupScreen from "./screen/SignupScreen";
import HomeScreen from "./screen/HomeScreen";
import AdminScreen from "./screen/AdminScreen";
import DeliveryScreen from "./screen/DeliveryScreen"; // 🆕 ADD

import { auth } from "./firebase/config";
import { onAuthStateChanged } from "firebase/auth";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [screen, setScreen] = useState("login");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {

        let role = "user";

        if (firebaseUser.email === "admin@gmail.com") {
          role = "admin";
        }

        if (firebaseUser.email === "boy@gmail.com") {
          role = "delivery";
        }

        setUser({
          email: firebaseUser.email,
          role: role
        });

      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) return null;

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

  if (user.role === "admin") return <AdminScreen user={user} />;
  if (user.role === "delivery") return <DeliveryScreen user={user} />; // 🆕

  return <HomeScreen user={user} />;
}
