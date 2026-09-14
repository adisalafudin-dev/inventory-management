import { Test, TestingModule } from '@nestjs/testing';
import { AlatBahanService } from './alat-bahan.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('AlatBahanService', () => {
  let service: AlatBahanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AlatBahanService, { provide: PrismaService, useValue: {} }],
    }).compile();

    service = module.get<AlatBahanService>(AlatBahanService);
  });

  it('should be defined', () => {
    expect(service.create);
  });
});
