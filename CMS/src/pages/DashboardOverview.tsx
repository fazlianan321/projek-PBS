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

  useEffect(() => {
    const verifiedCount = usersList.filter(u => u.statusVerifikasi).length;
    setStats(prev => ({
      ...prev,
      totalPetani: 139 + usersList.length,
      petaniTerverifikasi: 126 + verifiedCount
    }));
  }, [usersList]);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;

    const newUser: UserData = {
      id: `USR-00${usersList.length + 1}`,
      nama: newUserName,
      email: newUserEmail,
      role: newUserRole,
      statusVerifikasi: true,
      tanggalGabung: 'Hari ini'
    };

    setUsersList([...usersList, newUser]);
    setNewUserName('');
    setNewUserEmail('');
    setShowAddForm(false);
  };

  const handleDeleteUser = (id: string) => {
    setUsersList(usersList.filter(user => user.id !== id));
  };

  const toggleVerification = (id: string) => {
    setUsersList(usersList.map(user => 
      user.id === id ? { ...user, statusVerifikasi: !user.statusVerifikasi } : user
    ));
  };

  return (
    <div className="p-8 max-w-7xl mx-auto"></div>
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">TerraVision CMS Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Sistem Manajemen Informasi Terintegrasi Lahan Pertanian Cerdas</p>
        </div>
        
        <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200/60 self-start md:self-auto">
          <button 
            onClick={() => setActiveTab('telemetri')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'telemetri' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            📊 Monitoring Telemetri
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'users' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            👥 Manajemen Pengguna
          </button>
        </div>
      </div>

      {/* ====== COMMIT 8: VIEW LAYOUT - STATISTICAL HERO METRIC CARDS ====== */}
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
      {activeTab === 'telemetri' && (
        <>
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
        </>
      )}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-base font-bold text-slate-800">Daftar Otoritas Akun & Manajemen Petani</h2>
              <p className="text-slate-400 text-xs">Kelola hak akses kontrol aplikasi, proses verifikasi, dan hapus akun</p>
            </div>
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all self-start sm:self-auto"
            >
              <UserPlus size={16} /> {showAddForm ? 'Tutup Form' : 'Tambah User Baru'}
            </button>
          </div>

          {showAddForm && (
            <form onSubmit={handleAddUser} className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-100 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-slate-500 text-xs font-bold mb-1.5">Nama Lengkap</label>
                <input 
                  type="text" required value={newUserName} onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="Contoh: Joko Widodo"
                  className="w-full text-sm bg-white border border-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-slate-500 text-xs font-bold mb-1.5">Alamat Email</label>
                <input 
                  type="email" required value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="joko@lahan.com"
                  className="w-full text-sm bg-white border border-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-slate-500 text-xs font-bold mb-1.5">Role Otoritas</label>
                <select 
                  value={newUserRole} onChange={(e) => setNewUserRole(e.target.value as any)}
                  className="w-full text-sm bg-white border border-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="Petani">Petani (Operator Lahan)</option>
                  <option value="Manajer Lahan">Manajer Lahan</option>
                  <option value="Admin">Administrator Sistem</option>
                </select>
              </div>
              <button 
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 rounded-lg shadow-sm transition-all"
              >
                Simpan Akun
              </button>
            </form>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  <th className="pb-3 pl-2">ID User</th>
                  <th className="pb-3">Profil Pengguna</th>
                  <th className="pb-3">Peran Akses</th>
                  <th className="pb-3">Keamanan</th>
                  <th className="pb-3">Tanggal Terdaftar</th>
                  <th className="pb-3 text-center pr-2">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-slate-700 text-sm divide-y divide-slate-50">
                {usersList.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 pl-2 font-mono font-bold text-slate-400">{user.id}</td>
                    <td className="py-4">
                      <div className="font-bold text-slate-900">{user.nama}</div>
                      <div className="text-slate-400 text-xs">{user.email}</div>
                    </td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-semibold ${
                        user.role === 'Admin' ? 'bg-purple-50 text-purple-700 border border-purple-100' :
                        user.role === 'Manajer Lahan' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                        'bg-amber-50 text-amber-700 border border-amber-100'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4">
                      <button 
                        type="button"
                        onClick={() => toggleVerification(user.id)}
                        className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full transition-all ${
                          user.statusVerifikasi 
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' 
                            : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                        }`}
                        title="Klik untuk mengubah status verifikasi"
                      >
                        {user.statusVerifikasi ? '🛡️ Terverifikasi' : '❌ Belum Verifikasi'}
                      </button>
                    </td>
                    <td className="py-4 text-xs text-slate-500">{user.tanggalGabung}</td>
                    <td className="py-4 text-center pr-2">
                      <div className="flex justify-center items-center gap-2">
                        <button 
                          onClick={() => toggleVerification(user.id)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition-all"
                          title="Ubah Status Verifikasi"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-all"
                          title="Hapus Pengguna"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}