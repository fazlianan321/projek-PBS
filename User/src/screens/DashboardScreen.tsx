import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, useWindowDimensions, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// 🟢 CONFIGURASI URL BACKEND (Sudah Menggunakan IP Kamu: 192.168.1.38)
const IP_LAPTOP = '192.168.1.38'; 
const LAHAN_ID = 'TRV-001'; 
const API_URL = `http://${IP_LAPTOP}:3000/sensor/latest/${LAHAN_ID}`; 

// 🟢 PERBAIKAN TIPE: Daftarkan onNavigateToProfile ke dalam properti komponen
interface DashboardProps {
  onLogout: () => void;
  onNavigateToProfile: () => void;
}

export default function DashboardScreen({ onLogout, onNavigateToProfile }: DashboardProps) {
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;
  const [refreshing, setRefreshing] = useState(false);
  const [loadingSession, setLoadingSession] = useState(true);

  // State Fitur Interaktif
  const [isPumpActive, setIsPumpActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  // State Data Sensor Real-Time
  const [metrics, setMetrics] = useState({
    soilMoisture: '--%',
    temperature: '--°C',
    humidity: '75%', 
    vegetationHealth: 'Optimal',
    lastSync: 'Menghubungkan ke server...',
  });

  // 🟢 FUNGSI FETCH DATA ASLI DARI NESTJS (Dengan Auto-Sync Status Pompa)
  const fetchRealtimeSensorData = async () => {
    try {
      let token = null;
      try { token = await SecureStore.getItemAsync('userToken'); } catch (e) { token = localStorage.getItem('userToken'); }

      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });

      if (response.ok) {
        const result = await response.json();
        
        if (result) {
          // Sinkronisasi lampu indikator sakelar di HP secara otomatis dari state server
          if (result.statusPompa !== undefined) {
            setIsPumpActive(result.statusPompa);
          }

          setMetrics({
            soilMoisture: (result.kelembapan !== undefined ? result.kelembapan : '--') + '%',
            temperature: (result.suhu !== undefined ? result.suhu : '--') + '°C',
            humidity: '75%', 
            vegetationHealth: 'Optimal',
            lastSync: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB',
          });
        } else {
          setMetrics(prev => ({ ...prev, lastSync: 'Lahan aktif, log data kosong' }));
        }
      }
    } catch (error) {
      console.log('Gagal fetch data dari NestJS:', error);
      setMetrics(prev => ({ ...prev, lastSync: 'API Terputus (Periksa IP Server) ❌' }));
    } finally {
      setLoadingSession(false);
    }
  };

  // 🟢 LIVE AUTO-POLLING (Looping fetch otomatis setiap 5 detik)
  useEffect(() => {
    fetchRealtimeSensorData(); 

    const intervalId = setInterval(() => {
      fetchRealtimeSensorData(); 
    }, 5000);

    return () => clearInterval(intervalId); 
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRealtimeSensorData();
    setRefreshing(false);
  };

  // 🟢 FUNGSI TOGGLE SAKELAR POMPA (POST KE NESTJS)
  const handleTogglePump = async () => {
    const newState = !isPumpActive;
    const PUMP_API_URL = `http://${IP_LAPTOP}:3000/sensor/pump/toggle`;

    try {
      const response = await fetch(PUMP_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lahanId: LAHAN_ID,
          statusPompa: newState
        })
      });

      if (response.ok) {
        setIsPumpActive(newState); 
        Alert.alert(
          "Perintah Terkirim", 
          newState ? "Pompa irigasi berhasil diaktifkan via API." : "Pompa irigasi dinonaktifkan."
        );
      } else {
        Alert.alert("Gagal Kontrol Pompa", "Server merespon, tetapi gagal memproses perintah.");
      }
    } catch (error) {
      console.log("Error tombol irigasi:", error);
      Alert.alert(
        "Koneksi Putus", 
        "Gagal mengirim perintah pompa. Pastikan Laptop (Server) dan HP berada di jaringan Wi-Fi yang sama!"
      );
    }
  };

  // 🟢 REQUEST ANALISIS FOTO DAUN ASLI KE NESTJS
  const handleUploadPhoto = async () => {
    setIsUploading(true);
    setAnalysisResult(null);

    const AI_API_URL = `http://${IP_LAPTOP}:3000/sensor/ai/analyze-leaf`;

    try {
      const response = await fetch(AI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lahanId: LAHAN_ID,
        }),
      });

      if (response.ok) {
        const json = await response.json();
        setAnalysisResult(`${json.result}\n💡 Saran: ${json.suggestion}`);
        Alert.alert("Analisis Selesai", "AI Vision berhasil mendiagnosis kondisi kesehatan daun.");
      } else {
        Alert.alert("Gagal Analisis", "Server AI merespon tetapi gagal memproses diagnosis gambar.");
      }
    } catch (error) {
      console.log("Error AI Vision Fetching:", error);
      Alert.alert(
        "Koneksi Putus", 
        "Gagal terhubung ke Server AI. Pastikan Laptop dan HP berada di jaringan Wi-Fi yang sama!"
      );
    } finally {
      setIsUploading(false);
    }
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
      
      {/* TOPBAR NAVIGATION HEADER */}
      <View style={styles.headerBar}>
        <View style={styles.brandContainer}>
          <Text style={styles.brandLogo}>🌱 TerraVision</Text>
          <Text style={styles.brandSubtitle}>Smart Farming Integrated System</Text>
        </View>
        
        {/* 🟢 AREA TOMBOL NAVIGASI KANAN */}
        <View style={styles.navActionsContainer}>
          <TouchableOpacity style={styles.profileButton} onPress={onNavigateToProfile} activeOpacity={0.7}>
            <Text style={styles.profileButtonText}>👤 Profil</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={onLogout} activeOpacity={0.7}>
            <Text style={styles.logoutText}>Keluar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#047857']} tintColor="#047857" />}
      >
        {/* WELCOME BANNER SECTION */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Selamat Datang Kembali, Fazli! 👋</Text>
          <Text style={styles.subWelcomeText}>
            Berikut laporan kondisi real-time dari ekosistem pertanian cerdas Anda. Data diperbarui: <Text style={styles.timeHighlight}>{metrics.lastSync}</Text>
          </Text>
        </View>

        {/* PREMIUM DYNAMIC RESPONSIVE GRID MATRIX CONTAINER */}
        <View style={[styles.gridContainer, { flexDirection: isDesktop ? 'row' : 'column' }]}>
          
          {/* CARD 1: KELEMBABAN TANAH */}
          <View style={[styles.card, { width: isDesktop ? '23%' : '100%' }]}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardEmoji}>💧</Text>
              <Text style={styles.cardLabel}>KELEMBABAN TANAH</Text>
            </View>
            <Text style={styles.cardValue}>{metrics.soilMoisture}</Text>
            <Text style={[styles.statusBadge, styles.badgeSuccess]}>Kondisi Lahan</Text>
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

          {/* CARD 4: KESEHATAN VEGETASI */}
          <View style={[styles.card, { width: isDesktop ? '23%' : '100%' }]}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardEmoji}>🌾</Text>
              <Text style={styles.cardLabel}>KESEHATAN VEGETASI</Text>
            </View>
            <Text style={styles.cardValue}>{metrics.vegetationHealth}</Text>
            <Text style={[styles.statusBadge, styles.badgePremium]}>Sangat Subur</Text>
          </View>
        </View>

        {/* INTERACTIVE CONTROLLER ACTIONS */}
        <Text style={styles.sectionTitle}>Tindakan & Kontrol Aktual</Text>
        <View style={[styles.actionContainer, { flexDirection: isDesktop ? 'row' : 'column' }]}>
          
          {/* PANEL KONTROL POMPA */}
          <View style={[styles.actionCard, { width: isDesktop ? '49%' : '100%' }]}>
            <View style={styles.actionHeader}>
              <Text style={styles.actionIcon}>🚰</Text>
              <Text style={styles.actionTitle}>Irigasi Manual (Override)</Text>
            </View>
            <Text style={styles.actionDesc}>Nyalakan sakelar pompa air digital sekarang tanpa menunggu pemicu otomatisasi sensor.</Text>
            <TouchableOpacity style={[styles.actionButton, isPumpActive ? styles.btnDanger : styles.btnSuccess]} onPress={handleTogglePump} activeOpacity={0.8}>
              <Text style={styles.actionButtonText}>{isPumpActive ? '🔴 Matikan Pompa Air' : '🟢 Nyalakan Pompa Air'}</Text>
            </TouchableOpacity>
          </View>

          {/* PANEL UPLOAD FOTO AI */}
          <View style={[styles.actionCard, { width: isDesktop ? '49%' : '100%' }]}>
            <View style={styles.actionHeader}>
              <Text style={styles.actionIcon}>📷</Text>
              <Text style={styles.actionTitle}>Analisis Daun (AI Vision)</Text>
            </View>
            <Text style={styles.actionDesc}>Unggah foto morfologi daun tanaman kamu untuk mendeteksi dini infeksi hama patogen.</Text>
            <TouchableOpacity style={[styles.actionButton, styles.btnPrimary]} onPress={handleUploadPhoto} disabled={isUploading} activeOpacity={0.8}>
              {isUploading ? <ActivityIndicator color="#ffffff" size="small" /> : <Text style={styles.actionButtonText}>📤 Ambil / Upload Foto</Text>}
            </TouchableOpacity>
            {analysisResult && (
              <View style={styles.resultBox}>
                <Text style={styles.resultTitle}>Hasil Deteksi AI Vision:</Text>
                <Text style={styles.resultText}>{analysisResult}</Text>
              </View>
            )}
          </View>
        </View>

        {/* AUTOMATION LOGIC PANEL INFO */}
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

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#f8fafc' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' },
  loadingText: { marginTop: 14, fontSize: 14, color: '#047857', fontWeight: '600' },
  headerBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#064e3b', paddingHorizontal: 30, paddingVertical: 18, borderBottomWidth: 1, borderColor: '#047857' },
  brandContainer: { flexDirection: 'column' },
  brandLogo: { fontSize: 22, fontWeight: '800', color: '#ffffff', letterSpacing: -0.5 },
  brandSubtitle: { fontSize: 11, color: '#34d399', fontWeight: '700', letterSpacing: 0.5, marginTop: 2 },
  
  // 🟢 STYLING BARU UNTUK NAVIGASI KANAN HEADER
  navActionsContainer: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  profileButton: { backgroundColor: '#047857', paddingVertical: 9, paddingHorizontal: 16, borderRadius: 10, borderWidth: 1, borderColor: '#34d399' },
  profileButtonText: { color: '#ffffff', fontSize: 13, fontWeight: '700' },
  logoutButton: { backgroundColor: 'rgba(241, 245, 249, 0.12)', paddingVertical: 9, paddingHorizontal: 16, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.25)' },
  logoutText: { color: '#ffffff', fontSize: 13, fontWeight: '700' },
  
  scrollContent: { padding: 30 },
  welcomeSection: { marginBottom: 32 },
  welcomeText: { fontSize: 26, fontWeight: '800', color: '#0f172a', letterSpacing: -0.5 },
  subWelcomeText: { fontSize: 14, color: '#64748b', marginTop: 6, lineHeight: 22 },
  timeHighlight: { color: '#047857', fontWeight: '700' },
  gridContainer: { justifyContent: 'space-between', gap: 16, marginBottom: 32 },
  card: { backgroundColor: '#ffffff', borderRadius: 18, padding: 24, borderWidth: 1, borderColor: '#e2e8f0' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  cardEmoji: { fontSize: 20 },
  cardLabel: { fontSize: 11, fontWeight: '800', color: '#64748b', letterSpacing: 0.8 },
  cardValue: { fontSize: 32, fontWeight: '800', color: '#0f172a', marginVertical: 10, letterSpacing: -0.5 },
  statusBadge: { alignSelf: 'flex-start', fontSize: 11, fontWeight: '800', paddingVertical: 5, paddingHorizontal: 12, borderRadius: 30 },
  badgeSuccess: { backgroundColor: '#d1fae5', color: '#065f46' },
  badgePremium: { backgroundColor: '#ecfdf5', color: '#047857', borderWidth: 1, borderColor: '#a7f3d0' },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a', marginBottom: 16, marginTop: 8 },
  actionContainer: { justifyContent: 'space-between', gap: 16, marginBottom: 32 },
  actionCard: { backgroundColor: '#ffffff', borderRadius: 18, padding: 24, borderWidth: 1, borderColor: '#e2e8f0' },
  actionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  actionIcon: { fontSize: 22 },
  actionTitle: { fontSize: 16, fontWeight: '800', color: '#0f172a' },
  actionDesc: { fontSize: 13, color: '#64748b', marginBottom: 20, lineHeight: 20 },
  actionButton: { padding: 14, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  actionButtonText: { color: '#ffffff', fontWeight: '700', fontSize: 14 },
  btnSuccess: { backgroundColor: '#059669' },
  btnDanger: { backgroundColor: '#dc2626' },
  btnPrimary: { backgroundColor: '#2563eb' },
  resultBox: { marginTop: 16, padding: 12, backgroundColor: '#eff6ff', borderRadius: 8, borderLeftWidth: 4, borderLeftColor: '#3b82f6' },
  resultTitle: { fontSize: 12, fontWeight: '700', color: '#1e3a8a' },
  resultText: { fontSize: 14, fontWeight: '700', color: '#2563eb', marginTop: 4 },
  alertPanel: { backgroundColor: '#ffffff', borderRadius: 20, padding: 24, borderWidth: 1, borderColor: '#e2e8f0', borderLeftWidth: 6, borderLeftColor: '#064e3b' },
  alertHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  alertTitleIcon: { fontSize: 18 },
  alertTitle: { fontSize: 16, fontWeight: '800', color: '#0f172a' },
  alertDescription: { fontSize: 14, color: '#475569', lineHeight: 24 },
  boldText: { fontWeight: '700', color: '#0f172a' },
  dangerText: { fontWeight: '800', color: '#b91c1c' },
});