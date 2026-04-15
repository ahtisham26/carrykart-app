import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { auth } from "../firebase/config";
import { signInWithPhoneNumber } from "firebase/auth";

export default function LoginScreen({ setUser }) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirm, setConfirm] = useState(null);

  const sendOTP = async () => {
    try {
      const confirmation = await signInWithPhoneNumber(auth, "+91" + phone);
      setConfirm(confirmation);
      alert("OTP Sent");
    } catch (e) {
      alert(e.message);
    }
  };

  const verifyOTP = async () => {
    try {
      await confirm.confirm(otp);
      alert("Login Success");
      setUser(true);
    } catch (e) {
      alert("Wrong OTP");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text style={{ fontSize: 26, marginBottom: 20 }}>CarryKart Login</Text>

      <TextInput
        placeholder="Phone Number"
        keyboardType="number-pad"
        onChangeText={setPhone}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />

      <TouchableOpacity onPress={sendOTP} style={{ backgroundColor: "black", padding: 15 }}>
        <Text style={{ color: "white", textAlign: "center" }}>Send OTP</Text>
      </TouchableOpacity>

      <TextInput
        placeholder="OTP"
        keyboardType="number-pad"
        onChangeText={setOtp}
        style={{ borderWidth: 1, padding: 10, marginTop: 20 }}
      />

      <TouchableOpacity onPress={verifyOTP} style={{ backgroundColor: "green", padding: 15, marginTop: 10 }}>
        <Text style={{ color: "white", textAlign: "center" }}>Verify OTP</Text>
      </TouchableOpacity>
    </View>
  );
}
