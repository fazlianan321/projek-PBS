import { Module } from '@nestjs/common';
import { SensorController } from './sensor.controller';
import { SensorService } from './sensor.service';

@Module({
  controllers: [SensorController],
  providers: [SensorService],
  exports: [SensorService], 
})
// Pastikan baris di bawah ini ada kata 'export'
export class SensorModule {}