import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, useWindowDimensions, ActivityIndicator, Alert } from 'react-native';

interface ProfileProps {
  onLogout: () => void;
  onBackToDashboard: () => void; // Menghilangkan alur buntu navigasi
}

export default function ProfileScreen({ onLogout, onBackToDashboard }: ProfileProps) {
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;
  const [loading] = useState(false);

  // State Verifikasi Dinamis
  const [isVerified, setIsVerified] = useState(false);

  // State Data Profil Pengguna menggunakan Identitas Resmi Kampus
  const [userData] = useState({
    name: 'Vivi & Fazli',
    role: 'Pemilik Lahan (Master Admin)',
    email: 'vivi_restu_anggraini@teknokrat.ac.id',
    phone: '+62 812-3456-7890',
    joinedSince: 'Mei 2026',
    lahanName: 'Lahan Utama TRV-001',
    lokasi: 'Bandar Lampung, Indonesia'
  });

  // Fungsi Alert Verifikasi (Dijamin langsung merespons saat ditekan)
  const handleRequestVerification = () => {
    if (isVerified) {
      Alert.alert("Informasi", "Akun Anda sudah berhasil terverifikasi.");
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
            setTimeout(() => {
              Alert.alert("Verifikasi Sukses 🎉", "Sistem AI berhasil memverifikasi hak akses kepemilikan lahan Anda!");
            }, 300);
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
      
      {/* HEADER BAR DENGAN TOMBOL NAVIGASI KEMBALI LEBIH ELEGAN */}
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.elegantBackButton} onPress={onBackToDashboard} activeOpacity={0.6}>
          <Text style={styles.backIconText}>✕</Text>
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
            
            {/* Badge Verifikasi Interaktif - Diperbaiki agar responsif */}
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
  
  // Desain Baru Header Minimalis & Tombol Kembali Bulat Elegan
  headerBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', paddingHorizontal: 24, paddingVertical: 16, borderBottomWidth: 1, borderColor: '#f1f5f9' },
  elegantBackButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  backIconText: { fontSize: 14, fontWeight: 'bold', color: '#64748b', marginTop: -1 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a' },
  
  scrollContent: { padding: 24 },
  profileLayout: { justifyContent: 'space-between', gap: 24 },
  avatarCard: { backgroundColor: '#ffffff', borderRadius: 24, padding: 32, alignItems: 'center', borderWidth: 1, borderColor: '#f1f5f9' },
  avatarCircle: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#ecfdf5', justifyContent: 'center', alignItems: 'center', marginBottom: 16, borderWidth: 1, borderColor: '#a7f3d0' },
  avatarInitials: { fontSize: 32, fontWeight: '700', color: '#059669' },
  userName: { fontSize: 22, fontWeight: '700', color: '#0f172a' },
  userRole: { fontSize: 13, color: '#64748b', marginTop: 4, textAlign: 'center' },
  
  // Pembaruan Style Card Badge Verifikasi
  badgeContainer: { marginTop: 16, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  bgSuccess: { backgroundColor: '#d1fae5', borderColor: '#a7f3d0' },
  bgWarning: { backgroundColor: '#fee2e2', borderColor: '#fca5a5' },
  verifiedBadge: { fontSize: 13, fontWeight: '600' },
  textSuccess: { color: '#065f46' },
  textWarning: { color: '#b91c1c' },

  infoContainer: { gap: 12 },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: '#94a3b8', letterSpacing: 0.5, marginBottom: 6, marginTop: 12, textTransform: 'uppercase' },
  infoCard: { backgroundColor: '#ffffff', borderRadius: 20, paddingHorizontal: 20, borderWidth: 1, borderColor: '#f1f5f9' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 16, alignItems: 'center' },
  infoLabel: { fontSize: 14, fontWeight: '500', color: '#64748b' },
  infoValue: { fontSize: 14, fontWeight: '600', color: '#0f172a' },
  divider: { height: 1, backgroundColor: '#f1f5f9' },
  logoutButton: { backgroundColor: '#fff5f5', borderWidth: 1, borderColor: '#fee2e2', borderRadius: 16, padding: 16, alignItems: 'center', justifyContent: 'center', marginTop: 16 },
  logoutButtonText: { color: '#e11d48', fontWeight: '600', fontSize: 14 }
});