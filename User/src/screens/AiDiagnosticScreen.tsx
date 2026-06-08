import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert 
} from 'react-native';
import axios from 'axios';
const BACKEND_BASE_URL = 'http://10.0.2.2:3000';
const REQUEST_TIMEOUT = 5000;
const apiClient = axios.create({
  baseURL: BACKEND_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: { 'Content-Type': 'application/json' },
});