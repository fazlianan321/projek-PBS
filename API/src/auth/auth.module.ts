import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule, 
    JwtModule.register({ 
      global: true,
      secret: 'SECRET_KEY_TEKNOKRAT_2026',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService], 
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}