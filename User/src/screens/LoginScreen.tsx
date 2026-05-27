import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator, useWindowDimensions } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '../config/api'; 

export default function LoginScreen({ navigation, onNavigateToRegister }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Deteksi lebar layar untuk sistem UI responsif
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;

  const handleLogin = async () => {
    if (isLoading) return;

    if (!email || !password) {
      Alert.alert('Error', 'Email dan Password tidak boleh kosong!');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        const token = result.access_token;
        if (token) {
          await SecureStore.setItemAsync('userToken', token);
        }
        Alert.alert('Sukses', `Selamat datang kembali!`);
        navigation.replace('Dashboard');
      } else {
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
    <View style={styles.mainContainer}>
      {/* PANEL KIRI: Visual Branding Tanaman Cerdas (Hanya muncul di Laptop/Web lebar) */}
      {isDesktop && (
        <View style={styles.leftBanner}>
          <View style={styles.overlayPattern} />
          <View style={styles.bannerContent}>
            <Text style={styles.badgeText}>DASHBOARD INTEGRASI SMART FARMING</Text>
            <Text style={styles.mainHeroTitle}>Masa Depan{"\n"}Agrikultur Cerdas.</Text>
            <Text style={styles.mainHeroSubtitle}>
              Pantau kondisi vegetasi, kelembaban tanah, dan efisiensi lahan produksi pertanian cerdas TerraVision secara real-time.
            </Text>
            <View style={styles.featureTagRow}>
              <Text style={styles.featureTag}>🌱 Smart Node</Text>
              <Text style={styles.featureTag}>📊 IoT Analytics</Text>
              <Text style={styles.featureTag}>⚡ Live Data</Text>
            </View>
          </View>
        </View>
      )}

      {/* PANEL KANAN: Form Akses Autentikasi Premium */}
      <View style={[styles.rightFormPanel, { width: isDesktop ? '45%' : '100%' }]}>
        <View style={styles.innerCardWeb}>
          <View style={styles.headerLeftAlign}>
            <Text style={styles.brandTitleText}>🌱 TerraVision</Text>
            <Text style={styles.formActionText}>Selamat Datang</Text>
            <Text style={styles.formSecondaryText}>Silakan masuk untuk mengakses sistem manajemen informasi lahan.</Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.premiumLabel}>ALAMAT EMAIL</Text>
            <TextInput 
              style={styles.premiumInput} 
              placeholder="nama@domain.com" 
              placeholderTextColor="#94a3b8"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />

            <Text style={styles.premiumLabel}>KATA SANDI</Text>
            <TextInput 
              style={styles.premiumInput} 
              placeholder="••••••••" 
              placeholderTextColor="#94a3b8"
              secureTextEntry={true}
              value={password}
              onChangeText={setPassword}
            />
            
            {isLoading ? (
              <ActivityIndicator size="large" color="#047857" style={{ marginTop: 15 }} />
            ) : (
              <TouchableOpacity style={styles.premiumButton} onPress={handleLogin}>
                <Text style={styles.premiumButtonText}>MASUK KE DASHBOARD</Text>
              </TouchableOpacity>
            )}

            <View style={styles.premiumFooter}>
              <Text style={styles.premiumFooterText}>Belum memiliki akses sistem? </Text>
              <TouchableOpacity onPress={onNavigateToRegister}>
                <Text style={styles.premiumLinkText}>Daftar Akun Baru</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

