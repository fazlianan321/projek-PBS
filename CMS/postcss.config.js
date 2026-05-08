export default {
  plugins: {
    // Menggunakan plugin baru sesuai saran error Vite/Tailwind v4
    '@tailwindcss/postcss': {}, 
    
    // Autoprefixer tetap digunakan untuk kompatibilitas browser
    autoprefixer: {},
  },
}