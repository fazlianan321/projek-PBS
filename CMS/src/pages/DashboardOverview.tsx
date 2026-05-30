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
  
  const [stats] = useState<DashboardStats>({
    totalPetani: 142,
    petaniTerverifikasi: 128,
    totalLahanAktif: 85,
    nodeSensorOnline: 32,
    nodeSensorOffline: 2,
  });

  // ==========================================
  // ====== COMMIT 9: TELEMETRY STREAM STATE ==
  // ==========================================
  const [sensorStreams, setSensorStreams] = useState<SensorDataStream[]>([
    { nodeId: 'TRV-001', lokasi: 'Blok A - Lahan Utama', kelembapanTanah: 68, suhuUdara: 28.5, phTanah: 6.5, status: 'ONLINE', lastUpdated: 'Baru saja' },
    { nodeId: 'TRV-002', lokasi: 'Blok B - Tomat', kelembapanTanah: 42, suhuUdara: 31.2, phTanah: 5.8, status: 'ONLINE', lastUpdated: '1 menit lalu' },
    { nodeId: 'TRV-003', lokasi: 'Blok C - Cabai', kelembapanTanah: 55, suhuUdara: 29.0, phTanah: 6.2, status: 'ONLINE', lastUpdated: '3 menit lalu' },
    { nodeId: 'TRV-004', locations: 'Blok D - Pembibitan', kelembapanTanah: 0, suhuUdara: 0, phTanah: 0, status: 'OFFLINE', lastUpdated: '2 jam lalu' },
  ]);

  