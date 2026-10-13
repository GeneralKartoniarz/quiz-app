import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/registerDto';
import { LoginDto } from './dto/loginDto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: registerDto.email },
          { username: registerDto.username },
        ],
      },
    });

    if (existingUser) {
      throw new ConflictException('Uzytkownik o podanym adresie email lub loginie juz istnieje');
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(registerDto.password, saltRounds);

    const createdUser = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        username: registerDto.username,
        passwordHash,
      },
    });

    return this.generateAuthResponse(
      createdUser.id,
      createdUser.email,
      createdUser.username,
    );
  }

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Nieprawidlowy adres email lub haslo');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Nieprawidlowy adres email lub haslo');
    }

    return this.generateAuthResponse(user.id, user.email, user.username);
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Uzytkownik nie istnieje');
    }

    return user;
  }

  private async generateAuthResponse(
    id: string,
    email: string,
    username: string,
  ) {
    const payload = { sub: id, email, username };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      user: {
        id,
        email,
        username,
      },
    };
  }
}