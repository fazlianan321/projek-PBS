import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, useWindowDimensions, RefreshControl, ActivityIndicator, Alert, Image, Platform } from 'react-native'; 
import * as SecureStore from 'expo-secure-store';
import * as ImagePicker from 'expo-image-picker'; 

// 🟢 CONFIGURASI URL BACKEND (Menggunakan IP Laptop Terbaru Kamu: 192.168.1.6)
const IP_LAPTOP = '192.168.1.38'; 
const LAHAN_ID = 'TRV-001'; 
const API_URL = `http://${IP_LAPTOP}:3000/sensor/latest/${LAHAN_ID}`; 

interface DashboardProps {
  onLogout: () => void;
  onNavigateToProfile: () => void;
  onNavigateToAi: () => void; 
}

export default function DashboardScreen({ onLogout, onNavigateToProfile, onNavigateToAi }: DashboardProps) {
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;
  const [refreshing, setRefreshing] = useState(false);
  const [loadingSession, setLoadingSession] = useState(true);

  // State Fitur Interaktif
  const [isPumpActive, setIsPumpActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null); 
  
  // 🟢 DITAMBAHKAN: State untuk penanda bahaya (pewarnaan dinamis)
  const [isDiseaseDetected, setIsDiseaseDetected] = useState<boolean>(false);

  // 🟢 DITAMBAHKAN: State untuk notifikasi teks di bawah tombol (menggantikan Alert atas)
  const [cameraNotification, setCameraNotification] = useState<{ type: 'success' | 'danger' | 'info'; title: string; message: string } | null>(null);

  // State Data Sensor Real-Time
  const [metrics, setMetrics] = useState({
    soilMoisture: '--%',
    temperature: '--°C',
    humidity: '75%', 
    vegetationHealth: 'Optimal',
    lastSync: 'Menghubungkan ke server...',
  });

  // Fungsi Helper untuk memunculkan Alert/Notifikasi lintas Platform (HP & Web)
  const showAlert = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      alert(`${title}\n\n${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

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
        showAlert(
          "Perintah Terkirim", 
          newState ? "Pompa irigasi berhasil diaktifkan via API." : "Pompa irigasi dinonaktifkan."
        );
      } else {
        showAlert("Gagal Kontrol Pompa", "Server merespon, tetapi gagal memproses perintah.");
      }
    } catch (error) {
      console.log("Error tombol irigasi:", error);
      showAlert(
        "Koneksi Putus", 
        "Gagal mengirim perintah pompa. Pastikan Laptop (Server) dan HP berada di jaringan Wi-Fi yang sama!"
      );
    }
  };

  // 🟢 PERBAIKAN: Langsung buka Kamera & Notifikasi Teks Render di Bawah Tombol
  const handleUploadPhoto = async () => {
    setCameraNotification(null); // Reset notifikasi lama tiap kali scan baru dimulai

    if (Platform.OS !== 'web') {
      // Hapus requestMediaLibraryPermissionsAsync agar tidak minta akses galeri
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      
      if (!cameraPermission.granted) {
        setCameraNotification({
          type: 'danger',
          title: 'Izin Ditolak',
          message: 'Aplikasi membutuhkan akses kamera langsung untuk memproses serta memindai struktur daun.'
        });
        return;
      }
    }

    try {
      // Langsung memicu kamera internal HP tanpa alur tambahan
      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7, // Dioptimalkan ke 0.7 agar alokasi memori heap internal perangkat tidak kehabisan daya
      });

      if (result.canceled) return;

      const imageUri = result.assets[0].uri;
      setSelectedImageUri(imageUri); 
      setIsUploading(true);
      setAnalysisResult(null);

      const formData = new FormData();
      formData.append('lahanId', LAHAN_ID);

      const filename = imageUri.split('/').pop() || 'photo.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image/jpeg`;

      if (Platform.OS === 'web') {
        const resBlob = await fetch(imageUri);
        const blob = await resBlob.blob();
        formData.append('file', blob, filename);
      } else {
        formData.append('file', {
          uri: imageUri,
          name: filename,
          type: type,
        } as any);
      }

      const AI_API_URL = `http://${IP_LAPTOP}:3000/sensor/ai/analyze-leaf`;

      const response = await fetch(AI_API_URL, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData,
      });

      if (response.ok) {
        const json = await response.json();

        // VALIDASI OBJEK (Notifikasi dialihkan ke bawah tombol)
        if (json.isPlant === false || json.isValid === false) {
          setAnalysisResult(null);
          setSelectedImageUri(null); // Hapus preview karena salah objek
          setCameraNotification({
            type: 'danger',
            title: '🛑 Objek Tidak Valid',
            message: 'Foto yang Anda ambil dideteksi bukan bagian dari tumbuhan atau lahan pertanian. Silakan coba potret ulang tanaman Anda!'
          });
          return;
        }

        setAnalysisResult(`${json.result}\n💡 Saran: ${json.suggestion}`);
        
        const textHasil = (json.result || '').toLowerCase();
        if (textHasil.includes('sakit') || textHasil.includes('hama') || textHasil.includes('rusak') || textHasil.includes('penyakit')) {
          setIsDiseaseDetected(true);
        } else {
          setIsDiseaseDetected(false);
        }

        setCameraNotification({
          type: 'success',
          title: '✅ Analisis Selesai',
          message: 'AI Vision berhasil mendiagnosis kondisi kesehatan daun.'
        });
      } else {
        setCameraNotification({
          type: 'danger',
          title: '❌ Gagal Analisis',
          message: 'Server AI merespon tetapi gagal memproses diagnosis gambar.'
        });
      }
    } catch (error) {
      console.log("Error AI Vision Fetching:", error);
      setCameraNotification({
        type: 'danger',
        title: '⚠️ Koneksi Putus',
        message: 'Gagal terhubung ke Server atau modul Kamera bermasalah. Pastikan Laptop dan HP berada di jaringan Wi-Fi yang sama!'
      });
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
        
        {/* AREA TOMBOL NAVIGASI KANAN */}
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
        <View style={styles.singleActionRow}>
          <View style={styles.fullActionCard}>
            <View style={styles.actionHeader}>
              <Text style={styles.actionIcon}>🚰</Text>
              <Text style={styles.actionTitle}>Irigasi Manual (Override)</Text>
            </View>
            <Text style={styles.actionDesc}>Nyalakan sakelar pompa air digital sekarang tanpa menunggu pemicu otomatisasi sensor eksternal.</Text>
            <TouchableOpacity style={[styles.actionButton, isPumpActive ? styles.btnDanger : styles.btnSuccess]} onPress={handleTogglePump} activeOpacity={0.8}>
              <Text style={styles.actionButtonText}>{isPumpActive ? '🔴 Matikan Pompa Air' : '🟢 Nyalakan Pompa Air'}</Text>
            </TouchableOpacity>
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

        {/* PUSAT AI */}
        <Text style={styles.sectionTitle}>Pusat Diagnosis & Kognitif AI</Text>
        <View style={styles.aiSectionContainer}>
          <View style={styles.aiCard}>
            <View style={styles.aiHeader}>
              <Text style={styles.aiIcon}>🤖</Text>
              <View>
                <Text style={styles.aiTitle}>TerraVision AI Engine</Text>
                <Text style={styles.aiSubtitle}>Computer Vision & Deteksi Penyakit Daun</Text>
              </View>
            </View>
            
            <Text style={styles.aiDesc}>
              Gunakan kecerdasan buatan untuk mengamati struktur morfologi daun, mendeteksi patogen, klorosis, dan hama tanaman secara presisi.
            </Text>

            <View style={[styles.aiActionsGrid, { flexDirection: isDesktop ? 'row' : 'column' }]}>
              {/* SUB PANEL KIRI: Fitur Kamera Langsung */}
              <View style={[styles.aiSubPanel, { width: isDesktop ? '49%' : '100%' }]}>
                <Text style={styles.subPanelTitle}>Quick Scan (Kamera AI)</Text>
                
                {selectedImageUri && (
                  <Image source={{ uri: selectedImageUri }} style={styles.imagePreview} />
                )}

                <TouchableOpacity style={[styles.actionButton, styles.btnPrimary]} onPress={handleUploadPhoto} disabled={isUploading} activeOpacity={0.8}>
                  {isUploading ? <ActivityIndicator color="#ffffff" size="small" /> : <Text style={styles.actionButtonText}>📸 Ambil Foto Tanaman</Text>}
                </TouchableOpacity>

                {/* 🟢 DITAMBAHKAN: Rendering Inline Notice Box tepat berada di bawah tombol scan */}
                {cameraNotification && (
                  <View style={[
                    styles.inlineNotice, 
                    cameraNotification.type === 'danger' ? styles.noticeDanger : 
                    cameraNotification.type === 'success' ? styles.noticeSuccess : styles.noticeInfo
                  ]}>
                    <Text style={[
                      styles.noticeTitle, 
                      cameraNotification.type === 'danger' ? styles.noticeTitleDanger : 
                      cameraNotification.type === 'success' ? styles.noticeTitleSuccess : styles.noticeTitleInfo
                    ]}>
                      {cameraNotification.title}
                    </Text>
                    <Text style={styles.noticeMessage}>{cameraNotification.message}</Text>
                  </View>
                )}

                {analysisResult && (
                  // Kotak hasil dengan pewarnaan dinamis (Success / Danger)
                  <View style={[styles.resultBox, isDiseaseDetected ? styles.resultBoxDanger : styles.resultBoxSuccess]}>
                    <Text style={[styles.resultTitle, isDiseaseDetected ? styles.resultTitleDanger : styles.resultTitleSuccess]}>
                      {isDiseaseDetected ? '⚠️ Peringatan Penyakit Tanaman:' : '✅ Hasil Deteksi AI Vision:'}
                    </Text>
                    <Text style={[styles.resultText, isDiseaseDetected ? styles.resultTextDanger : styles.resultTextSuccess]}>
                      {analysisResult}
                    </Text>
                  </View>
                )}
              </View>

              {/* SUB PANEL KANAN */}
              <View style={[styles.aiSubPanel, { width: isDesktop ? '49%' : '100%', backgroundColor: '#faf5ff', borderColor: '#e9d5ff' }]}>
                <Text style={styles.subPanelTitle}>Advanced System Expert</Text>
                <TouchableOpacity style={[styles.actionButton, styles.btnPremiumLayer]} onPress={onNavigateToAi} activeOpacity={0.8}>
                  <Text style={styles.actionButtonText}>🚀 Buka TerraVision AI Expert</Text>
                </TouchableOpacity>
                <Text style={styles.aiHighlightHint}>Direkomendasikan: Navigasi ke modul konsultasi sistem pakar dengan batasan 25 parameter ketat.</Text>
              </View>
            </View>
          </View>
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
  
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a', marginBottom: 16, marginTop: 12 },
  singleActionRow: { marginBottom: 24 },
  fullActionCard: { backgroundColor: '#ffffff', borderRadius: 18, padding: 24, borderWidth: 1, borderColor: '#e2e8f0' },
  actionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  actionIcon: { fontSize: 22 },
  actionTitle: { fontSize: 16, fontWeight: '800', color: '#0f172a' },
  actionDesc: { fontSize: 13, color: '#64748b', marginBottom: 20, lineHeight: 20 },
  actionButton: { padding: 14, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  actionButtonText: { color: '#ffffff', fontWeight: '700', fontSize: 14 },
  btnSuccess: { backgroundColor: '#059669' },
  btnDanger: { backgroundColor: '#dc2626' },
  btnPrimary: { backgroundColor: '#2563eb' },
  btnPremiumLayer: { backgroundColor: '#8b5cf6' },
  
  imagePreview: { width: '100%', height: 160, borderRadius: 10, marginBottom: 14, resizeMode: 'cover', borderWidth: 1, borderColor: '#cbd5e1' },
  
  resultBox: { marginTop: 16, padding: 12, borderRadius: 8, borderLeftWidth: 4 },
  resultBoxSuccess: { backgroundColor: '#eff6ff', borderLeftColor: '#3b82f6' },
  resultBoxDanger: { backgroundColor: '#fef2f2', borderLeftColor: '#ef4444' },
  resultTitle: { fontSize: 12, fontWeight: '700' },
  resultTitleSuccess: { color: '#1e3a8a' },
  resultTitleDanger: { color: '#991b1b' },
  resultText: { fontSize: 14, fontWeight: '700', marginTop: 4 },
  resultTextSuccess: { color: '#2563eb' },
  resultTextDanger: { color: '#dc2626' },

  // 🟢 DITAMBAHKAN: Style penampung Notice Box di bawah tombol utama agar selaras dengan desain card
  inlineNotice: { marginTop: 14, padding: 14, borderRadius: 10, borderWidth: 1 },
  noticeDanger: { backgroundColor: '#fef2f2', borderColor: '#fca5a5' },
  noticeSuccess: { backgroundColor: '#f0fdf4', borderColor: '#86efac' },
  noticeInfo: { backgroundColor: '#f0f9ff', borderColor: '#7dd3fc' },
  noticeTitle: { fontSize: 13, fontWeight: '800', marginBottom: 3 },
  noticeTitleDanger: { color: '#991b1b' },
  noticeTitleSuccess: { color: '#166534' },
  noticeTitleInfo: { color: '#0369a1' },
  noticeMessage: { fontSize: 12, color: '#475569', lineHeight: 17, fontWeight: '500' },
  
  alertPanel: { backgroundColor: '#ffffff', borderRadius: 20, padding: 24, borderWidth: 1, borderColor: '#e2e8f0', borderLeftWidth: 6, borderLeftColor: '#064e3b', marginBottom: 32 },
  alertHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  alertTitleIcon: { fontSize: 18 },
  alertTitle: { fontSize: 16, fontWeight: '800', color: '#0f172a' },
  alertDescription: { fontSize: 14, color: '#475569', lineHeight: 24 },
  boldText: { fontWeight: '700', color: '#0f172a' },
  dangerText: { fontWeight: '800', color: '#b91c1c' },

  aiSectionContainer: { marginBottom: 32 },
  aiCard: { backgroundColor: '#ffffff', borderRadius: 20, padding: 24, borderWidth: 1, borderColor: '#e2e8f0' },
  aiHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  aiIcon: { fontSize: 28 },
  aiTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
  aiSubtitle: { fontSize: 12, color: '#64748b', fontWeight: '500' },
  aiDesc: { fontSize: 13, color: '#475569', lineHeight: 20, marginBottom: 20 },
  aiActionsGrid: { justifyContent: 'space-between', gap: 16 },
  aiSubPanel: { padding: 18, borderRadius: 14, borderWidth: 1, borderColor: '#f1f5f9', backgroundColor: '#f8fafc', justifyContent: 'center' },
  subPanelTitle: { fontSize: 13, fontWeight: '800', color: '#334155', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  aiHighlightHint: { fontSize: 11, color: '#6b21a8', marginTop: 10, lineHeight: 16, fontWeight: '500' }
});