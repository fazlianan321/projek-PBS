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
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.logoIcon}>🌍</Text>
          <Text style={styles.title}>TerraVision</Text>
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
            autoCapitalize="none"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Masukkan password" 
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />
          
          {isLoading ? (
            <ActivityIndicator size="large" color="#1b4d3e" style={{ marginTop: 10 }} />
          ) : (
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>MASUK</Text>
            </TouchableOpacity>
          )}

          <View style={styles.footer}>
            <Text style={styles.footerText}>Belum bergabung? </Text>
            <TouchableOpacity onPress={onNavigateToRegister}>
              <Text style={styles.linkText}>Daftar Akun Baru</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7f5', 
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    width: '100%',
    maxWidth: 400,
    padding: 25,
    borderRadius: 20,
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // Efek bayangan mewah di browser web
    elevation: 5, // Efek bayangan untuk HP Android
  },
  header: {
    alignItems: 'center',
    marginBottom: 25,
  },
  logoIcon: {
    fontSize: 40,
    marginBottom: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1b4d3e', // Warna hijau botol tua premium
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 13,
    color: '#777',
    marginTop: 5,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e1e8e2',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 18,
    fontSize: 14,
    backgroundColor: '#f9fbf9',
    color: '#333',
  },
  button: {
    backgroundColor: '#1b4d3e',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    color: '#777',
    fontSize: 13,
  },
  linkText: {
    color: '#1b4d3e',
    fontWeight: 'bold',
    fontSize: 13,
  },
});