import { useState } from 'react'

function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  return (
    <div className="min-h-screen bg-emerald-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border-t-8 border-emerald-600">
        <h1 className="text-3xl font-extrabold text-emerald-900 text-center mb-2">CMS Lahan Cerdas</h1>
        <p className="text-gray-500 text-center mb-8">Manajemen Sistem Pertanian Terintegrasi</p>
        
        <form className="space-y-5">
           {/* Form akan diisi di commit selanjutnya */}
        </form>
      </div>
    </div>
  )
}

export default App