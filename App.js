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
      try {
        if (firebaseUser) {
          const userRef = doc(db, "users", firebaseUser.email);
          const userSnap = await getDoc(userRef);

          let role = "user";

          if (userSnap.exists()) {
            role = userSnap.data().role;
          }

          setUser({
            email: firebaseUser.email,
            role: role
          });
        } else {
          setUser(null);
        }
      } catch (e) {
        console.log("ERROR:", e);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // 🔥 FIX: loading UI instead of blank
  if (loading) {
    return (
      <View style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0f0a0a"
      }}>
        <Text style={{ color: "#c9a227", fontSize: 18 }}>
          Loading...
        </Text>
      </View>
    );
  }

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
  if (user.role === "delivery") return <DeliveryScreen user={user} />;

  return <HomeScreen user={user} />;
}
