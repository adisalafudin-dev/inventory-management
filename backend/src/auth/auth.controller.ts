import { Request, UseGuards, Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { CreateAuthDto } from './dto/create-auth.dto.js';
import { AuthGuard } from '@nestjs/passport';
import { Public } from '../common/decorators/public.decorator.js';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  @ApiOperation({ summary: 'Mendaftarkan pengguna baru' })
  @ApiResponse({ status: 201, description: 'Pengguna berhasil didaftarkan.' })
  @ApiResponse({
    status: 409,
    description: 'Username atau email sudah digunakan.',
  })
  register(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto);
  }

  @Post('login')
  @Public()
  @UseGuards(AuthGuard('local'))
  @ApiOperation({ summary: 'Login pengguna' })
  @ApiResponse({
    status: 200,
    description: 'Login berhasil dan token akses dikembalikan.',
  })
  @ApiResponse({
    status: 401,
    description: 'Username atau password tidak valid.',
  })
  login(
    @Request() req: { user: { id: number; username: string; email: string } },
  ) {
    return this.authService.login(req.user);
  }
}
