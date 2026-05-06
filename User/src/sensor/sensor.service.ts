import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SensorService {
  constructor(private prisma: PrismaService) {}

  // Commit 2: Menggunakan string untuk lahanId sesuai UUID di Lahan
  async createData(data: { suhu: number; kelembapan: number; lahanId: string }) {
    return this.prisma.sensorData.create({
      data: {
        suhu: data.suhu,
        kelembapan: data.kelembapan,
        lahanId: data.lahanId,
      },
    });
  }

  async getLatestData(lahanId: string) {
    return this.prisma.sensorData.findFirst({
      where: { lahanId },
      orderBy: { createdAt: 'desc' },
    });
  }
}