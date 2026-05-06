import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  // Constructor kosong saja Fazli, biar gak kena error TS2353 lagi
  constructor() {
    super();
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log('✅ DATABASE CONNECTED: Akhirnya bisa lanjut!');
    } catch (error) {
      console.error('❌ GAGAL: Masalahnya di PostgreSQL atau .env kamu.', error);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}