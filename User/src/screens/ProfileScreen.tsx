import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, useWindowDimensions, ActivityIndicator, Alert, Platform, Modal, TextInput } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ProfileProps {
  userName: string;  
  userEmail: string; 
  onLogout: () => void;
  onBackToDashboard: () => void; 
}

export default function ProfileScreen({ userName, userEmail, onLogout, onBackToDashboard }: ProfileProps) {
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;
  const [loading, setLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [inputPhone, setInputPhone] = useState('');
  const [birthDate, setBirthDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isDateSelected, setIsDateSelected] = useState(false);
  const [otpStep, setOtpStep] = useState<'INPUT_DATA' | 'INPUT_OTP'>('INPUT_DATA');
  const [inputOtp, setInputOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState(''); 
  const [timer, setTimer] = useState(60); 
  const [userData, setUserData] = useState({
    role: 'Pemilik Lahan (Master Admin)',
    phone: '', 
    birthDate: '', 
    joinedSince: 'Belum Aktif ❌', 
    lahanName: 'Lahan Utama TRV-001',
    lokasi: 'Bandar Lampung, Indonesia'
  });

  useEffect(() => {
    const loadPersistedData = async () => {
      try {
        const storageKey = `@profile_data_${userEmail}`;
        const jsonValue = await AsyncStorage.getItem(storageKey);
        
        if (jsonValue != null) {
          const persisted = JSON.parse(jsonValue);
          setUserData(persisted.userData);
          setIsVerified(persisted.isVerified);
        }
      } catch (error) {
        console.error("Gagal memuat data dari local storage:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userEmail) {
      loadPersistedData();
    } else {
      setLoading(false);
    }
  }, [userEmail]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (otpStep === 'INPUT_OTP' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpStep, timer]);

  const handleRequestVerification = () => {
    if (isVerified) {
      const msg = "Informasi Akun: Akun petani Anda sudah berstatus aktif dan terverifikasi.";
      Platform.OS === 'web' ? alert(msg) : Alert.alert("Informasi Akun", msg);
      return;
    }
  
    setOtpStep('INPUT_DATA');
    setInputOtp('');
    setTimer(60);
    setIsModalVisible(true);
  };

  const formatIndonesianDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios'); 
    if (selectedDate) {
      setBirthDate(selectedDate);
      setIsDateSelected(true);
    }
  };

  const handleRequestOtp = () => {
    if (!inputPhone.trim() || !isDateSelected) {
      const alertMsg = "Data Tidak Lengkap: Silakan isi Nomor WhatsApp dan Pilih Tanggal Lahir terlebih dahulu.";
      Platform.OS === 'web' ? alert(alertMsg) : Alert.alert("Data Tidak Lengkap", alertMsg);
      return;
    }

    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(randomOtp);
    setTimer(60); 
    
    const otpNotice = `[SISTEM TERVISI OTP GATEWAY]\nKode verifikasi rahasia Anda adalah: ${randomOtp}`;
    Platform.OS === 'web' ? alert(otpNotice) : Alert.alert("🔐 Kode OTP Dikirim", otpNotice);
    setOtpStep('INPUT_OTP');
  };

  const handleVerifyOtp = async () => {
    if (inputOtp !== generatedOtp) {
      const errMsg = "Kode OTP tidak sesuai. Silakan periksa kembali pesan WhatsApp Anda.";
      Platform.OS === 'web' ? alert(errMsg) : Alert.alert("Verifikasi Gagal ❌", errMsg);
      return;
    }
    const today = new Date();
    const formattedDate = today.toLocaleDateString('id-ID', { year: 'numeric', month: 'long' });
    const updatedUserData = {
      ...userData,
      phone: inputPhone,
      birthDate: formatIndonesianDate(birthDate),
      joinedSince: formattedDate
    };

    setUserData(updatedUserData);
    setIsVerified(true);
    setIsModalVisible(false);
    try {
      const storageKey = `@profile_data_${userEmail}`;
      const dataToSave = {
        userData: updatedUserData,
        isVerified: true
      };
      await AsyncStorage.setItem(storageKey, JSON.stringify(dataToSave));
    } catch (error) {
      console.error("Gagal menyimpan data ke local storage:", error);
    }

    const successMsg = "Verifikasi Sukses 🎉\nNomor WhatsApp Anda berhasil diverifikasi ke cloud gateway sistem IoT!";
    Platform.OS === 'web' ? alert(successMsg) : Alert.alert("Selamat! 🎉", successMsg);
  };

  const getInitials = (name: string) => {
    if (!name) return 'PF'; 
    const words = name.trim().split(' ');
    if (words.length > 1) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return words[0][0].toUpperCase();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#047857" />
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      
      {/* HEADER BAR */}
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.elegantBackButton} onPress={onBackToDashboard} activeOpacity={0.6}>
          <Text style={styles.backIconText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profil Akun Petani</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="always">
        <View style={[styles.profileLayout, { flexDirection: isDesktop ? 'row' : 'column' }]}>
          
          {/* KARTU AVATAR UTAMA */}
          <View style={[styles.avatarCard, { width: isDesktop ? '35%' : '100%' }]}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarInitials}>{getInitials(userName)}</Text>
            </View>
            <Text style={styles.userName}>{userName || 'Nama Petani'}</Text>
            <Text style={styles.userRole}>{userData.role}</Text>
            
            {/* AREA BADGE VERIFIKASI */}
            <View style={styles.badgeWrapper}>
              <TouchableOpacity 
                style={[styles.badgeContainer, isVerified ? styles.bgSuccess : styles.bgWarning]}
                onPress={handleRequestVerification}
                activeOpacity={0.7}
              >
                <Text style={[styles.verifiedBadge, isVerified ? styles.textSuccess : styles.textWarning]}>
                  {isVerified ? '🛡️ Akun Terverifikasi' : '⚠️ Belum Verifikasi (Klik Sini)'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* DETAIL INFORMASI AKUN & LAHAN */}
          <View style={[styles.infoContainer, { width: isDesktop ? '60%' : '100%' }]}>
            
            {/* GRUP 1: INFORMASI PRIBADI */}
            <Text style={styles.sectionTitle}>Informasi Personal</Text>
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>📧 Email Akun</Text>
                <Text style={styles.infoValue}>{userEmail || 'tidak_diketahui@email.com'}</Text>
              </View>
              <View style={styles.divider} />
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>📞 No. WhatsApp</Text>
                <Text style={[styles.infoValue, !isVerified && styles.textMuted]}>
                  {isVerified ? userData.phone : 'Belum Terverifikasi ❌'}
                </Text>
              </View>
              <View style={styles.divider} />
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>🎂 Tanggal Lahir</Text>
                <Text style={[styles.infoValue, !isVerified && styles.textMuted]}>
                  {isVerified ? userData.birthDate : 'Belum Terverifikasi ❌'}
                </Text>
              </View>
              <View style={styles.divider} />
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>📅 Akun Aktif Sejak</Text>
                <Text style={[styles.infoValue, !isVerified && styles.textMuted]}>
                  {userData.joinedSince}
                </Text>
              </View>
            </View>

            {/* GRUP 2: INTEGRASI SISTEM IOT */}
            <Text style={styles.sectionTitle}>Sistem & Kepemilikan Lahan</Text>
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>📍 Lokasi Geografis</Text>
                <Text style={styles.infoValue}>{userData.lokasi}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>🌿 Kode Node Lahan</Text>
                <Text style={styles.infoValue}>{userData.lahanName}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>🤖 Mode Penjaga</Text>
                <Text style={[styles.infoValue, { color: '#047857', fontWeight: '800' }]}>AI Otomatis Aktif</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={onLogout} activeOpacity={0.8}>
              <Text style={styles.logoutButtonText}>🔴 Keluar dari Aplikasi</Text>
            </TouchableOpacity>

          </View>
        </View>
      </ScrollView>

      {/* MODAL INTERAKTIF: Mendukung Peralihan Alur Multi-Step (Form Input -> Layar OTP) */}
      <Modal animationType="slide" transparent={true} visible={isModalVisible} onRequestClose={() => setIsModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            
            {/* STAGE A: PENGISIAN DATA UTAMA */}
            {otpStep === 'INPUT_DATA' ? (
              <View>
                <Text style={styles.modalTitle}>Formulir Aktivasi Akun Petani</Text>
                <Text style={styles.modalSubtitle}>Lengkapi data identitas di bawah untuk mengaktifkan sistem kontrol otomatis IoT lahan Anda.</Text>

                <Text style={styles.inputLabel}>Nomor WhatsApp Aktif</Text>
                <TextInput style={styles.textInput} placeholder="Contoh: 081234567890" keyboardType="phone-pad" value={inputPhone} onChangeText={setInputPhone} />

                <Text style={styles.inputLabel}>Tanggal Lahir Pemilik Lahan</Text>
                
                {Platform.OS === 'web' ? (
                  <input 
                    type="date" 
                    style={webInputStyles}
                    max={new Date().toISOString().split("T")[0]}
                    onChange={(e) => {
                      if(e.target.value) {
                        setBirthDate(new Date(e.target.value));
                        setIsDateSelected(true);
                      }
                    }}
                  />
                ) : (
                  <View>
                    <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowDatePicker(true)} activeOpacity={0.7}>
                      <Text style={styles.datePickerButtonText}>
                        {isDateSelected ? formatIndonesianDate(birthDate) : "📅 Pilih Tanggal dari Kalender"}
                      </Text>
                    </TouchableOpacity>
                    
                    {showDatePicker && (
                      <DateTimePicker value={birthDate} mode="date" display={Platform.OS === 'ios' ? 'spinner' : 'default'} maximumDate={new Date()} onChange={handleDateChange} />
                    )}
                  </View>
                )}

                <View style={styles.modalActionRow}>
                  <TouchableOpacity style={styles.cancelModalButton} onPress={() => setIsModalVisible(false)}>
                    <Text style={styles.cancelModalText}>Batal</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.submitModalButton} onPress={handleRequestOtp}>
                    <Text style={styles.submitModalText}>Kirim Kode OTP →</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              // STAGE B: TAMPILAN INTERAKTIF MASUKKAN KODE VERIFIKASI OTP
              <View>
                <Text style={styles.modalTitle}>Verifikasi Keamanan Akun 🔐</Text>
                <Text style={styles.modalSubtitle}>Kami telah mengirimkan 6 digit kode OTP keamanan ke nomor WhatsApp <Text style={{fontWeight:'700', color: '#064e3b'}}>{inputPhone}</Text>.</Text>

                <Text style={styles.inputLabel}>Masukkan Kode OTP</Text>
                <TextInput 
                  style={[styles.textInput, styles.otpCenterInput]} 
                  placeholder="• • • • • •" 
                  keyboardType="number-pad" 
                  maxLength={6}
                  value={inputOtp}
                  onChangeText={setInputOtp}
                />

                <View style={styles.timerContainer}>
                  {timer > 0 ? (
                    <Text style={styles.timerText}>Kirim ulang kode dalam <Text style={{color:'#ef4444', fontWeight:'700'}}>{timer} detik</Text></Text>
                  ) : (
                    <TouchableOpacity onPress={handleRequestOtp}>
                      <Text style={styles.resendOtpLink}>🔄 Kirim Ulang Kode OTP via WhatsApp</Text>
                    </TouchableOpacity>
                  )}
                </View>

                <View style={styles.modalActionRow}>
                  <TouchableOpacity style={styles.cancelModalButton} onPress={() => setOtpStep('INPUT_DATA')}>
                    <Text style={styles.cancelModalText}>Kembali</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.submitModalButton} onPress={handleVerifyOtp}>
                    <Text style={styles.submitModalText}>Validasi & Aktifkan 🌱</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

          </View>
        </View>
      </Modal>

    </View>
  );
}

const webInputStyles = {
  width: '100%',
  backgroundColor: '#f8fafc',
  border: '1px solid #cbd5e1',
  borderRadius: '10px',
  padding: '12px',
  fontSize: '14px',
  color: '#0f172a',
  fontFamily: 'sans-serif',
  outline: 'none',
  boxSizing: 'border-box' as 'border-box',
  marginBottom: '12px'
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#f8fafc' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' },
  headerBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#064e3b', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderColor: '#047857', zIndex: 99 },
  elegantBackButton: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255, 255, 255, 0.15)', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  backIconText: { color: '#ffffff', fontWeight: 'bold', fontSize: 20, marginTop: -2 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#ffffff', letterSpacing: -0.5 },
  scrollContent: { padding: 30 },
  profileLayout: { justifyContent: 'space-between', gap: 24 },
  avatarCard: { backgroundColor: '#ffffff', borderRadius: 20, padding: 30, alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0', zIndex: 10, elevation: 3 },
  avatarCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#d1fae5', justifyContent: 'center', alignItems: 'center', marginBottom: 16, borderWidth: 3, borderColor: '#34d399' },
  avatarInitials: { fontSize: 36, fontWeight: '800', color: '#065f46' },
  userName: { fontSize: 22, fontWeight: '800', color: '#0f172a' },
  userRole: { fontSize: 13, fontWeight: '600', color: '#64748b', marginTop: 4, textAlign: 'center' },
  badgeWrapper: { width: '100%', alignItems: 'center', marginTop: 16, zIndex: 50, elevation: 5 }, 
  badgeContainer: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 30, borderWidth: 1 },
  bgSuccess: { backgroundColor: '#d1fae5', borderColor: '#34d399' },
  bgWarning: { backgroundColor: '#ffedd5', borderColor: '#fed7aa' },
  verifiedBadge: { fontSize: 12, fontWeight: '700' },
  textSuccess: { color: '#065f46' },
  textWarning: { color: '#c2410c' },
  infoContainer: { gap: 12, zIndex: 1 },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: '#475569', letterSpacing: 0.5, marginBottom: 6, marginTop: 8 },
  infoCard: { backgroundColor: '#ffffff', borderRadius: 16, paddingVertical: 8, paddingHorizontal: 20, borderWidth: 1, borderColor: '#e2e8f0' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 14, alignItems: 'center' },
  infoLabel: { fontSize: 14, fontWeight: '600', color: '#64748b' },
  infoValue: { fontSize: 14, fontWeight: '700', color: '#0f172a' },
  textMuted: { color: '#ef4444', fontWeight: '600', fontSize: 13 },
  divider: { height: 1, backgroundColor: '#f1f5f9' },
  logoutButton: { backgroundColor: '#fee2e2', borderWidth: 1, borderColor: '#fca5a5', borderRadius: 12, padding: 16, alignItems: 'center', justifyContent: 'center', marginTop: 16 },
  logoutButtonText: { color: '#b91c1c', fontWeight: '800', fontSize: 14 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.6)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContainer: { width: '100%', maxWidth: 450, backgroundColor: '#ffffff', borderRadius: 24, padding: 26 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a', marginBottom: 6 },
  modalSubtitle: { fontSize: 13, color: '#64748b', lineHeight: 18, marginBottom: 20 },
  inputLabel: { fontSize: 13, fontWeight: '700', color: '#334155', marginBottom: 6, marginTop: 12 },
  textInput: { width: '100%', backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: '#0f172a', marginBottom: 12 },
  datePickerButton: { width: '100%', backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 14, justifyContent: 'center', marginBottom: 12 },
  datePickerButtonText: { fontSize: 14, color: '#475569', fontWeight: '600' },
  // STYLING KHUSUS TAMPILAN FIELD OTP
  otpCenterInput: { textAlign: 'center', fontSize: 26, letterSpacing: 10, fontWeight: '800', color: '#064e3b', paddingVertical: 10, backgroundColor: '#f0fdf4', borderColor: '#86efac' },
  timerContainer: { alignItems: 'center', marginTop: 8, marginBottom: 4 },
  timerText: { fontSize: 13, color: '#64748b', fontWeight: '500' },
  resendOtpLink: { fontSize: 13, color: '#047857', fontWeight: '700', textDecorationLine: 'underline' },
  modalActionRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 24 },
  cancelModalButton: { paddingVertical: 12, paddingHorizontal: 18, borderRadius: 10, backgroundColor: '#f1f5f9' },
  cancelModalText: { color: '#475569', fontWeight: '700', fontSize: 14 },
  submitModalButton: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10, backgroundColor: '#047857' },
  submitModalText: { color: '#ffffff', fontWeight: '700', fontSize: 14 }
});