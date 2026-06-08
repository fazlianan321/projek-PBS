import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert 
} from 'react-native';
import axios from 'axios';
const BACKEND_BASE_URL = 'http://10.0.2.2:3000';
const REQUEST_TIMEOUT = 5000;
const apiClient = axios.create({
  baseURL: BACKEND_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  if (config.data && JSON.stringify(config.data).length > 10000) {
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
  const [aiResult, setAiResult] = useState<AiResult | null>(null);
  const isMounted = useRef<boolean>(true);
  const abortController = useRef<AbortController | null>(null);
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
      const response = await apiClient.get<Lahan[]>('/lahan');
      if (!isMounted.current) return;

      if (validateLahanData(response.data)) {
        setDaftarLahan(response.data);
        setSelectedLahan(response.data[0].id);
      } else {
        setDaftarLahan([]); 
      }
    } catch (error) {
      if (!isMounted.current) return; 
      Alert.alert('Gagal Modul', 'Koneksi ke database lahan terputus.');
    }
  }, []);
  const isInputInvalid = (): boolean => {
    return !selectedLahan || selectedLahan.trim() === '';
  };
  const handleAnalyzeLeaf = useCallback(async (): Promise<void> => {
    if (isInputInvalid()) {
      Alert.alert('Peringatan Sistem', 'Silakan tentukan zona lahan terlebih dahulu.');
      return; 
    }
    if (loading) return; 

    setLoading(true);
    setAiResult(null); 
    abortController.current = new AbortController();

    try {
      const response = await apiClient.post<AiResult>(
        '/sensor/ai/analyze-leaf', 
        { lahanId: selectedLahan },
        { signal: abortController.current.signal }
      );

      if (!isMounted.current) return;

      if (response.data && response.data.result && response.data.suggestion) {
        setAiResult({
          result: sanitizeText(response.data.result),
          suggestion: sanitizeText(response.data.suggestion),
          analyzedAt: response.data.analyzedAt || new Date().toLocaleString()
        });
      } else {
        throw new Error('Payload corrupt');
      }
    } catch (error) {
      if (!isMounted.current) return;
      if (!axios.isCancel(error)) {
        Alert.alert('Diagnosa Gagal', 'Sistem AI gagal memproses data sensor.');
      }
    } finally {
      if (isMounted.current) {
        setLoading(false); 
        abortController.current = null; 
      }
    }
  }, [selectedLahan, loading]);
  useEffect(() => {
    fetchDaftarLahan();
  }, [fetchDaftarLahan]);