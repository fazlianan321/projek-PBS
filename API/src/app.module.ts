import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { SensorModule } from './sensor/sensor.module';
// 1. TAMBAHKAN IMPORT INI
import { AuthModule } from './auth/auth.module'; 

@Module({
  // 2. MASUKKAN AuthModule KE DALAM ARRAY IMPORTS
  imports: [PrismaModule, SensorModule, AuthModule], 
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}