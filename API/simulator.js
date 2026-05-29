// simulator.js
const LAHAN_ID = 'TRV-001'; 
const API_URL = 'http://localhost:3000/sensor/input';

console.log("🚀 Simulator Alat IoT TerraVision Mulai Berjalan...");
console.log("Mengirim data dinamis ke database setiap 5 detik...\n");

function kirimDataSensorOtomatis() {
  // Membuat simulasi fluktuasi angka cuaca/lahan alami
  const suhuAcak = (27 + Math.random() * 4).toFixed(1); 
  const kelembapanAcak = Math.floor(55 + Math.random() * 20); 

  const payload = {
    suhu: parseFloat(suhuAcak),
    kelembapan: kelembapanAcak,
    lahanId: LAHAN_ID
  };

  fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  .then(res => {
    if (res.ok) {
      console.log(`[${new Date().toLocaleTimeString()}] 🟢 Sukses -> Lahan: ${LAHAN_ID} | Suhu: ${suhuAcak}°C | Kelembapan: ${kelembapanAcak}%`);
    }
  })
  .catch(err => console.log("❌ Server mati atau jaringan terputus."));
}

// Menjalankan pengiriman otomatis berulang
setInterval(kirimDataSensorOtomatis, 5000);