import { Test, TestingModule } from '@nestjs/testing';
import { AlatBahanController } from './alat-bahan.controller.js';
import { AlatBahanService } from './alat-bahan.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('AlatBahanController', () => {
  let controller: AlatBahanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlatBahanController],
      providers: [
        AlatBahanService,
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    controller = module.get<AlatBahanController>(AlatBahanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
