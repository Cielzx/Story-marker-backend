import { Injectable, NotFoundException } from '@nestjs/common';
import { compare } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/database/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { UserService } from '../users/user.service';
import { MailerService } from '@nestjs-modules/mailer';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private mailerService: MailerService,
    private UserService: UserService,
    private jwtService: JwtService,
  ) {}
  async validateUser(userEmail: string, userPassword: string) {
    const user = await this.UserService.findByEmail(userEmail);
    if (user) {
      const password = await compare(userPassword, user.password);
      if (password) {
        return { email: user.email };
      }
    }
    return null;
  }

  async requestPasswordReset(email: string) {
    const user = await this.UserService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const token = uuidv4();
    const expire = new Date();

    expire.setMinutes(expire.getMinutes() + 20);

    await this.prismaService.user.update({
      where: { email },
      data: {
        passwordResetToken: token,
        passwordResetExpires: expire,
      },
    });

    const resetUrl = `http://localhost:3001/reset-password?token=${token}`;

    return await this.mailerService.sendMail({
      to: user.email,
      subject: 'Pedido de recuperação de senha',
      template: __dirname + '/templates' + '/reset-password',
      context: {
        name: user.name,
        resetUrl,
      },
    });
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.prismaService.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Invalid or expired token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prismaService.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });
  }

  async login(email: string) {
    const user = await this.UserService.findByEmail(email);

    return {
      token: this.jwtService.sign(
        { email, is_admin: user.is_admin },
        { subject: user.id },
      ),
    };
  }
}
