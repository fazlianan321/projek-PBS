import React, { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import DashboardScreen from './src/screens/DashboardScreen'; // 🟢 1. Impor halaman dashboard final kamu

export default function App() {
  // 🟢 2. Tambahkan 'DASHBOARD' ke dalam tipe state navigasi kamu
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
      {/* 🟢 3. Pengondisian Rute Tiga Halaman */}
      {currentScreen === 'LOGIN' ? (
        <LoginScreen 
          // 🟢 4. Ganti navigation={null} dengan fungsi tiruan untuk mengalihkan ke DASHBOARD
          navigation={{
            navigate: () => setCurrentScreen('DASHBOARD'),
            replace: () => setCurrentScreen('DASHBOARD'),
          }} 
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
        // 🟢 5. Tampilkan halaman Dashboard jika state bernilai 'DASHBOARD'
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