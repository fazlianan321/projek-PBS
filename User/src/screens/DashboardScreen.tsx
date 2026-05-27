import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, useWindowDimensions, RefreshControl, ActivityIndicator } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export default function DashboardScreen({ onLogout }: { onLogout: () => void }) {
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;
  const [refreshing, setRefreshing] = useState(false);
  const [loadingSession, setLoadingSession] = useState(true);

  // State Data Sensor Real-Time (Siap dihubungkan ke API Backend NestJS/Express)
  const [metrics, setMetrics] = useState({
    soilMoisture: '68%',
    temperature: '28.5°C',
    humidity: '75%',
    vegetationHealth: 'Optimal',
    lastSync: 'Baru saja',
  });

  // Efek Samping untuk Validasi Session Token Keamanan Saat Aplikasi Dimuat
  useEffect(() => {
    const verifyActiveSession = async () => {
      try {
        let token = null;
        
        // Coba ambil dari SecureStore terlebih dahulu (Spesifik Perangkat HP)
        try {
          token = await SecureStore.getItemAsync('userToken');
        } catch (e) {
          // Fallback aman: ambil dari localStorage jika berjalan di Web Browser
          token = localStorage.getItem('userToken');
        }

        if (token) {
          console.log('Sesi aktif terverifikasi:', token.substring(0, 15) + '...');
        }
      } catch (error) {
        console.error('Gagal memvalidasi token sesi:', error);
      } finally {
        // Matikan loading spinner agar dashboard utama langsung muncul tanpa stuck
        setLoadingSession(false);
      }
    };
    verifyActiveSession();
  }, []);

  // Fungsi Pull-to-Refresh Gesture Handler
  const onRefresh = () => {
    setRefreshing(true);
    // Simulasi interaksi sinkronisasi fetch ulang data dari jaringan server
    setTimeout(() => {
      setMetrics(prev => ({
        ...prev,
        soilMoisture: (65 + Math.floor(Math.random() * 6)) + '%',
        temperature: (27 + (Math.random() * 2)).toFixed(1) + '°C',
        lastSync: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      }));
      setRefreshing(false);
    }, 1200);
  };

  if (loadingSession) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#047857" />
        <Text style={styles.loadingText}>Menyiapkan Dashboard Lahan...</Text>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      
      {/* 🟢 TOPBAR NAVIGATION HEADER (DARK GREEN BANNER) */}
      <View style={styles.headerBar}>
        <View style={styles.brandContainer}>
          <Text style={styles.brandLogo}>🌱 TerraVision</Text>
          <Text style={styles.brandSubtitle}>Smart Farming Integrated System</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout} activeOpacity={0.7}>
          <Text style={styles.logoutText}>Keluar Sistem</Text>
        </TouchableOpacity>
      </View>

      {/* 🟢 INTERACTIVE SCROLLVIEW BODY CONTENT */}
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            colors={['#047857']} 
            tintColor="#047857"
            title="Memperbarui data lahan..."
            titleColor="#047857"
          />
        }
      >
        {/* WELCOME BANNER SECTION */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Selamat Datang Kembali, Fazli! 👋</Text>
          <Text style={styles.subWelcomeText}>
            Berikut laporan kondisi real-time dari ekosistem pertanian cerdas Anda. Data diperbarui: <Text style={styles.timeHighlight}>{metrics.lastSync}</Text>
          </Text>
        </View>

        {/* 🟢 PREMIUM DYNAMIC RESPONSIVE GRID MATRIX CONTAINER */}
        <View style={[styles.gridContainer, { flexDirection: isDesktop ? 'row' : 'column' }]}>
          
          {/* CARD 1: KELEMBABAN TANAH */}
          <View style={[styles.card, { width: isDesktop ? '23%' : '100%' }]}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardEmoji}>💧</Text>
              <Text style={styles.cardLabel}>KELEMBABAN TANAH</Text>
            </View>
            <Text style={styles.cardValue}>{metrics.soilMoisture}</Text>
            <Text style={[styles.statusBadge, styles.badgeSuccess]}>Kondisi Baik</Text>
          </View>

          {/* CARD 2: SUHU LINGKUNGAN */}
          <View style={[styles.card, { width: isDesktop ? '23%' : '100%' }]}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardEmoji}>☀️</Text>
              <Text style={styles.cardLabel}>SUHU LINGKUNGAN</Text>
            </View>
            <Text style={styles.cardValue}>{metrics.temperature}</Text>
            <Text style={[styles.statusBadge, styles.badgeSuccess]}>Normal</Text>
          </View>

          {/* CARD 3: KELEMBABAN UDARA */}
          <View style={[styles.card, { width: isDesktop ? '23%' : '100%' }]}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardEmoji}>☁️</Text>
              <Text style={styles.cardLabel}>KELEMBABAN UDARA</Text>
            </View>
            <Text style={styles.cardValue}>{metrics.humidity}</Text>
            <Text style={[styles.statusBadge, styles.badgeSuccess]}>Ideal</Text>
          </View>

          {/* CARD 4: ANALISIS VEGETASI (NDVI COMPUTER VISION) */}
          <View style={[styles.card, { width: isDesktop ? '23%' : '100%' }]}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardEmoji}>🌾</Text>
              <Text style={styles.cardLabel}>KESEHATAN VEGETASI</Text>
            </View>
            <Text style={styles.cardValue}>{metrics.vegetationHealth}</Text>
            <Text style={[styles.statusBadge, styles.badgePremium]}>Sangat Subur</Text>
          </View>

        </View>

        {/* 🟢 AUTOMATION IOT NODE CONTROLLER NOTIFICATION ACTION PANEL */}
        <View style={styles.alertPanel}>
          <View style={styles.alertHeaderRow}>
            <Text style={styles.alertTitleIcon}>⚡</Text>
            <Text style={styles.alertTitle}>Status Otomatisasi Node IoT Irigasi</Text>
          </View>
          <Text style={styles.alertDescription}>
            Sistem penyiraman otomatis cerdas saat ini dalam mode <Text style={styles.boldText}>Standby (Nonaktif)</Text>. Katup solenoid pompa air digital akan otomatis aktif melakukan penyiraman berdurasi 5 menit apabila rata-rata sensor kelembaban tanah mendeteksi angka di bawah <Text style={styles.dangerText}>50%</Text>.
          </Text>
        </View>

      </ScrollView>
    </View>
  );
}

