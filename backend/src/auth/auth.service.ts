import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto.js';
import { ConflictException } from '@nestjs/common';
import { UserService } from '../user/user.service.js';
import { JwtService } from '@nestjs/jwt';
import { Profile } from 'passport-google-oauth20';
import { randomBytes } from 'node:crypto';
import { UnauthorizedException } from '@nestjs/common';
import type { Profile } from 'passport-google-oauth20';

type AuthenticatedUser = {
  id: number;
  username: string;
  email: string;
};

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  private readonly loginCodes = new Map<
    string,
    { userId: number; expires: number }
  >();

  async register(createAuthDto: CreateAuthDto) {
    const userExists = await this.userService.getByEmail(createAuthDto.email);

    if (userExists) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await Bun.password.hash(createAuthDto.password, {
      algorithm: 'bcrypt',
      cost: 10,
    });

    const user = await this.userService.create({
      ...createAuthDto,
      password: hashedPassword,
    });

    const { password: _password, ...userWithoutPassword } = user;

    // Langsung buat payload dan token setelah data user tersimpan
    const payload = { username: user.username, sub: user.id };
    const access_token = this.jwtService.sign(payload);

    // Kembalikan token sekaligus data user
    return {
      message: 'Registrasi berhasil',
      user: userWithoutPassword,
      access_token,
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.getByEmail(email);

    if (!user) {
      return null;
    }

    if (!user.password) {
      throw new UnauthorizedException(
        'Akun ini terdaftar lewat Google. Silakan masuk dengan Google.',
      );
    }

    const isMatch = await Bun.password.verify(password, user.password);

    if (!isMatch) {
      return null;
    }

    const { password: _, ...userWithoutPassword } = user;
    return { ...userWithoutPassword };
  }

  async validateGoogleUser(profile: Profile) {
    const email = profile.emails?.[0]?.value;
    const verified = String(profile._json?.email_verified) === 'true';

    if (!email || !verified) {
      throw new UnauthorizedException('Email Google tidak terverifikasi');
    }

    let user = await this.userService.getGoogleById(profile.id);

    if (!user) {
      const existing = await this.userService.getByEmail(email);
      user = existing
        ? await this.userService.linkGoogleAccount(existing.id, profile.id)
        : await this.userService.createFromGoogle({
            email,
            username: profile.displayName || email.split('@')[0],
            googleId: profile.id,
          });
    }

    return { id: user!.id, username: user!.username, email: user!.email };
  }

  createLoginCode(userId: number) {
    const now = Date.now();
    for (const [key, v] of this.loginCodes) {
      if (v.expires < now) this.loginCodes.delete(key); // bersihkan yang kedaluwarsa
    }
    const code = randomBytes(32).toString('base64url');
    this.loginCodes.set(code, { userId, expires: now + 60_000 });
    return code;
  }

  async exchangeCode(code: string) {
    const entry = this.loginCodes.get(code);
    this.loginCodes.delete(code); // sekali pakai
    if (!entry || entry.expires < Date.now()) {
      throw new UnauthorizedException(
        'Kode login tidak valid atau kedaluwarsa',
      );
    }

    const user = await this.userService.get(entry.userId);
    if (!user) throw new UnauthorizedException('User tidak ditemukan');

    return this.login({
      id: user.id,
      username: user.username,
      email: user.email,
    });
  }

  login(user: AuthenticatedUser) {
    const payload = { username: user.username, sub: user.id };

    return {
      message: 'Login berhasil',
      user,
      access_token: this.jwtService.sign(payload),
    };
  }
}
