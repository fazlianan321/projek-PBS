import React, { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import DashboardScreen from './src/screens/DashboardScreen'; 
// 1. 🟢 IMPORT PROFILE SCREEN YANG BARU
import ProfileScreen from './src/screens/ProfileScreen'; 

export default function App() {
  // 2. 🟢 Mengelola status rute navigasi aplikasi secara dinamis
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
          // 3. 🟢 Oper prop ke Dashboard untuk navigasi masuk ke Profile
          onNavigateToProfile={() => setCurrentScreen('PROFILE')}
        />
      ) : (
        // 4. 🟢 Render ProfileScreen dengan alur keluar masuk yang lengkap
        <ProfileScreen 
          onLogout={() => setCurrentScreen('LOGIN')} 
          // 🟢 KUNCI PERBAIKAN: Berikan jalan balik ke dashboard lahan cerdas
          onBackToDashboard={() => setCurrentScreen('DASHBOARD')} 
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