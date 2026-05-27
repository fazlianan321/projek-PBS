import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: any) { 
    const password = signInDto.password || signInDto.pass;
    return await this.authService.login(signInDto.email, password);
  }

  @Post('register')
  async signUp(@Body() signUpDto: any) { 
    // 🟢 ANTISIPASI: Ambil data nama dan password apa pun variasi nama properti dari Frontend
    const namaUser = signUpDto.name || signUpDto.nama;
    const passwordUser = signUpDto.password || signUpDto.pass;

    // Kirim data yang sudah pasti aman ke auth.service
    return await this.authService.register(namaUser, signUpDto.email, passwordUser);
  }
}