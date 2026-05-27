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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4fbf4', // Warna hijau sangat muda (tema pertanian)
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2e7d32', // Warna hijau gelap
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  form: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    elevation: 3, // Memberikan efek bayangan di Android
    shadowColor: '#000', // Efek bayangan di iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 20,
    fontSize: 14,
    backgroundColor: '#fafafa',
  },
  button: {
    backgroundColor: '#2e7d32',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});