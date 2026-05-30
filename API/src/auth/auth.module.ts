import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule, // [BAGIAN 1: Koneksi Database]
    JwtModule.register({ // [BAGIAN 2: Konfigurasi JWT]
      global: true,
      secret: 'SECRET_KEY_TEKNOKRAT_2026',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService], // [BAGIAN 3: Service & Controller]
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}