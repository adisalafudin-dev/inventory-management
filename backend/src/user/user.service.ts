import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    // updatedAt is NOT NULL with no DB default -> must be set from aplikasi
    return this.prisma.db.orm.public.User.create({
      ...createUserDto,
      updatedAt: new Date().toISOString(),
    });
  }

  async get(id: number) {
    return this.prisma.db.orm.public.User.where({ id }).first();
  }

  async getByEmail(email: string) {
    return this.prisma.db.orm.public.User.where({ email }).first();
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return this.prisma.db.orm.public.User.where({ id }).update({
      ...updateUserDto,
      updatedAt: new Date().toISOString(),
    });
  }

  async remove(id: number) {
    return this.prisma.db.orm.public.User.where({ id }).delete();
  }
}
