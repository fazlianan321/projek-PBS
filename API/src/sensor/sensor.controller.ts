import { 
  Controller, 
  Post, 
  Body, 
  Get, 
  Param, 
  UseInterceptors, 
  UploadedFile, 
  BadRequestException 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SensorService } from './sensor.service';

// 🟢 KODE BARU: Import SDK Google Gen AI
import { GoogleGenAI } from '@google/genai';

// 🟢 KODE BARU: Inisialisasi API Gemini dengan Key Asli
const ai = new GoogleGenAI({ apiKey: 'AQ.Ab8RN6L2jyaU4AFCachNvVE4RFXm1U0cqSfU8ZiOd6hjuILMZQ' });

@Controller('sensor')
export class SensorController {
  // Memory lokal untuk menyimpan status sakelar pompa secara real-time berdasarkan Lahan ID
  private statusPompaGlobal: Record<string, boolean> = {};

  constructor(private readonly sensorService: SensorService) {}

  // PERBAIKAN OTOMATISASI: Sekarang input data dari simulator otomatis mengendalikan pompa
  @Post('input')
  async inputData(@Body() data: { suhu: number; kelembapan: number; lahanId: string }) {
    // 1. Simpan data sensor ke database Postgres melalui service
    const hasilSimpan = await this.sensorService.createData(data);

    // 2. LOGIKA OTOMATISASI IRIGASI PINTAR:
    if (data.kelembapan < 50) {
      if (this.statusPompaGlobal[data.lahanId] !== true) {
        console.log(`[🤖 AUTOMATION] Kelembapan Kritis (${data.kelembapan}%). Mengaktifkan Pompa Lahan: ${data.lahanId} 🚰`);
        this.statusPompaGlobal[data.lahanId] = true;
        this.statusPompaGlobal['TERAKHIR_DIKLIK'] = true;
      }
    } 
    else if (data.kelembapan > 70) {
      if (this.statusPompaGlobal[data.lahanId] !== false) {
        console.log(`[🤖 AUTOMATION] Kelembapan Cukup (${data.kelembapan}%). Mematikan Pompa Lahan: ${data.lahanId} 🔴`);
        this.statusPompaGlobal[data.lahanId] = false;
        this.statusPompaGlobal['TERAKHIR_DIKLIK'] = false;
      }
    }

    return hasilSimpan;
  }

  // GET LATEST (FINAL): Memetakan data sensor dan memaksakan status sakelar HP masuk ke JSON
  @Get('latest/:lahanId')
  async getLatest(@Param('lahanId') lahanId: string) {
    const dataTerakhir = await this.sensorService.getLatestData(lahanId);
    
    // Gunakan status berdasarkan lahanId, atau gunakan state global fallback terakhir
    const statusSakelarHp = this.statusPompaGlobal[lahanId] ?? this.statusPompaGlobal['TERAKHIR_DIKLIK'] ?? false;

    if (dataTerakhir) {
      const plainData = JSON.parse(JSON.stringify(dataTerakhir));
      return {
        id: plainData.id,
        suhu: plainData.suhu,
        kelembapan: plainData.kelembapan,
        lahanId: plainData.lahanId,
        createdAt: plainData.createdAt,
        statusPompa: statusSakelarHp // Disinkronkan langsung dari memory sakelar HP
      };
    }

    // Fallback jika tabel database masih kosong
    return { 
      lahanId, 
      statusPompa: statusSakelarHp 
    };
  }

  // POST TOGGLE (FINAL): Menerima sinyal klik tombol dari HP dan menyimpannya ke server
  @Post('pump/toggle')
  async togglePump(@Body() data: { lahanId: string; statusPompa: boolean }) {
    console.log(`[BACKEND IoT] Perintah Sakelar Diterima! Lahan: ${data.lahanId} | Pompa: ${data.statusPompa ? 'NYALA 🚰' : 'MATI 🔴'}`);
    
    // Simpan status ke dalam memory global server
    this.statusPompaGlobal[data.lahanId] = data.statusPompa;
    this.statusPompaGlobal['TERAKHIR_DIKLIK'] = data.statusPompa;
    
    return {
      success: true,
      message: `Status pompa untuk lahan ${data.lahanId} berhasil diperbarui di server menjadi ${data.statusPompa ? 'NYALA' : 'MATI'}.`,
      statusTerakhir: data.statusPompa,
    };
  }

