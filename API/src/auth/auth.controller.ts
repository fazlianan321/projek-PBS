import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  // Gunakan tipe data yang jelas daripada Record<string, any>
  async signIn(@Body() signInDto: any) { 
    // Kita panggil service login yang sudah kamu buat tadi
    return await this.authService.login(signInDto.email, signInDto.password);
  }
}