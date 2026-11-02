import { Body, Controller, Delete, Get, Patch } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';

@Controller('user')
@ApiTags('Users')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @ApiOperation({ summary: 'Mengambil profil pengguna yang sedang login' })
  @ApiResponse({ status: 200, description: 'Profil berhasil diambil.' })
  getMe(@CurrentUser('id') idUser: number) {
    return this.userService.getProfile(idUser);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Memperbarui profil pengguna yang sedang login' })
  @ApiResponse({ status: 200, description: 'Profil berhasil diperbarui.' })
  async updateMe(
    @CurrentUser('id') idUser: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    if (updateUserDto.username !== undefined) {
      await this.userService.update(idUser, {
        username: updateUserDto.username,
      });
    }
    return this.userService.getProfile(idUser);
  }
}
