import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom' // Tambahkan ini
import App from './login.jsx'
import './index.css'

// Contoh Komponen Dashboard Sederhana (Nanti bisa kamu pindah ke file sendiri)
const Dashboard = () => (
  <div className="p-10">
    <h1 className="text-2xl font-bold">Selamat Datang di Dashboard Lahan Cerdas!</h1>
    <p>Hore, login kamu berhasil Fazli!</p>
  </div>
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)