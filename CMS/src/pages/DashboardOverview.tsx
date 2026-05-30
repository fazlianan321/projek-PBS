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