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