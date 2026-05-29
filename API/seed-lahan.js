// seed-lahan.js
const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function main() {
  console.log("⏳ Menghubungkan ke database untuk cek struktur tabel Lahan...");
  await client.connect();
  
  try {
    // 1. Amek daftar kolom asli dari database kamu
    const columnsResult = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'Lahan';
    `);
    
    const columns = columnsResult.rows.map(r => r.column_name);
    console.log("📋 Kolom yang ditemukan di tabel Lahan kamu:", columns);

    // 2. Susun query dinamis berdasarkan kolom yang ada
    let query = '';
    
    if (columns.includes('name')) {
      // Jika pakai bahasa Inggris (id, name)
      query = `
        INSERT INTO "Lahan" ("id", "name", "${columns.includes('createdAt') ? 'createdAt' : ''}", "${columns.includes('updatedAt') ? 'updatedAt' : ''}") 
        VALUES ('TRV-001', 'Lahan Utama TerraVision', NOW(), NOW())
        ON CONFLICT ("id") DO NOTHING;
      `;
    } else if (columns.includes('namaLahan')) {
      // Jika pakai namaLahan
      query = `
        INSERT INTO "Lahan" ("id", "namaLahan", "${columns.includes('createdAt') ? 'createdAt' : ''}", "${columns.includes('updatedAt') ? 'updatedAt' : ''}") 
        VALUES ('TRV-001', 'Lahan Utama TerraVision', NOW(), NOW())
        ON CONFLICT ("id") DO NOTHING;
      `;
    } else {
      // Skenario paling aman: Cuma isi ID saja jika kolom lain tidak wajib
      query = `
        INSERT INTO "Lahan" ("id") 
        VALUES ('TRV-001')
        ON CONFLICT ("id") DO NOTHING;
      `;
    }

    // Bersihkan koma-koma gantung akibat conditional string di atas jika ada
    query = query.replace(/"",/g, '').replace(/,\s*""/g, '');

    await client.query(query);
    console.log("\n🟢 SUKSES! ID Lahan 'TRV-001' sekarang resmi terdaftar di database.");
    console.log("Silakan jalankan kembali simulator IoT kamu via 'npm run simulator'!");
  } catch (err) {
    console.error("❌ Gagal memasukkan data otomatis:", err.message);
  } finally {
    await client.end();
  }
}

main();