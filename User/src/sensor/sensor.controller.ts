import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { SensorService } from './sensor.service';

@Controller('sensor')
export class SensorController {
  constructor(private readonly sensorService: SensorService) {}

  @Post('input')
  async inputData(@Body() data: { suhu: number; kelembapan: number; lahanId: string }) {
    return this.sensorService.createData(data);
  }

  @Get('latest/:lahanId')
  async getLatest(@Param('lahanId') lahanId: string) {
    return this.sensorService.getLatestData(lahanId);
  }
}