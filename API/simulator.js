// simulator.js
const LAHAN_ID = 'TRV-001'; 
// 🟢 Kita butuh API URL input data dan API URL untuk mengecek data terbaru (termasuk status pompa)
const API_INPUT_URL = 'http://localhost:3000/sensor/input';
const API_LATEST_URL = `http://localhost:3000/sensor/latest/${LAHAN_ID}`;

console.log("🚀 Simulator Alat IoT TerraVision Mulai Berjalan...");
console.log("Mengirim data sensor & memantau status pompa dari HP setiap 5 detik...\n");

function kirimDataSensorOtomatis() {
  const suhuAcak = (27 + Math.random() * 4).toFixed(1); 
  const kelembapanAcak = Math.floor(55 + Math.random() * 20); 

  const payload = {
    suhu: parseFloat(suhuAcak),
    kelembapan: kelembapanAcak,
    lahanId: LAHAN_ID
  };

  // 1. Kirim data sensor ke database NestJS
  fetch(API_INPUT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  .then(res => {
    if (res.ok) {
      // 2. Jika sukses kirim data sensor, langsung cek status pompa terbaru yang dikontrol dari HP Fazli
      return fetch(API_LATEST_URL);
    }
    throw new Error('Gagal mengirim data sensor ke NestJS');
  })
  .then(res => res.json())
  .then(dataTerakhir => {
    // 🟢 PERBAIKAN UTAMA: Membaca status sakelar pompa secara real-time dari backend
    // Jika dataTerakhir memiliki status pompa, gunakan itu. Jika belum ada di DB, default ke false (Mati)
    const statusPompa = dataTerakhir && dataTerakhir.statusPompa !== undefined ? dataTerakhir.statusPompa : false;
    const infoPompa = statusPompa ? '🚰 NYALA (Menyiram Lahan)' : '🔴 MATI (Standby)';

    console.log(
      `[${new Date().toLocaleTimeString()}] 🟢 IoT Log -> Suhu: ${suhuAcak}°C | Kelembapan: ${kelembapanAcak}% | Status Pompa: ${infoPompa}`
    );
  })
  .catch(err => {
    console.log("❌ Jaringan Terputus: Server NestJS mati atau IP salah.");
  });
}

// Jalankan loop otomatis setiap 5 detik
setInterval(kirimDataSensorOtomatis, 5000);