import React, { useState } from 'react'; // <-- Ditambahkan useState untuk melacak posisi halaman
import { SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';

export default function App() {
  // State interaktif untuk memantau rute halaman mana yang sedang aktif dibuka oleh user
  const [currentScreen, setCurrentScreen] = useState<'LOGIN' | 'REGISTER'>('LOGIN');

  return (
    <SafeAreaView style={styles.container}>
      {/* Pengondisian Rute: Menampilkan halaman secara dinamis berdasarkan isi state currentScreen */}
      {currentScreen === 'LOGIN' ? (
        <LoginScreen 
          navigation={null} // Sementara diisi null karena di mode web kita pakai state-routing
          onNavigateToRegister={() => setCurrentScreen('REGISTER')} // Aksi beralih ke halaman pendaftaran
        />
      ) : (
        <RegisterScreen 
          onNavigateToLogin={() => setCurrentScreen('LOGIN')} // Aksi kembali ke halaman masuk
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});