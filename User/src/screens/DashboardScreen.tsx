import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function DashboardScreen({ onLogout }: { onLogout: () => void }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌱 Dashboard TerraVision Shell</Text>
      <TouchableOpacity style={styles.btn} onPress={onLogout}>
        <Text style={styles.btnText}>Keluar</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' },
  title: { fontSize: 20, fontWeight: '700', color: '#0f172a' },
  btn: { marginTop: 20, backgroundColor: '#ef4444', padding: 10, borderRadius: 8 },
  btnText: { color: '#white', fontWeight: '600' }
});
// Tambahkan Header Bar di dalam return:
<View style={styles.headerBar}>
  <View style={styles.brandContainer}>
    <Text style={styles.brandLogo}>🌱 TerraVision</Text>
    <Text style={styles.brandSubtitle}>Smart Farming Integrated System</Text>
  </View>
  <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
    <Text style={styles.logoutText}>Keluar Sistem</Text>
  </TouchableOpacity>
</View>
``` *(Gunakan styles headerBar dari desain full sebelumnya)*