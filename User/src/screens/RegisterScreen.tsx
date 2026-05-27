import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator, useWindowDimensions, ScrollView } from 'react-native';
import { API_URL } from '../config/api'; 

export default function RegisterScreen({ onNavigateToLogin }: { onNavigateToLogin: () => void }) {
  const [name, setName] = useState(''); 
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState(''); 
  const [isLoading, setIsLoading] = useState(false); 

  // 1. Ambil lebar layar secara real-time untuk layout split-screen
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;

  const handleRegister = async () => {
    if (isLoading) return;
    if (!name || !email || !password) {
      Alert.alert('Peringatan', 'Semua kolom pendaftaran wajib diisi dengan lengkap!');
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const result = await response.json();
      if (response.ok) {
        Alert.alert('Sukses 🎉', 'Akun TerraVision kamu berhasil dibuat! Silakan masuk.');
        onNavigateToLogin(); 
      } else {
        Alert.alert('Pendaftaran Gagal', result.message || 'Terjadi kesalahan.');
      }
    } catch (error) {
      Alert.alert('Error Jaringan', 'Gagal terhubung ke server.');
    } finally {
      setIsLoading(false);
    }
  };