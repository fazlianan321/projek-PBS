import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const pool = new Pool({ 
      connectionString: process.env.DATABASE_URL 
    });
    const adapter = new PrismaPg(pool);
    
    // Di Prisma 7, kita melewatkan adapter, bukan URL string
    super({ adapter });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log('✅ DATABASE CONNECTED ON PORT 5433');
    } catch (error) {
      console.error('❌ KONEKSI GAGAL:', error);
    }
  }
}