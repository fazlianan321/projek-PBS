import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { SensorService } from './sensor.service';

@Controller('sensor')
export class SensorController {
  // 🟢 Tambahkan state memory global untuk menyimpan status pompa secara real-time berdasarkan Lahan ID
  private statusPompaGlobal: Record<string, boolean> = {};

  constructor(private readonly sensorService: SensorService) {}

  @Post('input')
  async inputData(@Body() data: { suhu: number; kelembapan: number; lahanId: string }) {
    return this.sensorService.createData(data);
  }

  // 🟢 PERBAIKAN GET LATEST: Gabungkan data sensor terakhir dari database dengan status sakelar HP terbaru
  @Get('latest/:lahanId')
  async getLatest(@Param('lahanId') lahanId: string) {
    const dataTerakhir = await this.sensorService.getLatestData(lahanId);
    
    // Ambil status pompa dari memory, jika belum pernah ditekan, default ke false (mati)
    const statusSakelarHp = this.statusPompaGlobal[lahanId] ?? false;

    // Jika data dari DB berupa object, kita sisipkan statusPompa ter-update ke dalamnya
    if (dataTerakhir && typeof dataTerakhir === 'object') {
      return {
        ...dataTerakhir,
        statusPompa: statusSakelarHp
      };
    }

    return { 
      lahanId, 
      statusPompa: statusSakelarHp 
    };
  }

  // 🟢 PERBAIKAN POST TOGGLE: Simpan status sakelar dari HP ke memory global agar langsung disinkronkan
  @Post('pump/toggle')
  async togglePump(@Body() data: { lahanId: string; statusPompa: boolean }) {
    console.log(`[BACKEND IoT] Perintah Sakelar Diterima! Lahan: ${data.lahanId} | Pompa: ${data.statusPompa ? 'NYALA 🚰' : 'MATI 🔴'}`);
    
    // Simpan ke dalam memory global berdasarkan ID Lahan
    this.statusPompaGlobal[data.lahanId] = data.statusPompa;
    
    return {
      success: true,
      message: `Status pompa untuk lahan ${data.lahanId} berhasil diperbarui di server menjadi ${data.statusPompa ? 'NYALA' : 'MATI'}.`,
      statusTerakhir: data.statusPompa,
    };
  }
}