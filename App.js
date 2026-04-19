import React, { useEffect, useState } from "react";

// ❌ AsyncStorage removed (error fix)
 // import AsyncStorage from "@react-native-async-storage/async-storage";

import LoginScreen from "./screen/LoginScreen";
import HomeScreen from "./screen/HomeScreen";
import { View, ActivityIndicator } from "react-native";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // temporary mock loading fix (no AsyncStorage)
    setTimeout(() => {
      setUser(null);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return user ? <HomeScreen /> : <LoginScreen />;
}
