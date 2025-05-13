import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Ionicons } from "@expo/vector-icons";

const SignInScreen = () => {
  const [nationalId, setNationalId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!nationalId || !password) {
      Alert.alert("Error", "กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    try {
      // เรียกใช้ API Login
      const response = await axios.post("http://192.168.110.193:5062/Tokens", {
        nationalId,
        password,
      });

      // บันทึก tokenลงใน Secure Storage
      await SecureStore.setItemAsync("token", response.data.token);

      navigation.navigate("MainDrawer");
    } catch (error) {
      let errorMessage = "เกิดข้อผิดพลาดในการเชื่อมต่อ";

      // จัดการ Error ตามสถานการณ์ต่างๆ
      if (error.response) {
        errorMessage = error.response.data?.message || "ล็อกอินไม่สำเร็จ";
      } else if (error.request) {
        errorMessage = "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้";
        console.log("📡 No response received. Request was:", error.request);
      }

      Alert.alert("ข้อผิดพลาด", errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>เข้าสู่ระบบ</Text>

      {/* เลขประจำตัวประชาชน */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>เลขประจำตัวประชาชน</Text>
        <TextInput
          placeholder="กรอกเลขประจำตัวประชาชน 13 หลัก"
          placeholderTextColor="#999"
          value={nationalId}
          onChangeText={setNationalId}
          style={styles.input}
          keyboardType="numeric"
          maxLength={13}
        />
      </View>

      {/* รหัสผ่าน */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>รหัสผ่าน</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="กรอกรหัสผ่าน"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            style={[styles.input, { flex: 1 }]}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={24}
              color="#666"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* ปุ่มเข้าสู่ระบบ */}
      <TouchableOpacity 
        onPress={handleLogin}
        style={styles.loginButton}
      >
        <Text style={styles.buttonText}>เข้าสู่ระบบ</Text>
      </TouchableOpacity>

      {/* ลิงก์ลงทะเบียน */}
      <TouchableOpacity
        onPress={() => navigation.navigate("SignUp")}
        style={styles.registerLink}
      >
        <Text style={styles.registerText}>
          ยังไม่มีบัญชี? <Text style={styles.registerHighlight}>ลงทะเบียนที่นี่</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 40,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#34495e",
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    padding: Platform.OS === "ios" ? 16 : 14,
    fontSize: 16,
    color: "#2c3e50",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  eyeIcon: {
    position: "absolute",
    right: 15,
    padding: 10,
  },
  loginButton: {
    backgroundColor: "#3498db",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    marginTop: 30,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  registerLink: {
    marginTop: 25,
    alignItems: "center",
  },
  registerText: {
    color: "#7f8c8d",
    fontSize: 14,
  },
  registerHighlight: {
    color: "#3498db",
    fontWeight: "600",
  },
});

export default SignInScreen;