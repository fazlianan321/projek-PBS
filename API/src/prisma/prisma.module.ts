import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Tambahkan decorator ini agar PrismaModule bisa diakses di mana saja tanpa import berulang
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Wajib ada ini
})
export class PrismaModule {}