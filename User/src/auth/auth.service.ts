import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, pass: string) {
    // 1. Cari user berdasarkan email
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    // 2. Jika tidak ada user
    if (!user) {
      throw new UnauthorizedException('Email tidak ditemukan!');
    }

    // 3. Cek password (karena diisi manual di Studio, kita cek teks biasa dulu)
    if (user.password !== pass) {
      throw new UnauthorizedException('Password salah!');
    }

    // 4. Jika sukses, buat Token JWT
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        name: user.name,
        email: user.email,
      }
    };
  }
}