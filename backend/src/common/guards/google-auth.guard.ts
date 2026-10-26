import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'node:crypto';
import { jwtConstants } from '../../auth/constants.js';

const STATE_PURPOSE = 'google_oauth_state';

// Secret khusus untuk state OAuth, dibedakan dari secret access token supaya
// state tidak pernah bisa dipakai sebagai Bearer token di JwtStrategy.
const STATE_SECRET = `${jwtConstants.secret}:google-oauth-state`;

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  constructor(private jwtService: JwtService) {
    super();
  }

  getAuthenticateOptions() {
    const state = this.jwtService.sign(
      { purpose: STATE_PURPOSE, nonce: randomBytes(8).toString('hex') },
      { secret: STATE_SECRET, expiresIn: '5m' },
    );
    return { session: false, state, prompt: 'select_account' };
  }
}

@Injectable()
export class GoogleCallbackGuard extends AuthGuard('google') {
  private readonly logger = new Logger(GoogleCallbackGuard.name);

  constructor(private jwtService: JwtService) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    try {
      const payload = this.jwtService.verify(String(req.query.state ?? ''), {
        secret: STATE_SECRET,
      });
      if (payload.purpose !== STATE_PURPOSE) throw new Error('state salah');
      await super.canActivate(context);
    } catch (err) {
      // user batal, state tidak valid, atau Google gagal: controller yang redirect
      this.logger.warn(
        `Login Google gagal: ${err instanceof Error ? err.message : String(err)}`,
      );
      req.user = undefined;
    }
    return true;
  }

  getAuthenticateOptions() {
    return { session: false };
  }
}
