import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

@Controller('user')
@ApiTags('Users')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Mengambil pengguna berdasarkan ID' })
  @ApiResponse({ status: 200, description: 'Data pengguna berhasil diambil.' })
  @ApiResponse({ status: 404, description: 'Pengguna tidak ditemukan.' })
  async get(@Param('id') id: string) {
    return this.userService.get(+id);
  }

  @Get()
  @ApiOperation({ summary: 'Mengambil pengguna berdasarkan email' })
  @ApiResponse({ status: 200, description: 'Data pengguna berhasil diambil.' })
  @ApiResponse({ status: 404, description: 'Pengguna tidak ditemukan.' })
  async getByEmail(@Query('email') email: string) {
    return this.userService.getByEmail(email);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Memperbarui data pengguna' })
  @ApiResponse({
    status: 200,
    description: 'Data pengguna berhasil diperbarui.',
  })
  @ApiResponse({ status: 404, description: 'Pengguna tidak ditemukan.' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Menghapus pengguna' })
  @ApiResponse({ status: 200, description: 'Pengguna berhasil dihapus.' })
  @ApiResponse({ status: 404, description: 'Pengguna tidak ditemukan.' })
  async remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
