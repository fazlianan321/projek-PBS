import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { SensorModule } from './sensor/sensor.module';

@Module({
  imports: [PrismaModule, SensorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
