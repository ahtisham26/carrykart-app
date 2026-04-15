import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { auth } from "../firebase/config";
import { signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";

export default function LoginScreen({ setUser }) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirm, setConfirm] = useState(null);

  // STEP 1: setup recaptcha (IMPORTANT FOR EXPO)
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
      });
    }
  };

  const sendOTP = async () => {
    try {
      setupRecaptcha();

      const appVerifier = window.recaptchaVerifier;

      const confirmation = await signInWithPhoneNumber(
        auth,
        "+91" + phone,
        appVerifier
      );

      setConfirm(confirmation);
      Alert.alert("OTP Sent");
    } catch (e) {
      Alert.alert(e.message);
    }
  };

  const verifyOTP = async () => {
    try {
      if (!confirm) {
        Alert.alert("Please send OTP first");
        return;
      }

      await confirm.confirm(otp);

      Alert.alert("Login Success");
      setUser(true);
    } catch (e) {
      Alert.alert("Wrong OTP");
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

      <TouchableOpacity
        onPress={sendOTP}
        style={{ backgroundColor: "black", padding: 15 }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>Send OTP</Text>
      </TouchableOpacity>

      <TextInput
        placeholder="OTP"
        keyboardType="number-pad"
        onChangeText={setOtp}
        style={{ borderWidth: 1, padding: 10, marginTop: 20 }}
      />

      <TouchableOpacity
        onPress={verifyOTP}
        style={{ backgroundColor: "green", padding: 15, marginTop: 10 }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>
          Verify OTP
        </Text>
      </TouchableOpacity>

      {/* Required hidden container for recaptcha */}
      <View id="recaptcha-container" />
    </View>
  );
}
