import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Health')
export class AppController {
  @Get('health')
  @ApiOperation({ summary: 'Memeriksa status kesehatan API' })
  @ApiResponse({ status: 200, description: 'API berjalan dengan baik.' })
  health() {
    return { status: 'ok', timestamp: Date.now() };
  }
}
