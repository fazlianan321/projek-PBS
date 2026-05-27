import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  
  async login(email: string, pass: string) {
    // 1. Cari user di database PostgreSQL (Port 5433)
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    
    if (!user || user.password !== pass) {
      throw new UnauthorizedException('Email atau password salah, Fazli!');
    }

    // 2. Generate JWT Token jika login berhasil
    const payload = { 
      sub: user.id, 
      email: user.email, 
      role: user.role 
    };
    
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        nama: user.name, // Diubah ke user.name agar sinkron dengan database
        email: user.email,
        role: user.role
      }
    };
  }