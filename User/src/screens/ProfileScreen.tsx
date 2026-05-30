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

    // Suntikkan data input ke profil secara reaktif
    setUserData({
      ...userData,
      phone: inputPhone,
      birthDate: inputBirthDate,
      joinedSince: formattedDate
    });

    setIsVerified(true);
    setIsModalVisible(false);

    if (Platform.OS === 'web') {
      alert("Verifikasi Sukses 🎉\nNomor WhatsApp dan koordinat lahan berhasil diintegrasikan ke sistem AI!");
    } else {
      Alert.alert("Verifikasi Sukses 🎉", "Nomor WhatsApp dan koordinat lahan berhasil diintegrasikan ke sistem AI!");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#047857" />
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      
      {/* HEADER BAR */}
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.elegantBackButton} onPress={onBackToDashboard} activeOpacity={0.6}>
          <Text style={styles.backIconText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profil Akun Petani</Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
      >
        <View style={[styles.profileLayout, { flexDirection: isDesktop ? 'row' : 'column' }]}>
          
          {/* KARTU AVATAR UTAMA */}
          <View style={[styles.avatarCard, { width: isDesktop ? '35%' : '100%' }]}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarInitials}>VF</Text>
            </View>
            <Text style={styles.userName}>{userData.name}</Text>
            <Text style={styles.userRole}>{userData.role}</Text>
            
            {/* AREA BADGE VERIFIKASI */}
            <View style={styles.badgeWrapper}>
              <TouchableOpacity 
                style={[styles.badgeContainer, isVerified ? styles.bgSuccess : styles.bgWarning]}
                onPress={handleRequestVerification}
                activeOpacity={0.7}
              >
                <Text style={[styles.verifiedBadge, isVerified ? styles.textSuccess : styles.textWarning]}>
                  {isVerified ? '🛡️ Akun Terverifikasi' : '⚠️ Belum Verifikasi (Klik Sini)'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* DETAIL INFORMASI AKUN & LAHAN */}
          <View style={[styles.infoContainer, { width: isDesktop ? '60%' : '100%' }]}>
            
            {/* GRUP 1: INFORMASI PRIBADI */}
            <Text style={styles.sectionTitle}>Informasi Personal</Text>
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>📧 Email Akun</Text>
                {/* 🟢 [DIUBAH]: Menggunakan value properti email dinamis dari props */}
                <Text style={styles.infoValue}>{userEmail || 'tidak_diketahui@email.com'}</Text>
              </View>
              <View style={styles.divider} />
              
              {/* 🟢 [DIUBAH]: Baris nomor WhatsApp menampilkan teks merah jika belum verifikasi */}
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>📞 No. WhatsApp</Text>
                <Text style={[styles.infoValue, !isVerified && styles.textMuted]}>
                  {isVerified ? userData.phone : 'Belum Terverifikasi ❌'}
                </Text>
              </View>
              <View style={styles.divider} />
              
              {/* 🟢 [DITAMBAHKAN]: Baris data tanggal lahir baru */}
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>🎂 Tanggal Lahir</Text>
                <Text style={[styles.infoValue, !isVerified && styles.textMuted]}>
                  {isVerified ? userData.birthDate : 'Belum Terverifikasi ❌'}
                </Text>
              </View>
              <View style={styles.divider} />
              
              {/* 🟢 [DIUBAH]: Baris tanggal bergabung menjadi dinamis setelah klik submit */}
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>📅 Akun Aktif Sejak</Text>
                <Text style={[styles.infoValue, !isVerified && styles.textMuted]}>
                  {userData.joinedSince}
                </Text>
              </View>
            </View>

            {/* GRUP 2: INTEGRASI SISTEM IOT */}
            <Text style={styles.sectionTitle}>Sistem & Kepemilikan Lahan</Text>
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>📍 Lokasi Geografis</Text>
                <Text style={styles.infoValue}>{userData.lokasi}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>🌿 Kode Node Lahan</Text>
                <Text style={styles.infoValue}>{userData.lahanName}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>🤖 Mode Penjaga</Text>
                <Text style={[styles.infoValue, { color: '#047857', fontWeight: '800' }]}>AI Otomatis Aktif</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={onLogout} activeOpacity={0.8}>
              <Text style={styles.logoutButtonText}>🔴 Keluar dari Aplikasi</Text>
            </TouchableOpacity>

          </View>
        </View>
      </ScrollView>

      {/* 🟢 [DITAMBAHKAN]: Komponen UI Modal Lembar Formulir Verifikasi Baru */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Formulir Aktivasi Akun Petani</Text>
            <Text style={styles.modalSubtitle}>Lengkapi data identitas di bawah untuk mengaktifkan sistem kontrol otomatis IoT lahan Anda.</Text>

            <Text style={styles.inputLabel}>Nomor WhatsApp Aktif</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Contoh: 081234567890"
              keyboardType="phone-pad"
              value={inputPhone}
              onChangeText={setInputPhone}
            />

            <Text style={styles.inputLabel}>Tanggal Lahir Pemilik Lahan</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Contoh: 12 Agustus 1985"
              value={inputBirthDate}
              onChangeText={setInputBirthDate}
            />

            <View style={styles.modalActionRow}>
              <TouchableOpacity style={styles.cancelModalButton} onPress={() => setIsModalVisible(false)}>
                <Text style={styles.cancelModalText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitModalButton} onPress={handleSummitVerification}>
                <Text style={styles.submitModalText}>Verifikasi Sekarang</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}

