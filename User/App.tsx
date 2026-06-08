import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import DashboardScreen from './src/screens/DashboardScreen'; 
import ProfileScreen from './src/screens/ProfileScreen'; 
// 🟢 [DITAMBAHKAN]: Import layar AI yang baru kita buat
import AiDiagnosticScreen from './src/screens/AiDiagnosticScreen'; 

export default function App() {
  // 🟢 [DIUBAH]: Tambahkan 'AI_DIAGNOSTIC' ke dalam union type state
  const [currentScreen, setCurrentScreen] = useState<'LOGIN' | 'REGISTER' | 'DASHBOARD' | 'PROFILE' | 'AI_DIAGNOSTIC'>('LOGIN');
  const [savedEmail, setSavedEmail] = useState('');

  const [loggedInName, setLoggedInName] = useState('');
  const [loggedInEmail, setLoggedInEmail] = useState('');

  const handleNavigateToLogin = (emailFromRegister?: string) => {
    if (emailFromRegister) {
      setSavedEmail(emailFromRegister);
    }
    setCurrentScreen('LOGIN');
  };

  const handleLoginSuccess = (name: string, email: string) => {
    setLoggedInName(name);  
    setLoggedInEmail(email); 
    setCurrentScreen('DASHBOARD');
  };

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
          // 🟢 [DITAMBAHKAN]: Menambahkan navigasi dari Dashboard menuju layar AI
          // (Pastikan kamu menambahkan props 'onNavigateToAi' di komponen DashboardScreen nanti)
          onNavigateToAi={() => setCurrentScreen('AI_DIAGNOSTIC')}
        />
      ) : currentScreen === 'PROFILE' ? (
        <ProfileScreen 
          userName={loggedInName}   
          userEmail={loggedInEmail} 
          onLogout={handleLogout} 
          onBackToDashboard={() => setCurrentScreen('DASHBOARD')} 
        />
      ) : (
        // 🟢 [DITAMBAHKAN]: Merender layar AI Diagnostik beserta tombol kembali ke Dashboard
        <View style={styles.aiContainer}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => setCurrentScreen('DASHBOARD')}
          >
            <Text style={styles.backButtonText}>← Kembali ke Dashboard</Text>
          </TouchableOpacity>
          
          <AiDiagnosticScreen />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  // 🟢 [DITAMBAHKAN]: Styling khusus untuk pembungkus layar AI
  aiContainer: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  backButton: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButtonText: {
    color: '#059669',
    fontWeight: 'bold',
    fontSize: 14,
  }
});