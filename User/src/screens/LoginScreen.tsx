import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator, useWindowDimensions } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '../config/api'; 

export default function LoginScreen({ navigation, onNavigateToRegister, initialEmail, onLoginSuccess }: any) {
  const [email, setEmail] = useState(initialEmail || '');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialEmail) {
      setEmail(initialEmail);
    }
  }, [initialEmail]);

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
          // Fallback storage aman: LocalStorage untuk web browser, SecureStore untuk HP fisik
          try {
            await SecureStore.setItemAsync('userToken', token);
          } catch (e) {
            localStorage.setItem('userToken', token);
            console.log('SecureStore dialihkan ke localStorage (Web Environment)');
          }
        }
        
        // 🟢 PERBAIKAN UTAMA: Langsung tembak callback untuk ganti halaman root ke DASHBOARD
        if (typeof onLoginSuccess === 'function') {
          onLoginSuccess();
        } else {
          // Fallback cadangan jika properti fungsi mengalami kendala render
          Alert.alert('Sukses', 'Login berhasil!');
        }
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
      {/* PANEL KIRI: Visual Branding */}
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

      {/* PANEL KANAN: Form Akses */}
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
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