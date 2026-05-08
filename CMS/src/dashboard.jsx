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