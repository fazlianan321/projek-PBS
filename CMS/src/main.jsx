import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'                                                        // Memanggil file App.jsx yang kamu buat
import './index.css'                                                              // Memanggil CSS Tailwind kamu

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)