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

  return (
    <View style={styles.mainContainer}>
      {/* PANEL KIRI: Visual Branding Tanaman Cerdas */}
      {isDesktop && (
        <View style={styles.leftBanner}>
          <View style={styles.overlayPattern} />
          <View style={styles.bannerContent}>
            <Text style={styles.badgeText}>JOIN THE SMART FARMING REVOLUTION</Text>
            <Text style={styles.mainHeroTitle}>Mulai Langkah{"\n"}Cerdas Anda.</Text>
            <Text style={styles.mainHeroSubtitle}>
              Daftarkan akun sistem Anda untuk mulai mengelola efisiensi lahan, analisis vegetasi, dan integrasi data sensor secara terpusat.
            </Text>
            <View style={styles.featureTagRow}>
              <Text style={styles.featureTag}>🌱 Smart Node</Text>
              <Text style={styles.featureTag}>📊 IoT Analytics</Text>
              <Text style={styles.featureTag}>🔒 Secure Cloud</Text>
            </View>
          </View>
        </View>
      )}

      {/* PANEL KANAN: Form Pembungkus */}
      <View style={[styles.rightFormPanel, { width: isDesktop ? '45%' : '100%' }]}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.innerCardWeb}>
            <View style={styles.headerLeftAlign}>
              <Text style={styles.brandTitleText}>🌱 TerraVision</Text>
              <Text style={styles.formActionText}>Daftar Akun Baru</Text>
              <Text style={styles.formSecondaryText}>Lengkapi data diri Anda untuk bergabung ke dalam ekosistem pertanian cerdas.</Text>
            </View>