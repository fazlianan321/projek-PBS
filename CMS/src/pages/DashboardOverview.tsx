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

  const [sensorStreams, setSensorStreams] = useState<SensorDataStream[]>([
    { nodeId: 'TRV-001', lokasi: 'Blok A - Lahan Utama', kelembapanTanah: 68, suhuUdara: 28.5, phTanah: 6.5, status: 'ONLINE', lastUpdated: 'Baru saja' },
    { nodeId: 'TRV-002', lokasi: 'Blok B - Tomat', kelembapanTanah: 42, suhuUdara: 31.2, phTanah: 5.8, status: 'ONLINE', lastUpdated: '1 menit lalu' },
    { nodeId: 'TRV-003', lokasi: 'Blok C - Cabai', kelembapanTanah: 55, suhuUdara: 29.0, phTanah: 6.2, status: 'ONLINE', lastUpdated: '3 menit lalu' },
    { nodeId: 'TRV-004', lokasi: 'Blok D - Pembibitan', kelembapanTanah: 0, suhuUdara: 0, phTanah: 0, status: 'OFFLINE', lastUpdated: '2 jam lalu' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSensorStreams((prevStreams: SensorDataStream[]) =>
        prevStreams.map((sensor: SensorDataStream) => {
          if (sensor.status === 'OFFLINE') return sensor;
          return {
            ...sensor,
            kelembapanTanah: Math.max(30, Math.min(90, sensor.kelembapanTanah + (Math.random() > 0.5 ? 1 : -1))),
            suhuUdara: parseFloat((sensor.suhuUdara + (Math.random() > 0.5 ? 0.2 : -0.2)).toFixed(1)),
            lastUpdated: 'Baru saja'
          };
        })
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (

    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">TerraVision CMS Dashboard</h1>
        <p className="text-slate-500 text-sm">Sistem Manajemen Informasi Terintegrasi Lahan Pertanian Cerdas</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-semibold mb-1">Total Registrasi Petani</p>
            <h3 className="text-2xl font-bold text-slate-800">{stats.totalPetani}</h3>
            <p className="text-xs text-emerald-600 mt-1 font-medium">🛡️ {stats.petaniTerverifikasi} Terverifikasi</p>
          </div>
          <div className="bg-blue-50 p-3 rounded-xl text-blue-600"><Users size={22} /></div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-semibold mb-1">Total Lahan Terpeta</p>
            <h3 className="text-2xl font-bold text-slate-800">{stats.totalLahanAktif}</h3>
            <p className="text-xs text-slate-500 mt-1">Titik koordinat aktif</p>
          </div>
          <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600"><Sprout size={22} /></div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-semibold mb-1">Node IoT Online</p>
            <h3 className="text-2xl font-bold text-slate-800">{stats.nodeSensorOnline}</h3>
            <p className="text-xs text-emerald-600 mt-1 font-medium">● Transmisi Stabil</p>
          </div>
          <div className="bg-green-50 p-3 rounded-xl text-green-600"><Cpu size={22} /></div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-semibold mb-1">Node Offline / Rusak</p>
            <h3 className="text-2xl font-bold text-rose-600">{stats.nodeSensorOffline}</h3>
            <p className="text-xs text-rose-500 mt-1 font-medium">⚠️ Butuh Pengecekan</p>
          </div>
          <div className="bg-rose-50 p-3 rounded-xl text-rose-600"><AlertTriangle size={22} /></div>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-8">
        <div className="mb-4">
          <h2 className="text-base font-bold text-slate-800">Grafik Analisis Tren Kondisi Lahan (7 Hari Terakhir)</h2>
          <p className="text-slate-400 text-xs">Rata-rata fluktuasi parameter mikro agregat dari seluruh node sensor</p>
        </div>
        
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="hari" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              
              <Line type="monotone" dataKey="kelembapanRata2" name="💧 Kelembapan (%)" stroke="#3b82f6" strokeWidth={3} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="suhuRata2" name="🌡️ Suhu Udara (°C)" stroke="#f97316" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-base font-bold text-slate-800">Telemetri Real-Time Perangkat</h2>
            <p className="text-slate-400 text-xs">Arus masuk data dari sensor mikrokontroler lahan</p>
          </div>
          {/* ====== COMMIT 10: PULSE ANIMATION INDICATOR ====== */}
          <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs px-3 py-1.5 rounded-full font-semibold animate-pulse">
            <Activity size={12} /> Auto Sync Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <th className="pb-3 pl-2">ID Node</th>
                <th className="pb-3">Lokasi Zona</th>
                <th className="pb-3">💧 Kelembapan</th>
                <th className="pb-3">🌡️ Suhu Udara</th>
                <th className="pb-3">🧪 pH Tanah</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right pr-2">Update</th>
              </tr>
            </thead>
            <tbody className="text-slate-700 text-sm divide-y divide-slate-50">
              {sensorStreams.map((sensor) => (
                <tr key={sensor.nodeId} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 pl-2 font-bold text-slate-900">{sensor.nodeId}</td>
                  <td className="py-4 text-slate-500 text-xs">{sensor.lokasi}</td>
                  <td className="py-4">
                    {sensor.status === 'ONLINE' ? (
                      <span className={`font-semibold ${sensor.kelembapanTanah < 50 ? 'text-amber-600' : 'text-blue-600'}`}>
                        {sensor.kelembapanTanah}%
                      </span>
                    ) : '—'}
                  </td>
                  <td className="py-4">
                    {sensor.status === 'ONLINE' ? (
                      <span className="font-semibold text-orange-600">{sensor.suhuUdara}°C</span>
                    ) : '—'}
                  </td>
                  <td className="py-4">
                    {sensor.status === 'ONLINE' ? (
                      <span className={`font-semibold ${sensor.phTanah < 6.0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                        {sensor.phTanah} pH
                      </span>
                    ) : '—'}
                  </td>
                  <td className="py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      sensor.status === 'ONLINE' ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {sensor.status === 'ONLINE' ? '● Online' : '○ Offline'}
                    </span>
                  </td>
                  <td className="py-4 text-right pr-2 text-xs text-slate-400">{sensor.lastUpdated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}