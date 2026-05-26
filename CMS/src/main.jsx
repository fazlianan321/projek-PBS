import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './login.jsx'
import Dashboard from "../Dashboard.jsx"; // <-- 1. IMPORT FILE ASLI KAMU DI SINI
import './index.css'

// 2. SEKSI "CONST DASHBOARD" TIRUAN YANG DI SINI SUDAH DIHAPUS TOTAL

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        {/* 3. SEKARANG RUTE INI AKAN MEMANGGIL FILE ASLI YANG BERWARNA EMERALD */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)