import { Module } from '@nestjs/common';
import { SensorController } from './sensor.controller';
import { SensorService } from './sensor.service';
import { PrismaModule } from '../prisma/prisma.module';
@Module({
  imports: [PrismaModule], // Tambahkan ini jika tidak menggunakan @Global() di PrismaModule
  controllers: [SensorController],
  providers: [SensorService],
  exports: [SensorService], 
})
// Pastikan baris di bawah ini ada kata 'export'
export class SensorModule {}