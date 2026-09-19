import { Controller, Get, Request } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DashboardService } from './dashboard.service.js';

@Controller('dashboard')
@ApiTags('Dashboard')
@ApiBearerAuth()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Mengambil ringkasan dashboard inventori pengguna' })
  @ApiResponse({
    status: 200,
    description: 'Ringkasan dashboard berhasil diambil.',
  })
  getSummary(@Request() req: { user: { userId: number; username: string } }) {
    // Ekstrak ID dari token JWT untuk menjamin keamanan data
    const idUser = Number(req.user.userId);
    return this.dashboardService.getSummary(idUser);
  }
}
