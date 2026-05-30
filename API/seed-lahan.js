// seed-lahan.js
const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function main() {
  console.log("⏳ Menghubungkan ke database...");
  await client.connect();
  
  try {
    // Menembak persis 4 kolom yang ada di database kamu
    const query = `
      INSERT INTO "Lahan" ("id", "namaLahan", "lokasi", "deskripsi") 
      VALUES ('TRV-001', 'Lahan Utama TerraVision', 'Lampung', 'Sistem Terintegrasi IoT')
      ON CONFLICT ("id") DO NOTHING;
    `;
    
    await client.query(query);
    console.log("\n🟢 SUKSES BESAR! ID Lahan 'TRV-001' sekarang resmi terdaftar di database PostgreSQL kamu.");
    console.log("Silakan jalankan kembali simulator IoT kamu via: npm run simulator");
  } catch (err) {
    console.error("❌ Gagal memasukkan data:", err.message);
  } finally {
    await client.end();
  }
}

main();