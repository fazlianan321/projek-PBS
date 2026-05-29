// simulator.js
const LAHAN_ID = 'TRV-001'; 
const API_URL = 'http://localhost:3000/sensor/input';

console.log("🚀 Menginisialisasi Uji Coba Simulator IoT TerraVision...");

function kirimDataSensor() {
  const payload = {
    suhu: 28.5,
    kelembapan: 65,
    lahanId: LAHAN_ID
  };

  fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  .then(res => {
    if (res.ok) console.log("🟢 [Uji Coba] Berhasil mengirim satu data ke NestJS!");
    else console.log(`🔴 Server merespon dengan status: ${res.status}`);
  })
  .catch(err => console.log("❌ Gagal koneksi. Pastikan server NestJS sudah menyala."));
}

kirimDataSensor();