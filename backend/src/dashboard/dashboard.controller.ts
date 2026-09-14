import { Controller, Get, Request } from '@nestjs/common';
import { DashboardService } from './dashboard.service.js';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  getSummary(@Request() req: { user: { userId: number; username: string } }) {
    // Ekstrak ID dari token JWT untuk menjamin keamanan data
    const idUser = Number(req.user.userId);
    return this.dashboardService.getSummary(idUser);
  }
}
