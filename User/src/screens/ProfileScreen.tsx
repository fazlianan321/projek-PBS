import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, useWindowDimensions, ActivityIndicator } from 'react-native';

export default function ProfileScreen({ onLogout }: { onLogout: () => void }) {
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;
  const [loading] = useState(false);

  // State Data Profil Pengguna (Siap diintegrasikan ke API backend NestJS nantinya)
  const [userData] = useState({
    name: 'Fazli',
    role: 'Pemilik Lahan (Master Admin)',
    email: 'fazli@terravision.io',
    phone: '+62 812-3456-7890',
    joinedSince: 'Oktober 2025',
    totalLahan: 1,
    lahanName: 'Lahan Utama TRV-001',
    lokasi: 'Bandar Lampung, Indonesia'
  });

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
        <Text style={styles.headerTitle}>Profil Akun</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.profileLayout, { flexDirection: isDesktop ? 'row' : 'column' }]}>
          
          {/* KARTU AVATAR UTAMA */}
          <View style={[styles.avatarCard, { width: isDesktop ? '35%' : '100%' }]}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarInitials}>FZ</Text>
            </View>
            <Text style={styles.userName}>{userData.name}</Text>
            <Text style={styles.userRole}>{userData.role}</Text>
            <View style={styles.badgeContainer}>
              <Text style={styles.verifiedBadge}>🛡️ Akun Terverifikasi</Text>
            </View>
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