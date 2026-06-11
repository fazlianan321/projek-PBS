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
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    
    if (!user || user.password !== pass) {
      throw new UnauthorizedException('Email atau password salah, Fazli!');
    }

    const payload = { 
      sub: user.id, 
      email: user.email, 
      role: user.role 
    };
    
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        nama: user.nama,
        email: user.email,
        role: user.role
      }
    };
  }

  async register(name: string, email: string, password: string) {
    const userExists = await this.prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      throw new BadRequestException('Email ini sudah terdaftar di ekosistem TerraVision!');
    }

    const newUser = await this.prisma.user.create({
      data: {
        nama: name, 
        email: email, 
        password: password, 
      },
    });

    return {
      statusCode: 201,
      message: 'Akun TerraVision Anda berhasil dibuat! Silakan masuk.',
      userId: newUser.id,
    };
  } 

  async findAllUsers() {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        nama: true,
        email: true,
        role: true,
      },
    });
  }
}