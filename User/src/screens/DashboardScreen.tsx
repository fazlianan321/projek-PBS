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
const [metrics] = useState({ soilMoisture: '68%', temperature: '28.5°C', humidity: '75%', vegetationHealth: 'Optimal' });
// ... lalu masukkan baris <View style={styles.gridContainer}> berisi 4 buah kartu sensor ...
<View style={styles.alertPanel}>
  <Text style={styles.alertTitle}>⚡ Status Otomatisasi Node IoT</Text>
  <Text style={styles.alertDescription}>Sistem Irigasi Otomatis sedang Nonaktif. Pompa air aktif jika kelembaban &lt; 50%.</Text>
</View>
const [refreshing, setRefreshing] = useState(false);
const onRefresh = () => {
  setRefreshing(true);
  setTimeout(() => setRefreshing(false), 1500); // Simulasi reload data
};
// Pada ScrollView pasang properti ini:
// refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#047857']} />}