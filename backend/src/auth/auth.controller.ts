import { Request, UseGuards, Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { CreateAuthDto } from './dto/create-auth.dto.js';
import { AuthGuard } from '@nestjs/passport';
import { Public } from '../common/decorators/public.decorator.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  register(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto);
  }

  @Post('login')
  @Public()
  @UseGuards(AuthGuard('local'))
  login(@Request() req: { user: { id: number; username: string } }) {
    return this.authService.login(req.user);
  }
}
