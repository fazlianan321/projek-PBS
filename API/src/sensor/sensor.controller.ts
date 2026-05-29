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

  // 🟢 PERBAIKAN: Sekarang rute ini benar-benar menyimpan status pompa ke database via Service
  @Post('pump/toggle')
  async togglePump(@Body() data: { lahanId: string; statusPompa: boolean }) {
    console.log(`[BACKEND IoT] Perintah Sakelar Diterima! Lahan: ${data.lahanId} | Pompa: ${data.statusPompa ? 'NYALA 🚰' : 'MATI 🔴'}`);
    
    // Menyimpan perubahan sakelar ke database. 
    // Kita berikan suhu & kelembapan 0 karena ini trigger tombol, bukan sensor fisik.
    // Gunakan casting 'as any' agar Prisma menerima properti statusPompa jika ada di skema Anda.
    await this.sensorService.createData({
      suhu: 0,
      kelembapan: 0,
      lahanId: data.lahanId,
      ...({ statusPompa: data.statusPompa } as any)
    });
    
    return {
      success: true,
      message: `Status pompa untuk lahan ${data.lahanId} berhasil diperbarui di database.`,
      statusTerakhir: data.statusPompa,
    };
  }
}