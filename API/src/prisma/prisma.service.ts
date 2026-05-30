import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    // 1. Tambahkan pengecekan atau tulis langsung alamatnya
    const connectionString = "postgresql://postgres:123@localhost:5433/db_projek_pbs?schema=public";
    
    const pool = new Pool({ 
      connectionString: connectionString 
    });

    const adapter = new PrismaPg(pool);
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