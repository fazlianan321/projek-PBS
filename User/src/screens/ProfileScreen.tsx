import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, useWindowDimensions, ActivityIndicator, Alert } from 'react-native';

// Definisi type props yang harus diterima dari App.tsx
interface ProfileProps {
  onLogout: () => void;
  onBackToDashboard: () => void; // 🟢 Menghilangkan alur buntu navigasi
}

export default function ProfileScreen({ onLogout, onBackToDashboard }: ProfileProps) {
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;
  const [loading] = useState(false);

  // 🟢 State Verifikasi Dinamis (Tidak langsung terverifikasi secara aneh)
  const [isVerified, setIsVerified] = useState(false);

  // State Data Profil Pengguna menggunakan Identitas Resmi Kampus
  const [userData] = useState({
    name: 'Vivi & Fazli',
    role: 'Pemilik Lahan (Master Admin)',
    email: 'vivi_restu_anggraini@teknokrat.ac.id', // 🟢 Menggunakan email Teknokrat yang valid
    phone: '+62 812-3456-7890',
    joinedSince: 'Mei 2026',
    lahanName: 'Lahan Utama TRV-001',
    lokasi: 'Bandar Lampung, Indonesia'
  });

  // Fungsi simulasi verifikasi data akun (Diperbaiki agar selalu merespons saat diklik)
  const handleRequestVerification = () => {
    if (isVerified) {
      Alert.alert("Informasi Akun", "Akun Anda sudah berstatus Terverifikasi.");
      return;
    }

    Alert.alert(
      "Pengajuan Verifikasi",
      "Apakah Anda ingin mengajukan verifikasi akun menggunakan email institusi Teknokrat?",
      [
        { text: "Batal", style: "cancel" },
        { 
          text: "Ajukan", 
          onPress: () => {
            setIsVerified(true);
            Alert.alert("Verifikasi Sukses", "Sistem AI berhasil memverifikasi hak akses kepemilikan lahan Anda!");
          } 
        }
      ]
    );
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
      
      {/* HEADER BAR HIJAU DENGAN TOMBOL NAVIGASI BULAT ELEGAN */}
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.elegantBackButton} onPress={onBackToDashboard} activeOpacity={0.6}>
          <Text style={styles.backIconText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profil Akun</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.profileLayout, { flexDirection: isDesktop ? 'row' : 'column' }]}>
          
          {/* KARTU AVATAR UTAMA */}
          <View style={[styles.avatarCard, { width: isDesktop ? '35%' : '100%' }]}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarInitials}>VF</Text>
            </View>
            <Text style={styles.userName}>{userData.name}</Text>
            <Text style={styles.userRole}>{userData.role}</Text>
            
            {/* Badge Verifikasi Interaktif - Diperbaiki touch event-nya */}
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

          {/* DETAIL INFORMASI AKUN & LAHAN */}
          <View style={[styles.infoContainer, { width: isDesktop ? '60%' : '100%' }]}>
            
            {/* GRUP 1: INFORMASI PRIBADI */}
            <Text style={styles.sectionTitle}>Informasi Personal</Text>
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>📧 Email</Text>
                <Text style={styles.infoValue}>{userData.email}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>📞 No. Telepon</Text>
                <Text style={styles.infoValue}>{userData.phone}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>📅 Bergabung Sejak</Text>
                <Text style={styles.infoValue}>{userData.joinedSince}</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#f8fafc' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' },
  
  // 🟢 DESAIN ELEGAN: Header Tetap Hijau Tua Asli + Tombol Lingkar Glassmorphism Modis
  headerBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#064e3b', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderColor: '#047857' },
  elegantBackButton: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255, 255, 255, 0.15)', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  backIconText: { color: '#ffffff', fontWeight: 'bold', fontSize: 20, marginTop: -2 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#ffffff', letterSpacing: -0.5 },
  
  scrollContent: { padding: 30 },
  profileLayout: { justifyContent: 'space-between', gap: 24 },
  avatarCard: { backgroundColor: '#ffffff', borderRadius: 20, padding: 30, alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0' },
  avatarCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#d1fae5', justifyContent: 'center', alignItems: 'center', marginBottom: 16, borderWidth: 3, borderColor: '#34d399' },
  avatarInitials: { fontSize: 36, fontWeight: '800', color: '#065f46' },
  userName: { fontSize: 22, fontWeight: '800', color: '#0f172a' },
  userRole: { fontSize: 13, fontWeight: '600', color: '#64748b', marginTop: 4, textAlign: 'center' },
  
  // Styling Badge Verifikasi Dinamis
  badgeContainer: { marginTop: 16, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 30, borderWidth: 1 },
  bgSuccess: { backgroundColor: '#d1fae5', borderColor: '#34d399' },
  bgWarning: { backgroundColor: '#ffedd5', borderColor: '#fed7aa' },
  verifiedBadge: { fontSize: 12, fontWeight: '700' },
  textSuccess: { color: '#065f46' },
  textWarning: { color: '#c2410c' },

  infoContainer: { gap: 12 },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: '#475569', letterSpacing: 0.5, marginBottom: 6, marginTop: 8 },
  infoCard: { backgroundColor: '#ffffff', borderRadius: 16, paddingVertical: 8, paddingHorizontal: 20, borderWidth: 1, borderColor: '#e2e8f0' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 14, alignItems: 'center' },
  infoLabel: { fontSize: 14, fontWeight: '600', color: '#64748b' },
  infoValue: { fontSize: 14, fontWeight: '700', color: '#0f172a' },
  divider: { height: 1, backgroundColor: '#f1f5f9' },
  logoutButton: { backgroundColor: '#fee2e2', borderWidth: 1, borderColor: '#fca5a5', borderRadius: 12, padding: 16, alignItems: 'center', justifyContent: 'center', marginTop: 16 },
  logoutButtonText: { color: '#b91c1c', fontWeight: '800', fontSize: 14 }
});