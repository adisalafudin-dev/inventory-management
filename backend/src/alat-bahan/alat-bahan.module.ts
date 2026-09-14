import { Module } from '@nestjs/common';
import { AlatBahanService } from './alat-bahan.service.js';
import { AlatBahanController } from './alat-bahan.controller.js';

@Module({
  controllers: [AlatBahanController],
  providers: [AlatBahanService],
})
export class AlatBahanModule {}
