import { useState } from 'react'                                                         // [PART 1: REACT CORE]
import { 
  LayoutDashboard, Sprout, Droplets, Thermometer, 
  Wind, LogOut, Bell, User, ChevronRight, Search 
} from 'lucide-react'                                                                    // [PART 2: ICONS]

export default function Dashboard() {
  const [activeMenu, setActiveMenu] = useState('Dashboard')
  const userData = JSON.parse(localStorage.getItem('user')) || { nama: 'M Fazli Anan' }

  const handleLogout = () => {
    localStorage.clear()
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900">
      
      {/* --- SIDEBAR NAVIGATION --- */}
      <aside className="w-72 bg-emerald-950 text-white p-8 flex flex-col shadow-2xl z-20">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="bg-emerald-500 p-2 rounded-xl rotate-3 shadow-lg shadow-emerald-500/20">
            <Sprout size={24} className="text-white" />
          </div>
          <span className="font-black text-xl tracking-tighter uppercase">Lahan Cerdas</span>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarLink icon={<LayoutDashboard size={20}/>} label="Dashboard" active={activeMenu === 'Dashboard'} onClick={() => setActiveMenu('Dashboard')} />
          <SidebarLink icon={<Droplets size={20}/>} label="Kelembapan" active={activeMenu === 'Air'} onClick={() => setActiveMenu('Air')} />
          <SidebarLink icon={<Thermometer size={20}/>} label="Suhu Udara" active={activeMenu === 'Suhu'} onClick={() => setActiveMenu('Suhu')} />
          <SidebarLink icon={<User size={20}/>} label="Daftar Petani" active={activeMenu === 'Petani'} onClick={() => setActiveMenu('Petani')} />
        </nav>

        <button onClick={handleLogout} className="group flex items-center gap-3 text-emerald-400 hover:text-white font-bold p-4 rounded-2xl hover:bg-white/5 transition-all mt-auto border-t border-white/10 pt-8">
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" /> Logout System
        </button>
      </aside>
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* TOPBAR */}
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-10 shrink-0">
          <div className="relative w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={18} />
            <input type="text" placeholder="Cari data sensor..." className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-emerald-50 outline-none font-medium transition-all" />
          </div>
          <div className="flex items-center gap-6">
            <div className="relative p-2 text-slate-400 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors">
              <Bell size={22} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </div>
            <div className="flex items-center gap-3 border-l pl-6 border-slate-200">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-800">{userData.nama}</p>
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Informatika UTI</p>
              </div>
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-emerald-200">
                {userData.nama.charAt(0)}
              </div>
            </div>
          </div>
        </header>
        <section className="flex-1 overflow-y-auto p-10 space-y-10">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">Panel Monitoring</h2>
              <p className="text-slate-500 font-medium mt-1 uppercase text-[10px] tracking-[0.2em]">Smart Farming Management System v2.0</p>
            </div>
            <div className="bg-white p-1 rounded-xl border border-slate-100 flex gap-1 shadow-sm">
              <button className="px-4 py-2 bg-emerald-600 text-white text-[10px] font-black rounded-lg shadow-lg shadow-emerald-200 uppercase">Live Data</button>
              <button className="px-4 py-2 text-slate-400 text-[10px] font-black hover:text-emerald-600 transition-colors uppercase italic">History</button>
            </div>
          </div>

          {/* SENSOR GRID */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard icon={<Thermometer className="text-orange-500" />} label="Suhu Udara" value="28.4" unit="°C" status="Stabil" />
            <StatCard icon={<Droplets className="text-blue-500" />} label="Kelembapan" value="62" unit="%" status="Normal" />
            <StatCard icon={<Wind className="text-emerald-500" />} label="Nutrisi NPK" value="Optimal" unit="" status="Kaya" />
            <StatCard icon={<Sprout className="text-lime-600" />} label="Usia Tanam" value="14" unit="Hari" status="Vegetatif" />
          </div>