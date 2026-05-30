import React, { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import DashboardScreen from './src/screens/DashboardScreen'; 

export default function App() {
  // State navigasi interaktif mendukung rute LOGIN, REGISTER, dan DASHBOARD
  const [currentScreen, setCurrentScreen] = useState<'LOGIN' | 'REGISTER' | 'DASHBOARD'>('LOGIN');
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
          // 🟢 KUNCI PERBAIKAN: Oper callback langsung untuk memicu perpindahan rute ke Dashboard
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
      ) : (
        <DashboardScreen 
          onLogout={() => setCurrentScreen('LOGIN')} 
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