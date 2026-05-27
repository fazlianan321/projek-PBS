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

  /**
   * Mengelola pendaftaran user baru ke dalam ekosistem TerraVision
   */
  async register(name: string, email: string, pass: string) {
    // Validasi: Pastikan email belum pernah digunakan
    const userExists = await this.prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      throw new BadRequestException('Email ini sudah terdaftar di ekosistem TerraVision!');
    }

    // Simpan data user baru dengan role default ke database
    const newUser = await this.prisma.user.create({
      data: {
        name, // Jika di skema prisma namamu 'name' atau 'nama', sesuaikan di sini
        email,
        password: pass,
        role: 'USER', // Default role untuk pendaftaran baru
      },
    });

    return {
      statusCode: 201,
      message: 'Akun TerraVision Anda berhasil dibuat! Silakan masuk.',
      userId: newUser.id,
    };
  } // <-- Akhir fungsi register
} // <-- Akhir dari class AuthService