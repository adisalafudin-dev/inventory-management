import { Test, TestingModule } from '@nestjs/testing';
import { TagController } from './tag.controller.js';
import { TagService } from './tag.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('TagController', () => {
  let controller: TagController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TagController],
      providers: [TagService, { provide: PrismaService, useValue: {} }],
    }).compile();

    controller = module.get<TagController>(TagController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
