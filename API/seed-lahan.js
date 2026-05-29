// seed-lahan.js
const { Client } = require('pg');

// Menarik koneksi database langsung dari file .env kamu
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function main() {
  console.log("⏳ Mencoba mendaftarkan ID Lahan TRV-001 ke database...");
  await client.connect();
  
  try {
    // Sesuaikan nama kolom jika berbeda di skema Prisma kamu (misal: 'id', 'nama', dll)
    // Query ini akan memasukkan data lahan, atau mengabaikannya jika ID sudah ada
    const query = `
      INSERT INTO "Lahan" ("id", "nama", "createdAt", "updatedAt") 
      VALUES ('TRV-001', 'Lahan Utama TerraVision', NOW(), NOW())
      ON CONFLICT ("id") DO NOTHING;
    `;
    
    await client.query(query);
    console.log("🟢 SUKSES! ID Lahan 'TRV-001' sekarang sudah terdaftar di database.");
    console.log("Sekarang kamu bisa menjalankan kembali simulator.js tanpa error foreign key!");
  } catch (err) {
    console.error("❌ Gagal memasukkan data. Pesan error:", err.message);
    console.log("\n💡 Catatan: Jika nama tabel kamu bukan \"Lahan\" (huruf besar L), silakan sesuaikan isi query di dalam script ini.");
  } finally {
    await client.end();
  }
}

main();