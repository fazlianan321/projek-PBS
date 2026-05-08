import { useState, useEffect } from 'react'                                                 // Import core hooks
import { 
  LockKeyhole, 
  Mail, 
  Eye, 
  EyeOff, 
  Loader2, 
  Leaf 
} from 'lucide-react'                                                                      // Icons (Optional: install lucide-react)

function App() {
  const [email, setEmail] = useState('')                                                   // State: Email input
  const [password, setPassword] = useState('')                                             // State: Password input
  const [showPassword, setShowPassword] = useState(false)                                  // State: Toggle lihat password
  const [error, setError] = useState('')                                                   // State: Error message
  const [loading, setLoading] = useState(false)                                            // State: Loading controller
  const [isSuccess, setIsSuccess] = useState(false)                                        // State: Success animation trigger

// ========================================================================================= [COMMIT 2: ADVANCED AUTH LOGIC]
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validasi Sederhana
    if (password.length < 6) {
      setError('Password minimal harus 6 karakter!')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsSuccess(true)                                                                 // Trigger animasi sukses
        localStorage.setItem('token', data.access_token)
        localStorage.setItem('user_data', JSON.stringify(data.user))
        
        setTimeout(() => {
          window.location.href = '/dashboard'                                              // Delay redirect biar user liat sukses
        }, 1500)
      } else {
        setError(data.message || 'Kombinasi Email & Password tidak ditemukan.')
      }
    } catch (err) {
      setError('Gagal menghubungi server. Pastikan Backend NestJS aktif di port 3000.')
    } finally {
      if (!isSuccess) setLoading(false)
    }
  }
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-[440px]">
        
        {/* LOGO SECTION */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-200 mb-4 rotate-3">
            <Leaf className="text-white w-10 h-10" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">LAHAN CERDAS</h1>
          <p className="text-slate-500 font-medium mt-1 uppercase tracking-[0.2em] text-[10px]">Smart Farming Management</p>
        </div>

        {/* FORM CARD */}
        <div className="bg-white border border-slate-100 rounded-[32px] p-10 shadow-2xl shadow-slate-200/50 relative overflow-hidden">
          {isSuccess && (
            <div className="absolute inset-0 bg-emerald-600/95 flex flex-col items-center justify-center z-10 animate-in fade-in duration-500">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 animate-bounce">
                <span className="text-4xl">✅</span>
              </div>
              <p className="text-white font-bold text-xl">Login Berhasil!</p>
            </div>
          )}

          <h2 className="text-2xl font-bold text-slate-800 mb-2">Selamat Datang</h2>
          <p className="text-slate-400 text-sm mb-8 font-medium">Masukkan kredensial Anda untuk akses CMS.</p>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* EMAIL INPUT */}
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
              <input 
                type="email" 
                required
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 outline-none transition-all text-slate-700 font-medium"
                placeholder="Email Administrator"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* PASSWORD INPUT */}
            <div className="relative group">
              <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
              <input 
                type={showPassword ? "text" : "password"} 
                required
                className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 outline-none transition-all text-slate-700 font-medium"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* ERROR ALERT */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2">
                <span className="text-red-600 font-bold text-sm">⚠️ {error}</span>
              </div>
            )}

            {/* BUTTON SUBMIT */}
            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-4 rounded-2xl font-extrabold text-white shadow-xl transition-all flex items-center justify-center gap-2
                ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 active:scale-95 shadow-emerald-200'}`}
            >
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Masuk Panel Admin'}
            </button>
          </form>
        </div>

        {/* FOOTER */}
        <div className="mt-12 text-center space-y-2">
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest">
            Universitas Teknokrat Indonesia
          </p>
          <div className="flex justify-center gap-4 text-[10px] font-bold text-emerald-700/60 uppercase">
            <span>Security Verified</span>
            <span>•</span>
            <span>CMS v2.0.1</span>
          </div>
        </div>

      </div>
    </div>
  )
}

export default App