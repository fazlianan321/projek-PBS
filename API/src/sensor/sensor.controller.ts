import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { SensorService } from './sensor.service';

@Controller('sensor')
export class SensorController {
  // 🟢 Memory lokal untuk menyimpan status sakelar pompa secara real-time berdasarkan Lahan ID
  private statusPompaGlobal: Record<string, boolean> = {};

  constructor(private readonly sensorService: SensorService) {}

  @Post('input')
  async inputData(@Body() data: { suhu: number; kelembapan: number; lahanId: string }) {
    return this.sensorService.createData(data);
  }

  // 🟢 GET LATEST (FINAL): Memetakan data sensor dan memaksakan status sakelar HP masuk ke JSON
  @Get('latest/:lahanId')
  async getLatest(@Param('lahanId') lahanId: string) {
    const dataTerakhir = await this.sensorService.getLatestData(lahanId);
    const statusSakelarHp = this.statusPompaGlobal[lahanId] ?? false;

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
    
    return {
      success: true,
      message: `Status pompa untuk lahan ${data.lahanId} berhasil diperbarui di server menjadi ${data.statusPompa ? 'NYALA' : 'MATI'}.`,
      statusTerakhir: data.statusPompa,
    };
  }
}