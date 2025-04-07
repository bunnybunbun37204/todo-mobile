import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const SignInScreen = () => {
  const [nationalId, setNationalId] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!nationalId || !password) {
      Alert.alert('Error', 'กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    try {
      // เรียกใช้ API Login
      const response = await axios.post('https://your-api-endpoint.com/tokens', {
        nationalId,
        password
      });

      // บันทึก Token ลงใน Secure Storage
      await SecureStore.setItemAsync('userToken', response.data.token);
      
      navigation.navigate('Main');

    } catch (error) {
      let errorMessage = 'เกิดข้อผิดพลาดในการเชื่อมต่อ';
      
      // จัดการ Error ตามสถานการณ์ต่างๆ
      if (error.response) {
        errorMessage = error.response.data?.message || 'ล็อกอินไม่สำเร็จ';
      } else if (error.request) {
        errorMessage = 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้';
      }
      
      Alert.alert('ข้อผิดพลาด', errorMessage);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>เข้าสู่ระบบ</Text>

      <TextInput
        placeholder="เลขประจำตัวประชาชน"
        value={nationalId}
        onChangeText={setNationalId}
        style={{ 
          borderWidth: 1, 
          padding: 10, 
          marginBottom: 10,
          borderRadius: 5
        }}
      />

      <TextInput
        placeholder="รหัสผ่าน"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ 
          borderWidth: 1, 
          padding: 10, 
          marginBottom: 10,
          borderRadius: 5
        }}
      />

      <Button
        title="เข้าสู่ระบบ"
        onPress={handleLogin}
        color="#007bff"
      />

      <Text style={{ marginTop: 20 }}>
        ยังไม่มีบัญชีผู้ใช้?{' '}
        <Text
          style={{ color: '#007bff', fontWeight: 'bold' }}
          onPress={() => navigation.navigate('MainDrawer')}
        >
          สมัครสมาชิกที่นี่
        </Text>
      </Text>
    </View>
  );
};

export default SignInScreen;