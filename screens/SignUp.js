import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios, { AxiosError } from 'axios';
import { Ionicons } from '@expo/vector-icons';

const SignUpScreen = () => {
  const [nationalId, setNationalId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [title, setTitle] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigation = useNavigation();

  const handleRegister = async () => {
    // ตรวจสอบข้อมูลที่จำเป็น
    if (!nationalId || !password || !confirmPassword || !firstName || !lastName || !title) {
      Alert.alert('Error', 'กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    // ตรวจสอบรหัสผ่านตรงกัน
    if (password !== confirmPassword) {
      Alert.alert('Error', 'รหัสผ่านไม่ตรงกัน');
      return;
    }

    try {
      // เรียกใช้ API Register
      await axios.post('http://192.168.110.193:5062/users', {
        nationalId,
        password,
        firstName,
        lastName,
        title
      });

      // สำเร็จ
      Alert.alert('สำเร็จ', 'ลงทะเบียนสำเร็จ กรุณาเข้าสู่ระบบ');
      navigation.navigate('SignIn');

    } catch (error) {
      let errorMessage = 'เกิดข้อผิดพลาดในการเชื่อมต่อ';
      
      if (error.response) {
        errorMessage = error.response.status;
      } else if (error.request) {
        errorMessage = 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้';
      }
      
      Alert.alert('ข้อผิดพลาด', errorMessage);
    }
  };

 return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>สร้างบัญชีผู้ใช้</Text>

      {/* คำนำหน้า */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>คำนำหน้า</Text>
        <TextInput
          placeholder="เช่น นาย/นางสาว/นาง"
          placeholderTextColor="#999"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />
      </View>

      {/* ชื่อจริง */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>ชื่อจริง</Text>
        <TextInput
          placeholder="กรอกชื่อจริง"
          placeholderTextColor="#999"
          value={firstName}
          onChangeText={setFirstName}
          style={styles.input}
        />
      </View>

      {/* นามสกุล */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>นามสกุล</Text>
        <TextInput
          placeholder="กรอกนามสกุล"
          placeholderTextColor="#999"
          value={lastName}
          onChangeText={setLastName}
          style={styles.input}
        />
      </View>

      {/* เลขประจำตัวประชาชน */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>เลขประจำตัวประชาชน</Text>
        <TextInput
          placeholder="13 หลัก (ตัวเลขเท่านั้น)"
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
            placeholder="อย่างน้อย 6 ตัวอักษร"
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
              name={showPassword ? 'eye-off' : 'eye'}
              size={24}
              color="#666"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* ยืนยันรหัสผ่าน */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>ยืนยันรหัสผ่าน</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="กรอกรหัสผ่านอีกครั้ง"
            placeholderTextColor="#999"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            style={[styles.input, { flex: 1 }]}
          />
          <TouchableOpacity
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={showConfirmPassword ? 'eye-off' : 'eye'}
              size={24}
              color="#666"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* ปุ่มลงทะเบียน */}
      <TouchableOpacity onPress={handleRegister} style={styles.registerButton}>
        <Text style={styles.buttonText}>ลงทะเบียน</Text>
      </TouchableOpacity>

      {/* ลิงก์กลับไปล็อกอิน */}
      <TouchableOpacity
        onPress={() => navigation.navigate('SignIn')}
        style={styles.loginLink}
      >
        <Text style={styles.loginText}>
          มีบัญชีอยู่แล้ว? <Text style={styles.loginHighlight}>เข้าสู่ระบบที่นี่</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 30,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#34495e',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#2c3e50',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    padding: 10,
  },
  registerButton: {
    backgroundColor: '#27ae60',
    borderRadius: 10,
    padding: 18,
    alignItems: 'center',
    marginTop: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  loginLink: {
    marginTop: 25,
    alignItems: 'center',
  },
  loginText: {
    color: '#7f8c8d',
    fontSize: 14,
  },
  loginHighlight: {
    color: '#3498db',
    fontWeight: '600',
  },
});

export default SignUpScreen;
