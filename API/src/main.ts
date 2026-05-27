import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // --- TAMBAHKAN BARIS INI ---
  app.enableCors(); 
  // ---------------------------

  // 🟢 UBAH BARIS INI: Tambahkan '0.0.0.0' sebagai parameter kedua
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
  
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();