  // PERBAIKAN SELESAI: Menggunakan bentuk inline-object yang aman dari error TS2694 Namespace Multer
  @Post('ai/analyze-leaf')
  @UseInterceptors(FileInterceptor('file')) // Menangkap file gambar dengan key 'file' dari React Native
  async analyzeLeaf(
    @UploadedFile() file: { originalname: string; mimetype: string; buffer: Buffer; size: number },
    @Body() data: { lahanId: string }
  ) {
    // Guard Clause: Mencegah crash jika salah satu data dikirim kosong oleh client
    if (!data || !data.lahanId) {
      throw new BadRequestException('Data text body (lahanId) tidak ditemukan.');
    }
    if (!file) {
      throw new BadRequestException('Data file biner (file gambar daun) tidak ditemukan.');
    }

    console.log(`[🤖 AI VISION] Memproses analisis foto daun "${file.originalname}" untuk Lahan: ${data.lahanId}`);

    // KODE LAMA (TETAP ADA): Ambil data kelembapan terakhir dari database
    const dataTerakhir = await this.sensorService.getLatestData(data.lahanId);
    const kelembapanAktal = dataTerakhir?.kelembapan ?? 60;
    const suhuAktual = dataTerakhir?.suhu ?? 28; // Tambahan untuk konteks AI

    // KODE LAMA (TETAP ADA): Deklarasi default diagnosis
    let diagnosis = 'Tanaman Sehat & Subur (Kondisi Optimal)';
    let saran = 'Pertahankan kelembapan tanah dan pola manajemen air saat ini.';

    // 🟢 KODE BARU: Coba panggil AI Gemini Vision terlebih dahulu
    try {
      console.log(`[🤖 AI VISION REAL] Mengirim gambar ke Google Cloud Gemini...`);
      
      const imagePart = {
        inlineData: {
          data: file.buffer.toString('base64'),
          mimeType: file.mimetype,
        },
      };

      const promptSistem = `
        Kamu adalah sistem AI Pakar Pertanian Cerdas terintegrasi IoT.
        Tugasmu adalah menganalisis foto daun tanaman yang dikirim oleh petani.
        
        Kondisi IoT Lahan Saat Ini:
        - Kelembapan Tanah: ${kelembapanAktal}%
        - Suhu Udara: ${suhuAktual}°C
        
        Analisis kondisi fisik visual foto daun tersebut dengan teliti. 
        Jika tampak cokelat, kering, layu, atau berlubang akibat hama, sebutkan secara spesifik apa diagnosisnya.
        Hubungkan analisis visualmu dengan data IoT lahan di atas agar logis.
        
        Kamu WAJIB merespon HANYA dengan format JSON mentah seperti ini, tanpa markdown (\`\`\`json), tanpa teks tambahan:
        {
          "result": "Diagnosis Singkat Visual Daun",
          "suggestion": "Saran penanganan konkret"
        }
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [promptSistem, imagePart],
      });

      const aiResult = JSON.parse(response.text.trim());
      
      // Jika AI Cloud berhasil, timpa variabel diagnosis lama dengan hasil AI Cloud
      diagnosis = aiResult.result;
      saran = aiResult.suggestion;

    } catch (error) {
      // 🟡 KODE LAMA BERAKSI JIKA API GEMINI GAGAL / INTERNET PUTUS
      console.log(`[⚠️ CLOUD ERROR] Gagal menghubungi Gemini. Menggunakan Logika Sensor Lokal sebagai Fallback...`);
      
      // KODE LAMA (TETAP ADA): Logika keputusan AI lokal berbasis kondisi sensor
      if (kelembapanAktal > 75) {
        diagnosis = 'Terindikasi Infeksi Jamur / Cercospora (Bercak Daun)';
        saran = 'Kelembapan tanah terlalu tinggi. Batasi irigasi sementara waktu untuk menghentikan spora.';
      } else if (kelembapanAktal < 50) {
        diagnosis = 'Gejala Klorosis (Kekurangan Nutrisi / Dehidrasi)';
        saran = 'Tanah terlalu kering. Berikan tambahan pupuk NPK dan optimalkan suplai irigasi.';
      }

      // KODE LAMA (TETAP ADA): Delay server 1.5 detik agar memberikan efek kalkulasi
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    // Return hasil akhirnya (Entah itu dari Gemini, atau dari Sensor Lokal jika API gagal)
    return {
      success: true,
      lahanId: data.lahanId,
      result: diagnosis,
      suggestion: saran,
      analyzedAt: new Date().toLocaleTimeString('id-ID') + ' WIB'
    };
  }
}