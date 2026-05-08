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