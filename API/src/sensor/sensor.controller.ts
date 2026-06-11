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

import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), 'API', '.env') }); 

import { GoogleGenAI } from '@google/genai';

@Controller('sensor')
export class SensorController {
  private statusPompaGlobal: Record<string, boolean> = {};

  constructor(private readonly sensorService: SensorService) {}

  @Get('lahan')
  async getLahan() {
    console.log('[BACKEND] 📡 Menerima permintaan daftar lahan dari aplikasi...');
    return this.sensorService.getDaftarLahan();
  }

  @Post('input')
  async inputData(@Body() data: { suhu: number; kelembapan: number; lahanId: string }) {
    const hasilSimpan = await this.sensorService.createData(data);

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

  @Get('latest/:lahanId')
  async getLatest(@Param('lahanId') lahanId: string) {
    const dataTerakhir = await this.sensorService.getLatestData(lahanId);
    const statusSakelarHp = this.statusPompaGlobal[lahanId] ?? this.statusPompaGlobal['TERAKHIR_DIKLIK'] ?? false;

    if (dataTerakhir) {
      const plainData = JSON.parse(JSON.stringify(dataTerakhir));
      return {
        id: plainData.id,
        suhu: plainData.suhu,
        kelembapan: plainData.kelembapan,
        lahanId: plainData.lahanId,
        createdAt: plainData.createdAt,
        statusPompa: statusSakelarHp
      };
    }

    return { 
      lahanId, 
      statusPompa: statusSakelarHp 
    };
  }

  @Post('pump/toggle')
  async togglePump(@Body() data: { lahanId: string; statusPompa: boolean }) {
    console.log(`[BACKEND IoT] Perintah Sakelar Diterima! Lahan: ${data.lahanId} | Pompa: ${data.statusPompa ? 'NYALA 🚰' : 'MATI 🔴'}`);
    
    this.statusPompaGlobal[data.lahanId] = data.statusPompa;
    this.statusPompaGlobal['TERAKHIR_DIKLIK'] = data.statusPompa;
    
    return {
      success: true,
      message: `Status pompa untuk lahan ${data.lahanId} berhasil diperbarui di server menjadi ${data.statusPompa ? 'NYALA' : 'MATI'}.`,
      statusTerakhir: data.statusPompa,
    };
  }

  @Post('ai/analyze-leaf')
  @UseInterceptors(FileInterceptor('file')) 
  async analyzeLeaf(
    @UploadedFile() file: { originalname: string; mimetype: string; buffer: Buffer; size: number },
    @Body() data: { lahanId: string }
  ) {
    if (!data || !data.lahanId) {
      throw new BadRequestException('Data text body (lahanId) tidak ditemukan.');
    }
    if (!file) {
      throw new BadRequestException('Data file biner (file gambar daun) tidak ditemukan.');
    }

    console.log(`[🤖 AI VISION] Memproses analisis foto daun "${file.originalname}" untuk Lahan: ${data.lahanId}`);

    const apiKeyAktual = process.env.GEMINI_API_KEY || '';
    console.log(`[🔍 DEBUG CONFIG] Memeriksa Key di process.env: ${apiKeyAktual ? 'TERSEDIA (Diawali: ' + apiKeyAktual.substring(0, 7) + '...)' : 'KOSONG / UNDEFINED ❌'}`);
    
    if (!apiKeyAktual) {
      throw new BadRequestException('Server gagal membaca konfigurasi GEMINI_API_KEY dari file .env proyek.');
    }

    const ai = new GoogleGenAI({ apiKey: apiKeyAktual });

    const dataTerakhir = await this.sensorService.getLatestData(data.lahanId);
    const kelembapanAktal = dataTerakhir?.kelembapan ?? 60;
    const suhuAktual = dataTerakhir?.suhu ?? 28; 

    let diagnosis = 'Tanaman Sehat & Subur (Kondisi Optimal)';
    let saran = 'Pertahankan kelembapan tanah dan pola manajemen air saat ini.';

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

      if (!response.text) {
        throw new Error('Gemini merespon tanpa teks.');
      }

      const aiResult = JSON.parse(response.text.trim());
      
      diagnosis = aiResult.result;
      saran = aiResult.suggestion;

    } catch (error) {
      console.error(`[⚠️ CLOUD ERROR] Gagal menghubungi Gemini. Pesan Error:`, error);
      
      diagnosis = 'Analisis AI Gagal (Koneksi Terputus/API Error)';
      saran = 'Gagal memproses gambar. Menggunakan estimasi sensor lokal sementara waktu.';

      if (kelembapanAktal > 75) {
        diagnosis = 'Terindikasi Infeksi Jamur / Cercospora (Bercak Daun) [Fallback Mode]';
        saran = 'Kelembapan tanah terlalu tinggi. Batasi irigasi sementara waktu untuk menghentikan spora.';
      } else if (kelembapanAktal < 50) {
        diagnosis = 'Gejala Klorosis (Kekurangan Nutrisi / Dehidrasi) [Fallback Mode]';
        saran = 'Tanah terlalu kering. Berikan tambahan pupuk NPK dan optimalkan suplai irigasi.';
      }

      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    return {
      success: true,
      lahanId: data.lahanId,
      result: diagnosis,
      suggestion: saran,
      analyzedAt: new Date().toLocaleTimeString('id-ID') + ' WIB'
    };
  }
}