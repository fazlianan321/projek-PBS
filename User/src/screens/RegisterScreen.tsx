import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { API_URL } from '../config/api'; // Pastikan konfigurasi IP backend laptop kamu sudah sesuai di sini

export default function RegisterScreen({ onNavigateToLogin }: { onNavigateToLogin: () => void }) {
  const [name, setName] = useState(''); // State penampung input nama lengkap
  const [email, setEmail] = useState(''); // State penampung input alamat email
  const [password, setPassword] = useState(''); // State penampung input kata sandi
  const [isLoading, setIsLoading] = useState(false); // State indikator loading tombol