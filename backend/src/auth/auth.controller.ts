import {
  Request,
  UseGuards,
  Body,
  Controller,
  Post,
  Get,
  Res,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service.js';
import { CreateAuthDto } from './dto/create-auth.dto.js';
import { AuthGuard } from '@nestjs/passport';
import { Public } from '../common/decorators/public.decorator.js';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  GoogleAuthGuard,
  GoogleCallbackGuard,
} from '../common/guards/google-auth.guard.js';
import { ExchangeCodeDto } from './dto/exchange-code.dto.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';

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

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleLogin() {
    // guard yang me-redirect ke Google
  }

  @Get('google/callback')
  @UseGuards(GoogleCallbackGuard)
  googleCallback(
    @Res() res: Response,
    @CurrentUser()
    user: { id: number; username: string; email: string } | undefined,
  ) {
    // 1. Fallback check for missing environment variable
    const frontend = process.env.FRONTEND_URL || 'http://localhost:3000';

    // 2. Handle unauthorized/failed OAuth login attempts
    if (!user) {
      return res.redirect(
        HttpStatus.MOVED_PERMANENTLY, // Optional: explicit HTTP 301/302 status code
        `${frontend}/login?error=google_failed`,
      );
    }

    // 3. Generate short-lived auth exchange code and redirect
    const code = this.authService.createLoginCode(user.id);
    return res.redirect(`${frontend}/auth/callback?code=${code}`);
  }

  @Post('google/exchange')
  googleExchange(@Body() dto: ExchangeCodeDto) {
    return this.authService.exchangeCode(dto.code);
  }
}