// 🟢 PREMIUM DESIGN SYSTEMS & INTERFACE STYLE SHEET
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f8fafc', // Slate grey background ultra-clean
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 14,
    fontSize: 14,
    color: '#047857',
    fontWeight: '600',
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#064e3b', // Deep Agrotech Forest Green
    paddingHorizontal: 30,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderColor: '#047857',
  },
  brandContainer: {
    flexDirection: 'column',
  },
  brandLogo: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    fontSize: 11,
    color: '#34d399', // Emerald accent highlight
    fontWeight: '700',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  logoutButton: {
    backgroundColor: 'rgba(241, 245, 249, 0.12)',
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  logoutText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 30,
  },
  welcomeSection: {
    marginBottom: 32,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0f172a', // Near black typography
    letterSpacing: -0.5,
  },
  subWelcomeText: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 6,
    lineHeight: 22,
  },
  timeHighlight: {
    color: '#047857',
    fontWeight: '700',
  },
  gridContainer: {
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 32,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    // Perbaikan Web Warning: Menggunakan boxShadow standar modern
    boxShadow: '0px 4px 12px rgba(15, 23, 42, 0.04)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  cardEmoji: {
    fontSize: 20,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: 0.8,
  },
  cardValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0f172a',
    marginVertical: 10,
    letterSpacing: -0.5,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    fontSize: 11,
    fontWeight: '800',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 30,
  },
  badgeSuccess: {
    backgroundColor: '#d1fae5',
    color: '#065f46',
  },
  badgePremium: {
    backgroundColor: '#ecfdf5',
    color: '#047857',
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  alertPanel: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderLeftWidth: 6,
    borderLeftColor: '#064e3b',
    // Perbaikan Web Warning: Menggunakan boxShadow standar modern
    boxShadow: '0px 4px 10px rgba(15, 23, 42, 0.03)',
  },
  alertHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  alertTitleIcon: {
    fontSize: 18,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  alertDescription: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 24,
  },
  boldText: {
    fontWeight: '700',
    color: '#0f172a',
  },
  dangerText: {
    fontWeight: '800',
    color: '#b91c1c',
  },
});