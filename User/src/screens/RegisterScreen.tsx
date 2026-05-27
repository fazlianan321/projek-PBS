import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { API_URL } from '../config/api'; // Pastikan konfigurasi IP backend laptop kamu sudah sesuai di sini

export default function RegisterScreen({ onNavigateToLogin }: { onNavigateToLogin: () => void }) {
  const [name, setName] = useState(''); // State penampung input nama lengkap
  const [email, setEmail] = useState(''); // State penampung input alamat email
  const [password, setPassword] = useState(''); // State penampung input kata sandi
  const [isLoading, setIsLoading] = useState(false); // State indikator loading tombol
  const handleRegister = async () => {
    // Pengaman: Mencegah user melakukan registrasi ganda secara tidak sengaja saat loading aktif
    if (isLoading) return;

    // Validasi Sisi Klien: Memastikan tidak ada field pendaftaran yang kosong
    if (!name || !email || !password) {
      Alert.alert('Peringatan', 'Semua kolom pendaftaran wajib diisi dengan lengkap!');
      return;
    }

    setIsLoading(true);

    try {
      // Mengirimkan request POST ke API pendaftaran akun baru backend NestJS
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert('Sukses 🎉', 'Akun TerraVision kamu berhasil dibuat! Silakan masuk.');
        onNavigateToLogin(); // Otomatis mengarahkan user kembali ke form login setelah sukses
      } else {
        Alert.alert('Pendaftaran Gagal', result.message || 'Terjadi kesalahan saat mendaftarkan akun.');
      }
    } catch (error) {
      Alert.alert('Error Jaringan', 'Gagal terhubung ke server backend TerraVision.');
      console.log('Error registrasi:', error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Bagian Komponen Header Register */}
        <View style={styles.header}>
          <Text style={styles.logoIcon}>🚀</Text>
          <Text style={styles.title}>Daftar Akun</Text>
          <Text style={styles.subtitle}>Bergabunglah dengan ekosistem TerraVision</Text>
        </View>

        {/* Bagian Input Form Pendaftaran */}
        <View style={styles.form}>
          <Text style={styles.label}>Nama Lengkap</Text>
          <TextInput style={styles.input} placeholder="Masukkan nama lengkap Anda" value={name} onChangeText={setName} />

          <Text style={styles.label}>Email</Text>
          <TextInput style={styles.input} placeholder="Masukkan email Anda" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />

          <Text style={styles.label}>Password</Text>
          <TextInput style={styles.input} placeholder="Buat password minimal 6 karakter" secureTextEntry={true} value={password} onChangeText={setPassword} />

          {/* Render Kondisional tombol daftar */}
          {isLoading ? (
            <ActivityIndicator size="large" color="#1b4d3e" style={{ marginTop: 10 }} />
          ) : (
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              <Text style={styles.buttonText}>DAFTAR SEKARANG</Text>
            </TouchableOpacity>
          )}

          {/* Tombol kembali ke Login */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Sudah punya akun? </Text>
            <TouchableOpacity onPress={onNavigateToLogin}>
              <Text style={styles.linkText}>Masuk di sini</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}