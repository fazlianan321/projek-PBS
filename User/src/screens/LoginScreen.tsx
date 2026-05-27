import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Nanti di sini kita sambungkan ke API NestJS/Golang kamu
    if (email && password) {
      Alert.alert('Sukses', `Selamat datang, ${email}!`);
    } else {
      Alert.alert('Error', 'Email dan Password tidak boleh kosong!');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AgriSmart IoT</Text>
        <Text style={styles.subtitle}>Monitoring Lahan Pertanian Cerdas</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Email</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Masukkan email Anda" 
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Masukkan password" 
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>MASUK</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

