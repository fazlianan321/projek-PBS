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