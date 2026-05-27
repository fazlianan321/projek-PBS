import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SensorService {
  constructor(private prisma: PrismaService) {}

  async createData(data: { suhu: number; kelembapan: number; lahanId: string }) {
    // Menggunakan casting 'any' untuk memastikan properti sensorData terbaca
    return (this.prisma as any).sensorData.create({
      data: {
        suhu: data.suhu,
        kelembapan: data.kelembapan,
        lahanId: data.lahanId,
      },
    });
  }

  async getLatestData(lahanId: string) {
    return (this.prisma as any).sensorData.findFirst({
      where: { lahanId },
      orderBy: { createdAt: 'desc' },
    });
  }
}