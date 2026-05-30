import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { SensorService } from './sensor.service';

@Controller('sensor')
export class SensorController {
  // 🟢 Memory lokal untuk menyimpan status sakelar pompa secara real-time berdasarkan Lahan ID
  private statusPompaGlobal: Record<string, boolean> = {};

  constructor(private readonly sensorService: SensorService) {}

  // 🟢 PERBAIKAN OTOMATISASI: Sekarang input data dari simulator otomatis mengendalikan pompa
  @Post('input')
  async inputData(@Body() data: { suhu: number; kelembapan: number; lahanId: string }) {
    // 1. Simpan data sensor ke database Postgres melalui service
    const hasilSimpan = await this.sensorService.createData(data);

    // 2. LOGIKA OTOMATISASI IRIGASI PINTAR:
    // Jika tanah kering (Kelembapan < 50%), otomatis NYALAKAN pompa
    if (data.kelembapan < 50) {
      if (this.statusPompaGlobal[data.lahanId] !== true) {
        console.log(`[🤖 AUTOMATION] Kelembapan Kritis (${data.kelembapan}%). Mengaktifkan Pompa Lahan: ${data.lahanId} 🚰`);
        this.statusPompaGlobal[data.lahanId] = true;
        this.statusPompaGlobal['TERAKHIR_DIKLIK'] = true; // Sinkronisasi fallback aplikasi HP
      }
    } 
    // Jika tanah sudah cukup basah (Kelembapan > 70%), otomatis MATIKAN pompa
    else if (data.kelembapan > 70) {
      if (this.statusPompaGlobal[data.lahanId] !== false) {
        console.log(`[🤖 AUTOMATION] Kelembapan Cukup (${data.kelembapan}%). Mematikan Pompa Lahan: ${data.lahanId} 🔴`);
        this.statusPompaGlobal[data.lahanId] = false;
        this.statusPompaGlobal['TERAKHIR_DIKLIK'] = false; // Sinkronisasi fallback aplikasi HP
      }
    }

    return hasilSimpan;
  }

  // 🟢 GET LATEST (FINAL): Memetakan data sensor dan memaksakan status sakelar HP masuk ke JSON
  @Get('latest/:lahanId')
  async getLatest(@Param('lahanId') lahanId: string) {
    const dataTerakhir = await this.sensorService.getLatestData(lahanId);
    
    // Gunakan status berdasarkan lahanId, atau gunakan state global fallback terakhir
    const statusSakelarHp = this.statusPompaGlobal[lahanId] ?? this.statusPompaGlobal['TERAKHIR_DIKLIK'] ?? false;

    // Jika data dari DB ditemukan, konversi ke objek biasa dan sisipkan status pompa terbaru
    if (dataTerakhir) {
      const plainData = JSON.parse(JSON.stringify(dataTerakhir));
      return {
        id: plainData.id,
        suhu: plainData.suhu,
        kelembapan: plainData.kelembapan,
        lahanId: plainData.lahanId,
        createdAt: plainData.createdAt,
        statusPompa: statusSakelarHp // 🚰 Disinkronkan langsung dari memory sakelar HP
      };
    }

    // Fallback jika tabel database masih kosong
    return { 
      lahanId, 
      statusPompa: statusSakelarHp 
    };
  }

  // 🟢 POST TOGGLE (FINAL): Menerima sinyal klik tombol dari HP dan menyimpannya ke server
  @Post('pump/toggle')
  async togglePump(@Body() data: { lahanId: string; statusPompa: boolean }) {
    console.log(`[BACKEND IoT] Perintah Sakelar Diterima! Lahan: ${data.lahanId} | Pompa: ${data.statusPompa ? 'NYALA 🚰' : 'MATI 🔴'}`);
    
    // Simpan status ke dalam memory global server
    this.statusPompaGlobal[data.lahanId] = data.statusPompa;
    this.statusPompaGlobal['TERAKHIR_DIKLIK'] = data.statusPompa; // Set juga ke fallback
    
    return {
      success: true,
      message: `Status pompa untuk lahan ${data.lahanId} berhasil diperbarui di server menjadi ${data.statusPompa ? 'NYALA' : 'MATI'}.`,
      statusTerakhir: data.statusPompa,
    };
  }

  // 🟢 ENDPOINT BARU: Simulasi AI Vision Diagnosa Kesehatan Daun secara Kontekstual
  @Post('ai/analyze-leaf')
  async analyzeLeaf(@Body() data: { lahanId: string }) {
    console.log(`[🤖 AI VISION] Memproses analisis foto daun untuk Lahan: ${data.lahanId}`);

    // Ambil data kelembapan terakhir dari database untuk menghasilkan diagnosis yang realistis
    const dataTerakhir = await this.sensorService.getLatestData(data.lahanId);
    const kelembapanAktal = dataTerakhir?.kelembapan ?? 60;

    let diagnosis = 'Tanaman Sehat & Subur (Kondisi Optimal)';
    let saran = 'Pertahankan kelembapan tanah dan pola manajemen air saat ini.';

    // Logika keputusan AI berbasis kondisi real-time lahan
    if (kelembapanAktal > 75) {
      diagnosis = 'Terindikasi Infeksi Jamur / Cercospora (Bercak Daun)';
      saran = 'Kelembapan tanah terlalu tinggi. Batasi irigasi sementara waktu untuk menghentikan spora.';
    } else if (kelembapanAktal < 50) {
      diagnosis = 'Gejala Klorosis (Kekurangan Nutrisi / Dehidrasi)';
      saran = 'Tanah terlalu kering. Berikan tambahan pupuk NPK dan optimalkan suplai irigasi.';
    }

    // Delay server 1.5 detik agar memberikan efek kalkulasi model AI sesungguhnya
    await new Promise(resolve => setTimeout(resolve, 1500));

    return {
      success: true,
      lahanId: data.lahanId,
      result: diagnosis,
      suggestion: saran,
      analyzedAt: new Date().toLocaleTimeString('id-ID') + ' WIB'
    };
  }
}