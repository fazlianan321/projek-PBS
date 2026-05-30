Siap! Ini cara cerdas biar kamu tidak perlu kerja dua kali. Saya akan berikan kode utuh yang sudah ditandai batas-batas commit-nya lewat komentar (// ====== COMMIT X ======) langsung di dalam baris kodenya.

Dengan cara ini, kamu tinggal copas seluruh kode di bawah ini sekali saja ke dalam proyek VS Code kamu. Ketika nanti kamu mau melakukan git commit, kamu tinggal melihat tanda komentar tersebut sebagai panduan pesannya tanpa perlu memisah-misah file lagi.

Karena kamu minta ditandai sampai Commit 10, mari kita sesuaikan penomoran riwayatnya agar runtut dan estetik di log Git kamu:

TypeScript
import React, { useState, useEffect } from 'react';
import { Users, Sprout, Cpu, AlertTriangle, Activity, UserPlus, Trash2, Edit2, ShieldAlert } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

// ====== COMMIT 1: MODELING INTERFACES & DATATYPES ======
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

interface UserData {
  id: string;
  nama: string;
  email: string;
  role: 'Admin' | 'Petani' | 'Manajer Lahan';
  statusVerifikasi: boolean;
  tanggalGabung: string;
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
  const [activeTab, setActiveTab] = useState<'telemetri' | 'users'>('telemetri');

  const [usersList, setUsersList] = useState<UserData[]>([
    { id: 'USR-001', nama: 'Supardi ', email: 'supardi.lahan@gmail.com', role: 'Petani', statusVerifikasi: true, tanggalGabung: '12 Jan 2026' },
    { id: 'USR-002', nama: 'Siti Rahma', email: 'siti.vision@terra.id', role: 'Manajer Lahan', statusVerifikasi: true, tanggalGabung: '05 Feb 2026' },
    { id: 'USR-003', nama: 'Budi Santoso', email: 'budi.farm@gmail.com', role: 'Petani', statusVerifikasi: false, tanggalGabung: '28 Mei 2026' },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'Admin' | 'Petani' | 'Manajer Lahan'>('Petani');

  const [stats, setStats] = useState<DashboardStats>({
    totalPetani: 142,
    petaniTerverifikasi: 128,
    totalLahanAktif: 85,
    nodeSensorOnline: 32,
    nodeSensorOffline: 2,
  });

  const [sensorStreams, setSensorStreams] = useState<SensorDataStream[]>([
    { nodeId: 'TRV-001', lokasi: 'Blok A - Lahan Utama', kelembapanTanah: 68, suhuUdara: 28.5, phTanah: 6.5, status: 'ONLINE', lastUpdated: 'Baru saja' },
    { nodeId: 'TRV-002', lokasi: 'Blok B - Tomat', kelembapanTanah: 42, suhuUdara: 31.2, phTanah: 5.8, status: 'ONLINE', lastUpdated: '1 menit lalu' },
    { nodeId: 'TRV-003', lokasi: 'Blok C - Cabai', kelembapanTanah: 55, suhuUdara: 29.0, phTanah: 6.2, status: 'ONLINE', lastUpdated: '3 menit lalu' },
    { nodeId: 'TRV-004', lokasi: 'Blok D - Pembibitan', kelembapanTanah: 0, suhuUdara: 0, phTanah: 0, status: 'OFFLINE', lastUpdated: '2 jam lalu' },
  ]);