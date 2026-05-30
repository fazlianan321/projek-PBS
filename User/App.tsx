import React, { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import DashboardScreen from './src/screens/DashboardScreen'; 
// 1. 🟢 IMPORT PROFILE SCREEN YANG BARU
import ProfileScreen from './src/screens/ProfileScreen'; 

export default function App() {
  // 2. 🟢 Tambahkan tipe 'PROFILE' ke dalam state rute navigasi
  const [currentScreen, setCurrentScreen] = useState<'LOGIN' | 'REGISTER' | 'DASHBOARD' | 'PROFILE'>('LOGIN');
  const [savedEmail, setSavedEmail] = useState('');

  const handleNavigateToLogin = (emailFromRegister?: string) => {
    if (emailFromRegister) {
      setSavedEmail(emailFromRegister);
    }
    setCurrentScreen('LOGIN');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Pengondisian Rute Dinamis */}
      {currentScreen === 'LOGIN' ? (
        <LoginScreen 
          onLoginSuccess={() => setCurrentScreen('DASHBOARD')} 
          initialEmail={savedEmail}
          onNavigateToRegister={() => {
            setSavedEmail('');
            setCurrentScreen('REGISTER');
          }} 
        />
      ) : currentScreen === 'REGISTER' ? (
        <RegisterScreen 
          onNavigateToLogin={handleNavigateToLogin}
        />
      ) : currentScreen === 'DASHBOARD' ? (
        <DashboardScreen 
          onLogout={() => setCurrentScreen('LOGIN')} 
          // 3. 🟢 Oper prop ke Dashboard untuk navigasi ke Profile jika dibutuhkan
          // (Atau jika di dalam DashboardScreen kamu punya tombol tab profil)
          onNavigateToProfile={() => setCurrentScreen('PROFILE')}
        />
      ) : (
        // 4. 🟢 Render ProfileScreen saat currentScreen bernilai 'PROFILE'
        <ProfileScreen 
          onLogout={() => setCurrentScreen('LOGIN')} 
          // Jika ingin ada tombol kembali ke Dashboard dari halaman profil:
          // onBackToDashboard={() => setCurrentScreen('DASHBOARD')} 
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