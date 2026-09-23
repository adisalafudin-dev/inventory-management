import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto.js';
import { ConflictException } from '@nestjs/common';
import { UserService } from '../user/user.service.js';
import { JwtService } from '@nestjs/jwt';

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

    const isMatch = await Bun.password.verify(password, user.password);

    if (!isMatch) {
      return null;
    }

    const { password: _, ...userWithoutPassword } = user;
    return { ...userWithoutPassword };
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
