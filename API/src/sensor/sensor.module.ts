import { Module } from '@nestjs/common';
import { SensorController } from './sensor.controller';
import { SensorService } from './sensor.service';
import { PrismaModule } from '../prisma/prisma.module';
@Module({
  imports: [PrismaModule], 
  controllers: [SensorController],
  providers: [SensorService],
  exports: [SensorService], 
})

export class SensorModule {}