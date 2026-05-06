// User/prisma.config.ts
import 'dotenv/config';
import { defineConfig } from '@prisma/config';

export default defineConfig({
  // Menggunakan path relatif yang sudah berhasil terbaca oleh Prisma CLI
  schema: './prisma/schema.prisma',
  
  migrations: {
    path: './prisma/migrations',
  },

  datasource: {
    // Memastikan URL database diambil dari file .env
    url: process.env['DATABASE_URL'],
  },
});