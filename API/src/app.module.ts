import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { SensorModule } from './sensor/sensor.module';
import { AuthModule } from './auth/auth.module'; 

@Module({
  imports: [PrismaModule, SensorModule, AuthModule], 
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}