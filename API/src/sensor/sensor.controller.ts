import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { SensorService } from './sensor.service';

@Controller('sensor')
export class SensorController {
  constructor(private readonly sensorService: SensorService) {}

  @Post('input')
  async inputData(@Body() data: { suhu: number; kelembapan: number; lahanId: string }) {
    return this.sensorService.createData(data);
  }

  @Get('latest/:lahanId')
  async getLatest(@Param('lahanId') lahanId: string) {
    return this.sensorService.getLatestData(lahanId);
  }

  // 🟢 PERBAIKAN BARU: Rute untuk mengubah status sakelar pompa air dari aplikasi HP
  @Post('pump/toggle')
  async togglePump(@Body() data: { lahanId: string; statusPompa: boolean }) {
    // Menampilkan log di terminal backend saat tombol di HP Fazli ditekan
    console.log(`[BACKEND IoT] Perintah Sakelar Diterima! Lahan: ${data.lahanId} | Pompa: ${data.statusPompa ? 'NYALA 🚰' : 'MATI 🔴'}`);
    
    // Kembalikan respon sukses ke aplikasi React Native
    return {
      success: true,
      message: `Status pompa untuk lahan ${data.lahanId} berhasil diubah menjadi ${data.statusPompa ? 'Aktif' : 'Nonaktif'}`,
      statusTerakhir: data.statusPompa,
    };
  }
}