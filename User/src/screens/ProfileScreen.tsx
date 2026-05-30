import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, useWindowDimensions, ActivityIndicator, Alert, Platform, Modal, TextInput } from 'react-native';

// 🟢 [DIUBAH]: Menambahkan properti userEmail agar dinamis sesuai akun yang login
interface ProfileProps {
  userEmail: string; 
  onLogout: () => void;
  onBackToDashboard: () => void; 
}

export default function ProfileScreen({ userEmail, onLogout, onBackToDashboard }: ProfileProps) {
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;
  const [loading] = useState(false);

  // Status Verifikasi Dinamis
  const [isVerified, setIsVerified] = useState(false);

  // 🟢 [DITAMBAHKAN]: State kontrol visibilitas formulir pop-up (Modal)
  const [isModalVisible, setIsModalVisible] = useState(false);

  // 🟢 [DITAMBAHKAN]: State penampung input formulir dari petani
  const [inputPhone, setInputPhone] = useState('');
  const [inputBirthDate, setInputBirthDate] = useState('');

  // 🟢 [DIUBAH]: Mengosongkan data awal nomor, tanggal lahir, dan tanggal bergabung petani
  const [userData, setUserData] = useState({
    name: 'Vivi & Fazli',
    role: 'Pemilik Lahan (Master Admin)',
    phone: '', 
    birthDate: '', 
    joinedSince: 'Belum Aktif ❌', 
    lahanName: 'Lahan Utama TRV-001',
    lokasi: 'Bandar Lampung, Indonesia'
  });

  // 🟢 [DIUBAH]: Fungsi dialihkan untuk membuka formulir pengisian jika belum verifikasi
  const handleRequestVerification = () => {
    if (isVerified) {
      if (Platform.OS === 'web') {
        alert("Informasi Akun: Akun petani Anda sudah berstatus aktif dan terverifikasi.");
      } else {
        Alert.alert("Informasi Akun", "Akun petani Anda sudah berstatus aktif dan terverifikasi.");
      }
      return;
    }
    
    // Buka formulir input modal jika belum verifikasi
    setIsModalVisible(true);
  };

  // 🟢 [DITAMBAHKAN]: Fungsi eksekusi tombol "Verifikasi Sekarang" di dalam modal
  const handleSummitVerification = () => {
    if (!inputPhone.trim() || !inputBirthDate.trim()) {
      if (Platform.OS === 'web') {
        alert("Data Tidak Lengkap: Silakan isi Nomor WhatsApp dan Tanggal Lahir terlebih dahulu.");
      } else {
        Alert.alert("Data Tidak Lengkap", "Silakan isi Nomor WhatsApp dan Tanggal Lahir terlebih dahulu.");
      }
      return;
    }

    // Ambil bulan dan tahun hari ini secara otomatis untuk tanggal bergabung
    const today = new Date();
    const formattedDate = today.toLocaleDateString('id-ID', { year: 'numeric', month: 'long' });

    