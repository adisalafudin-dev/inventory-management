import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { UserModule } from './user/user.module.js';
import { AuthModule } from './auth/auth.module.js';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard.js';
import { APP_GUARD } from '@nestjs/core/constants.js';
import { CategoryModule } from './category/category.module.js';
import { AlatBahanModule } from './alat-bahan/alat-bahan.module.js';
import { LocationModule } from './location/location.module.js';
import { DashboardModule } from './dashboard/dashboard.module.js';
import { TagModule } from './tag/tag.module.js';
export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com
    ObserveModule.forRoot({
      appKey: 'YOUR_APP_KEY',
      appSecret: 'YOUR_APP_SECRET',
      serviceId: 'nest-starter',
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' }, // Masa aktif token 1 hari
    }),
    PrismaModule,
    UserModule,
    AuthModule,
    CategoryModule,
    AlatBahanModule,
    LocationModule,
    DashboardModule,
    TagModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  controllers: [AppController],
})
export class AppModule {}
