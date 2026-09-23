import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { UserModule } from './user/user.module.js';
import { AuthModule } from './auth/auth.module.js';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard.js';
import { APP_FILTER, APP_GUARD } from '@nestjs/core/constants.js';
import { CategoryModule } from './category/category.module.js';
import { AlatBahanModule } from './alat-bahan/alat-bahan.module.js';
import { LocationModule } from './location/location.module.js';
import { DashboardModule } from './dashboard/dashboard.module.js';
import { TagModule } from './tag/tag.module.js';
import { validate } from './config/env.validation.js';
import { LoggerModule } from 'nestjs-pino';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),

    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' }, // Masa aktif token 1 hari
    }),

    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        transport:
          process.env.NODE_ENV !== 'production'
            ? {
                target: 'pino-pretty',
                options: { colorize: true, singleLine: true },
              }
            : undefined,
        redact: ['req.headers.authorization', 'req.body.password'],
        customProps: (req) => ({
          // nempel request ID biar bisa trace 1 request penuh
          requestId: req.id,
        }),
      },
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
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
  ],
  controllers: [AppController],
})
export class AppModule {}
