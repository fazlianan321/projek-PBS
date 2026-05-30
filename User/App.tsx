import React, { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import DashboardScreen from './src/screens/DashboardScreen'; 
import ProfileScreen from './src/screens/ProfileScreen'; 

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'LOGIN' | 'REGISTER' | 'DASHBOARD' | 'PROFILE'>('LOGIN');
  const [savedEmail, setSavedEmail] = useState('');

  // 🟢 [DITAMBAHKAN]: State untuk menyimpan data user yang sedang login secara rill
  const [loggedInName, setLoggedInName] = useState('');
  const [loggedInEmail, setLoggedInEmail] = useState('');

  const handleNavigateToLogin = (emailFromRegister?: string) => {
    if (emailFromRegister) {
      setSavedEmail(emailFromRegister);
    }
    setCurrentScreen('LOGIN');
  };

  // 🟢 [DITAMBAHKAN]: Fungsi handle login yang menerima parameter nama dan email dari LoginScreen
  const handleLoginSuccess = (name: string, email: string) => {
    setLoggedInName(name);  // Simpan nama rill hasil input login/regis
    setLoggedInEmail(email); // Simpan email rill hasil input login/regis
    setCurrentScreen('DASHBOARD');
  };

  // 🟢 [DITAMBAHKAN]: Fungsi handle logout untuk membersihkan session data
  const handleLogout = () => {
    setLoggedInName('');
    setLoggedInEmail('');
    setCurrentScreen('LOGIN');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Pengondisian Rute Dinamis */}
      {currentScreen === 'LOGIN' ? (
        <LoginScreen 
          // 🟢 [DIUBAH]: Menerima lemparan nama & email saat login berhasil
          onLoginSuccess={handleLoginSuccess} 
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
          onLogout={handleLogout} 
          onNavigateToProfile={() => setCurrentScreen('PROFILE')}
        />
      ) : (
        // 🟢 [DIUBAH]: Sekarang ProfileScreen sukses menerima nama & email yang sinkron!
        <ProfileScreen 
          userName={loggedInName}   // Mengoper nama rill dari data login
          userEmail={loggedInEmail} // Mengoper email rill dari data login
          onLogout={handleLogout} 
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