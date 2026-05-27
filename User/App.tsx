import React, { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';

export default function App() {
  // State interaktif untuk memantau rute halaman mana yang sedang aktif dibuka oleh user
  const [currentScreen, setCurrentScreen] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  
  // 🟢 Tambahkan state baru untuk menyimpan email yang gagal didaftarkan (karena sudah ada)
  const [savedEmail, setSavedEmail] = useState('');

  // 🟢 Fungsi navigasi baru yang bisa menerima kiriman email dari halaman register
  const handleNavigateToLogin = (emailFromRegister?: string) => {
    if (emailFromRegister) {
      setSavedEmail(emailFromRegister); // Simpan emailnya di sini
    }
    setCurrentScreen('LOGIN');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Pengondisian Rute: Menampilkan halaman secara dinamis berdasarkan isi state currentScreen */}
      {currentScreen === 'LOGIN' ? (
        <LoginScreen 
          navigation={null} 
          initialEmail={savedEmail} // 🟢 Kirim email yang tersimpan tadi ke LoginScreen
          onNavigateToRegister={() => {
            setSavedEmail(''); // Reset email saat pindah ke register baru
            setCurrentScreen('REGISTER');
          }} 
        />
      ) : (
        <RegisterScreen 
          onNavigateToLogin={handleNavigateToLogin} // 🟢 Gunakan fungsi baru kita yang siap menerima 1 argumen
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