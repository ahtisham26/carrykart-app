import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";

import LoginScreen from "./screen/LoginScreen";
import SignupScreen from "./screen/SignupScreen";
import HomeScreen from "./screen/HomeScreen";
import AdminScreen from "./screen/AdminScreen";
import DeliveryScreen from "./screen/DeliveryScreen";

import { auth, db } from "./firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [screen, setScreen] = useState("login");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const ref = doc(db, "users", firebaseUser.email);
          const snap = await getDoc(ref);

          let role = "user";

          // 🔥 FORCE ADMIN (MAIN FIX)
          if (firebaseUser.email === "ahtishamulhaq087@gmail.com") {
            role = "admin";
          } 
          else if (snap.exists()) {
            role = snap.data().role;
          }

          setUser({
            email: firebaseUser.email,
            role: role
          });

        } catch (e) {
          console.log("Firestore error:", e);

          // fallback
          setUser({
            email: firebaseUser.email,
            role: "user"
          });
        }
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0f0a0a" }}>
        <Text style={{ color: "#fff" }}>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    if (screen === "login") {
      return (
        <LoginScreen
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
  if (user.role === "delivery") return <DeliveryScreen user={user} />;

  return <HomeScreen user={user} />;
}
