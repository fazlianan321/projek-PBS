import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert,
  Image,
  Platform
} from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';

const BACKEND_BASE_URL = 'http://192.168.1.6:3000';
const REQUEST_TIMEOUT = 8000; 
const apiClient = axios.create({
  baseURL: BACKEND_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  if (config.data && !(config.data instanceof FormData) && JSON.stringify(config.data).length > 10000) {
    throw new Error('Payload melampaui batas aman.');
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

interface Lahan { 
  id: string; 
  namaLahan: string; 
}

interface AiResult { 
  result: string; 
  suggestion: string; 
  analyzedAt: string; 
}

export default function AiDiagnosticScreen() {
  const [daftarLahan, setDaftarLahan] = useState<Lahan[]>([]);
  const [selectedLahan, setSelectedLahan] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingStatus, setLoadingStatus] = useState<string>('Mempersiapkan data...');
  const [aiResult, setAiResult] = useState<AiResult | null>(null);
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);

  const isMounted = useRef<boolean>(true);
  const abortController = useRef<AbortController | null>(null);
  const scrollViewRef = useRef<ScrollView>(null); 

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      if (abortController.current) abortController.current.abort();
    };
  }, []);

  const sanitizeText = (text: string): string => {
    return text.replace(/\s+/g, ' ').trim();
  };

  const validateLahanData = (data: any): boolean => {
    return Array.isArray(data) && data.length > 0;
  };

  const fetchDaftarLahan = useCallback(async (): Promise<void> => {
    try {
      // 🟢 PERBAIKAN ENDPOINT: Menyesuaikan dengan route backend yang baru (/sensor/lahan)
      const response = await apiClient.get<Lahan[]>('/sensor/lahan');
      if (!isMounted.current) return;

      if (validateLahanData(response.data)) {
        setDaftarLahan(response.data);
        setSelectedLahan(response.data[0].id);
      } else {
        setDaftarLahan([]); 
      }
    } catch (error) {
      if (!isMounted.current) return; 
      Alert.alert(
        'Gagal Memuat Lahan', 
        'Koneksi terputus atau rute /sensor/lahan tidak ditemukan. Pastikan server NestJS aktif.'
      );
    }
  }, []);

  const handleCaptureLeaf = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Izin Ditolak', 'Sistem memerlukan akses kamera untuk mengambil sampel daun.');
        return;
      }
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImageUri(result.assets[0].uri);
        setAiResult(null); 
      }
    } catch (err) {
      Alert.alert('Error Kamera', 'Gagal memuat modul kamera internal perangkat.');
    }
  };

  const handleAnalyzeLeaf = useCallback(async (): Promise<void> => {
    console.log('--- Memicu Tombol Analisis ---');
    
    if (!selectedLahan || selectedLahan.trim() === '') {
      Alert.alert(
        'Gagal Memulai',
        'Zona lahan belum dipilih atau data gagal dimuat dari server NestJS.'
      );
      return;
    }

    if (!selectedImageUri) {
      Alert.alert(
        'Foto Daun Kosong', 
        'Citra daun belum diambil. Silakan ketuk kotak kamera di atas terlebih dahulu.'
      );
      return;
    }
    
    if (loading) return; 

    setLoading(true);
    setAiResult(null); 
    setLoadingStatus('📸 Mengompresi citra sampel daun...');
    abortController.current = new AbortController();

    const statusTimeout = setTimeout(() => {
      if (isMounted.current && !aiResult) setLoadingStatus('📡 Mengirim berkas ke server TerraVision...');
    }, 1500);

    const statusTimeout2 = setTimeout(() => {
      if (isMounted.current && !aiResult) setLoadingStatus('🤖 Model AI sedang mengalkulasi klorofil & parameter...');
    }, 3500);

    const timeoutId = setTimeout(() => {
      if (abortController.current) {
        console.log('⚠️ Timeout dicapai.');
        abortController.current.abort();
      }
    }, REQUEST_TIMEOUT);

    try {
      const formData = new FormData();
      formData.append('lahanId', selectedLahan);

      const filename = selectedImageUri.split('/').pop() || 'leaf.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image/jpeg`;

      if (Platform.OS === 'web') {
        const responseBlob = await fetch(selectedImageUri);
        const blob = await responseBlob.blob();
        formData.append('file', blob, filename);
      } else {
        formData.append('file', {
          uri: selectedImageUri,
          name: filename,
          type: type,
        } as any);
      }

      const response = await fetch(`${BACKEND_BASE_URL}/sensor/ai/analyze-leaf`, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' },
        signal: abortController.current.signal,
      });

      clearTimeout(timeoutId);
      clearTimeout(statusTimeout);
      clearTimeout(statusTimeout2);

      if (!isMounted.current) return;

      if (!response.ok) {
        const textError = await response.text().catch(() => "Unknown Server Error");
        throw new Error(`HTTP Error ${response.status}: ${textError}`);
      }

      const responseData = await response.json();

      if (responseData && (responseData.result || responseData.suggestion)) {
        setAiResult({
          result: sanitizeText(responseData.result || 'Analisis selesai.'),
          suggestion: sanitizeText(responseData.suggestion || 'Tidak ada saran spesifik.'),
          analyzedAt: responseData.analyzedAt || new Date().toLocaleString()
        });

        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      } else {
        throw new Error('Payload corrupt atau struktur response salah.');
      }
    } catch (error: any) {
      clearTimeout(timeoutId);
      clearTimeout(statusTimeout);
      clearTimeout(statusTimeout2);
      if (!isMounted.current) return;
      
      console.error('❌ Error Diagnosa:', error);

      if (error.name === 'AbortError') {
        Alert.alert('Koneksi Terputus', 'Batas waktu habis. Pastikan IP backend benar dan server berjalan.');
      } else {
        Alert.alert('Diagnosa Gagal', error.message || 'Sistem AI gagal memproses data.');
      }
    } finally {
      if (isMounted.current) {
        setLoading(false); 
        abortController.current = null; 
      }
    }
  }, [selectedLahan, selectedImageUri, loading, aiResult]);

  useEffect(() => {
    fetchDaftarLahan();
  }, [fetchDaftarLahan]);

  const renderHeader = () => (
    <View>
      <Text style={styles.title}>🤖 TerraVision AI Expert</Text>
      <Text style={styles.subtitle}>Diagnosis kesehatan daun berbasis kondisi real-time sensor lahan.</Text>
    </View>
  );

  const renderLahanSelection = () => (
    <View>
      <Text style={styles.label}>Zona Lahan Terpilih:</Text>
      {daftarLahan.length === 0 ? (
        <Text style={styles.emptyText}>⚠️ Tidak ada data lahan. Periksa endpoint /sensor/lahan di NestJS.</Text>
      ) : (
        daftarLahan.map((lahan) => (
          <TouchableOpacity 
            key={lahan.id} 
            style={[styles.lahanButton, selectedLahan === lahan.id && styles.lahanButtonActive]}
            onPress={() => setSelectedLahan(lahan.id)}
            disabled={loading}
            activeOpacity={0.7}
          >
            <Text style={[styles.lahanText, selectedLahan === lahan.id && styles.lahanTextActive]}>
              {lahan.namaLahan} {selectedLahan === lahan.id ? '✅' : ''}
            </Text>
          </TouchableOpacity>
        ))
      )}
    </View>
  );

  const renderAttachmentBox = () => (
    <TouchableOpacity 
      style={styles.uploadBox} 
      onPress={handleCaptureLeaf} 
      disabled={loading}
      activeOpacity={0.8}
    >
      {selectedImageUri ? (
        <View style={styles.previewContainer}>
          {/* 🟢 PERBAIKAN: Properti resizeMode dipindah ke properti langsung komponen Image */}
          <Image 
            source={{ uri: selectedImageUri }} 
            style={styles.imagePreview} 
            resizeMode="cover" 
          />
          {!loading && <Text style={styles.uploadBoxTextUpdate}>🔄 Ketuk untuk Mengambil Ulang Gambar</Text>}
        </View>
      ) : (
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.leafIcon}>📸</Text>
          <Text style={styles.uploadBoxText}>Ketuk untuk Mengambil Citra Sampel Daun</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderSubmitButton = () => (
    <TouchableOpacity 
      style={[styles.button, loading && styles.buttonDisabled]} 
      onPress={handleAnalyzeLeaf}
      disabled={loading} 
      activeOpacity={0.8}
    >
      {loading ? (
        <View style={styles.buttonLoadingContainer}>
          <ActivityIndicator size="small" color="#ffffff" style={{ marginRight: 8 }} />
          <Text style={styles.buttonText}>Mengevaluasi Daun...</Text>
        </View>
      ) : (
        <Text style={styles.buttonText}>Mulai Diagnosa Tanaman</Text>
      )}
    </TouchableOpacity>
  );

  const renderLoadingSpinner = () => loading && (
    <View style={styles.center}>
      <ActivityIndicator size="large" color="#059669" />
      <Text style={styles.loadingText}>{loadingStatus}</Text>
      <Text style={styles.loadingSubText}>Mohon tunggu, proses ini membutuhkan komputasi model vision.</Text>
    </View>
  );

  const renderPlaceholder = () => !loading && !aiResult && (
    <Text style={styles.placeholderText}>
      Silakan pilih lahan dan potret daun melalui tombol di atas untuk memuat analisis pakar cerdas AI.
    </Text>
  );

  const renderAiOutcome = () => !loading && aiResult && (
    <View style={styles.resultContainer}>
      <View style={styles.resultHeader}>
        <Text style={styles.badge}>HASIL DIAGNOSIS</Text>
        <Text style={styles.timeText}>{aiResult.analyzedAt}</Text>
      </View>
      <Text style={styles.resultTitle}>Kesimpulan Sistem:</Text>
      <Text style={[styles.resultValue, aiResult.result.toLowerCase().includes('sehat') ? styles.textGreen : styles.textAmber]}>
        {aiResult.result}
      </Text>
      <View style={styles.suggestionBox}>
        <Text style={styles.suggestionTitle}>📋 Rekomendasi Tindakan:</Text>
        <Text style={styles.suggestionText}>{aiResult.suggestion}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView 
      ref={scrollViewRef} 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
    >
      {renderHeader()}
      <View style={styles.card}>
        {renderLahanSelection()}
        {renderAttachmentBox()}
        {renderSubmitButton()}
      </View>
      <View style={styles.resultCard}>
        {renderLoadingSpinner()}
        {renderPlaceholder()}
        {renderAiOutcome()}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb', padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1f2937', marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#6b7280', marginBottom: 20, lineHeight: 18 },
  card: { backgroundColor: '#ffffff', padding: 16, borderRadius: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2, marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '700', color: '#374151', marginBottom: 10 },
  lahanButton: { padding: 14, borderRadius: 10, backgroundColor: '#f3f4f6', marginBottom: 8, borderWidth: 1, borderColor: '#e5e7eb' },
  lahanButtonActive: { backgroundColor: '#e6f4ea', borderColor: '#10b981' },
  lahanText: { fontSize: 14, color: '#4b5563', fontWeight: '500' },
  lahanTextActive: { color: '#065f46', fontWeight: '700' },
  emptyText: { color: '#ef4444', fontSize: 13, fontStyle: 'italic', marginVertical: 8, fontWeight: '500' },
  leafIcon: { fontSize: 36, textAlign: 'center' },
  uploadBox: { borderStyle: 'dashed', borderWidth: 2, borderColor: '#a7f3d0', backgroundColor: '#f0fdf4', borderRadius: 10, padding: 18, alignItems: 'center', marginVertical: 12 },
  uploadBoxText: { fontSize: 12, color: '#047857', fontWeight: '600', marginTop: 6 },
  uploadBoxTextUpdate: { fontSize: 11, color: '#047857', fontWeight: '700', marginTop: 6 },
  previewContainer: { width: '100%', alignItems: 'center' },
  imagePreview: { width: '100%', height: 150, borderRadius: 8 }, 
  button: { backgroundColor: '#059669', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 6, shadowColor: '#059669', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 },
  buttonDisabled: { backgroundColor: '#9ca3af', shadowOpacity: 0, elevation: 0 },
  buttonText: { color: '#ffffff', fontWeight: 'bold', fontSize: 15 },
  buttonLoadingContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  resultCard: { backgroundColor: '#ffffff', padding: 16, borderRadius: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2, minHeight: 160, justifyContent: 'center', marginBottom: 40 },
  resultContainer: { width: '100%' },
  center: { alignItems: 'center', justifyContent: 'center', paddingVertical: 15 },
  loadingText: { color: '#111827', marginTop: 12, fontSize: 14, fontWeight: '600', textAlign: 'center' },
  loadingSubText: { color: '#6b7280', fontSize: 11, marginTop: 4, textAlign: 'center', paddingHorizontal: 20 },
  placeholderText: { color: '#9ca3af', textAlign: 'center', fontSize: 13, lineHeight: 18, paddingHorizontal: 10 },
  resultHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#f3f4f6', paddingBottom: 10, marginBottom: 12 },
  badge: { backgroundColor: '#d1fae5', color: '#065f46', fontSize: 11, fontWeight: 'bold', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  timeText: { fontSize: 11, color: '#9ca3af' },
  resultTitle: { fontSize: 12, color: '#9ca3af', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  resultValue: { fontSize: 19, fontWeight: 'bold', marginTop: 4, marginBottom: 14 },
  textGreen: { color: '#059669' },
  textAmber: { color: '#d97706' },
  suggestionBox: { backgroundColor: '#fffbeb', borderLeftWidth: 4, borderLeftColor: '#f59e0b', padding: 14, borderRadius: 8 },
  suggestionTitle: { fontSize: 14, fontWeight: 'bold', color: '#78350f' },
  suggestionText: { fontSize: 13, color: '#92400e', marginTop: 4, lineHeight: 20 }
});