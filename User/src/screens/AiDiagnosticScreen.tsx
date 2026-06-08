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