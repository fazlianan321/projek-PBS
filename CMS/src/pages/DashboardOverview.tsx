import React, { useState, useEffect } from 'react';
import { Users, Sprout, Cpu, AlertTriangle, Activity } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface DashboardStats {
  totalPetani: number;
  petaniTerverifikasi: number;
  totalLahanAktif: number;
  nodeSensorOnline: number;
  nodeSensorOffline: number;
}

interface SensorDataStream {
  nodeId: string;
  lokasi: string;
  kelembapanTanah: number;
  suhuUdara: number;
  phTanah: number;
  status: 'ONLINE' | 'OFFLINE';
  lastUpdated: string;
}

// ==========================================
// ====== COMMIT 3: FIX MIGRATION CAMELCASE =
// ==========================================
const weeklyTrendData = [
  { hari: 'Senin', kelembapanRata2: 62, suhuRata2: 27.4 },
  { hari: 'Selasa', kelembapanRata2: 58, suhuRata2: 28.1 },
  { hari: 'Rabu', kelembapanRata2: 65, suhuRata2: 26.9 },
  { hari: 'Kamis', kelembapanRata2: 70, suhuRata2: 26.5 },
  { hari: 'Jumat', kelembapanRata2: 52, suhuRata2: 29.3 },
  { hari: 'Sabtu', kelembapanRata2: 60, suhuRata2: 28.0 },
  { hari: 'Minggu', kelembapanRata2: 64, suhuRata2: 27.8 },
];

export default function DashboardOverview() {
  