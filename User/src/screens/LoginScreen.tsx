import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '../config/api'; // Pastikan file ini sudah ada dengan IP laptopmu!

export default function LoginScreen({ navigation, onNavigateToRegister }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    // Cegah user pencet tombol berkali-kali saat sedang loading
    if (isLoading) return;

    if (!email || !password) {
      Alert.alert('Error', 'Email dan Password tidak boleh kosong!');
      return;
    }

    setIsLoading(true);

    try {
      // Menembak API NestJS kamu
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        // Ambil token dari respon backend (access_token)
        const token = result.access_token;
        
        if (token) {
          // Simpan token ke dalam brankas HP
          await SecureStore.setItemAsync('userToken', token);
        }

        Alert.alert('Sukses', `Selamat datang kembali!`);
        
        // Pindah ke halaman Dashboard
        navigation.replace('Dashboard');
      } else {
        // Tangkap pesan error kustom dari backend kamu (misal: "Email atau password salah, Fazli!")
        Alert.alert('Login Gagal', result.message || 'Email atau password salah.');
      }
    } catch (error) {
      Alert.alert('Error', 'Tidak dapat terhubung ke server. Pastikan API dan IP Address benar!');
      console.log('Error koneksi:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
  <Text style={styles.title}>TerraVision</Text> {/* Perubahan nama aplikasi menjadi TerraVision */}
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
          autoCapitalize="none" // Mencegah huruf pertama jadi kapital otomatis
        />

        <Text style={styles.label}>Password</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Masukkan password" 
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />
        
        {/* Tampilkan animasi loading jika sedang memproses, jika tidak tampilkan tombol */}
        {isLoading ? (
          <ActivityIndicator size="large" color="#2e7d32" style={{ marginTop: 10 }} />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>MASUK</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7f5', // Warna latar belakang abu kehijauan yang bersih
    justifyContent: 'center',
    alignItems: 'center', // Membuat objek card berada pas di tengah layar
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    width: '100%',
    maxWidth: 400, // Membatasi lebar kotak di web agar setara ukuran HP asli
    padding: 25,
    borderRadius: 20,
    shadowColor: '#000', // Efek bayangan halus di browser / iOS
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5, // Efek bayangan di perangkat Android
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