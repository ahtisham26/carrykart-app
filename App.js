import React, { useState } from "react";
import LoginScreen from "./screens/LoginScreen";

export default function App() {
  const [user, setUser] = useState(null);

  if (!user) {
    return <LoginScreen setUser={setUser} />;
  }

  return (
    <>
      {/* HOME SCREEN PLACEHOLDER */}
      <Text>Welcome to CarryKart 🚀</Text>
    </>
  );
}
