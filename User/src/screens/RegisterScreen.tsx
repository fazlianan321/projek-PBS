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
        body: JSON.stringify({ name, email, pass: password }),
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
            <View style={styles.formGroup}>
              <Text style={styles.premiumLabel}>NAMA LENGKAP</Text>
              <TextInput 
                style={styles.premiumInput} 
                placeholder="Masukkan nama lengkap Anda" 
                placeholderTextColor="#94a3b8"
                value={name}
                onChangeText={setName}
              />

              <Text style={styles.premiumLabel}>ALAMAT EMAIL</Text>
              <TextInput 
                style={styles.premiumInput} 
                placeholder="nama@domain.com" 
                placeholderTextColor="#94a3b8"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />

              <Text style={styles.premiumLabel}>KATA SANDI</Text>
              <TextInput 
                style={styles.premiumInput} 
                placeholder="Buat password minimal 6 karakter" 
                placeholderTextColor="#94a3b8"
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
              />
              
              {isLoading ? (
                <ActivityIndicator size="large" color="#047857" style={{ marginTop: 15 }} />
              ) : (
                <TouchableOpacity style={styles.premiumButton} onPress={handleRegister}>
                  <Text style={styles.premiumButtonText}>DAFTAR SEKARANG</Text>
                </TouchableOpacity>
              )}

              <View style={styles.premiumFooter}>
                <Text style={styles.premiumFooterText}>Sudah memiliki akun? </Text>
                <TouchableOpacity onPress={onNavigateToLogin}>
                  <Text style={styles.premiumLinkText}>Masuk di sini</Text>
                </TouchableOpacity>
              </View>
            </View> {/* Akhir formGroup */}
          </View> {/* Akhir innerCardWeb */}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    width: '100%',
  },
  leftBanner: {
    width: '55%',
    backgroundColor: '#064e3b', 
    justifyContent: 'center',
    padding: 60,
    position: 'relative',
  },
  overlayPattern: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: '#047857',
    opacity: 0.12,
  },
  bannerContent: {
    zIndex: 10,
    maxWidth: 500,
  },
  badgeText: {
    color: '#34d399',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 16,
  },
  mainHeroTitle: {
    fontSize: 44,
    fontWeight: '800',
    color: '#ffffff',
    lineHeight: 52,
    letterSpacing: -1,
  },
  mainHeroSubtitle: {
    fontSize: 15,
    color: '#d1fae5',
    marginTop: 18,
    lineHeight: 24,
    opacity: 0.85,
  },
  featureTagRow: {
    flexDirection: 'row',
    marginTop: 35,
    gap: 10,
  },
  featureTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    color: '#ffffff',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    fontSize: 12,
    fontWeight: '600',
  },
  rightFormPanel: {
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  innerCardWeb: {
    width: '100%',
    maxWidth: 390,
    paddingHorizontal: 30,
  },
  headerLeftAlign: {
    marginBottom: 32,
  },
  brandTitleText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#064e3b',
    marginBottom: 20,
  },
  formActionText: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0f172a',
  },
  formSecondaryText: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 6,
    lineHeight: 18,
  },
  formGroup: {
    width: '100%',
  },
  premiumLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  premiumInput: {
    width: '100%',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
    marginBottom: 20,
    fontSize: 14,
    color: '#0f172a',
  },
  premiumButton: {
    backgroundColor: '#064e3b',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 6,
    boxShadow: '0px 4px 14px rgba(6, 78, 59, 0.25)', 
  },
  premiumButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  premiumFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  premiumFooterText: {
    color: '#64748b',
    fontSize: 13,
  },
  premiumLinkText: {
    color: '#047857',
    fontWeight: '700',
    fontSize: 13,
  },
});