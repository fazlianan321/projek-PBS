import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: any) { 
    return await this.authService.login(signInDto.email, signInDto.password);
  }

  // 👇 1. TAMBAHKAN BLOK REGISTRASI INI DI BAWAH LOGIN
  @Post('register')
  async signUp(@Body() signUpDto: any) { 
    // Mengirim data nama, email, dan password ke auth.service
    return await this.authService.register(signUpDto.name, signUpDto.email, signUpDto.password);
  }
}