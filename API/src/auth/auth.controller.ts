import { Body, Controller, Post, Get, HttpCode, HttpStatus } from '@nestjs/common'; // 1. Pastikan Get di-import
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
    const namaUser = signUpDto.name || signUpDto.nama;
    const passwordUser = signUpDto.password || signUpDto.pass;
    return await this.authService.register(namaUser, signUpDto.email, passwordUser);
  }

  @Get('users')
  async getAllUsers() {
    return await this.authService.findAllUsers(); 
  }
}