import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'node:crypto';

const STATE_PURPOSE = 'google_oauth_state';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  constructor(private jwtService: JwtService) {
    super();
  }

  getAuthenticateOptions() {
    const state = this.jwtService.sign(
      { purpose: STATE_PURPOSE, nonce: randomBytes(8).toString('hex') },
      { expiresIn: '5m' },
    );
    return { session: false, state, prompt: 'select_account' };
  }
}

@Injectable()
export class GoogleCallbackGuard extends AuthGuard('google') {
  constructor(private jwtService: JwtService) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    try {
      const payload = this.jwtService.verify(String(req.query.state ?? ''));
      if (payload.purpose !== STATE_PURPOSE) throw new Error('state salah');
      await super.canActivate(context);
    } catch {
      // user batal, state tidak valid, atau Google gagal: controller yang redirect
      req.user = undefined;
    }
    return true;
  }

  getAuthenticateOptions() {
    return { session: false };
  }
}
