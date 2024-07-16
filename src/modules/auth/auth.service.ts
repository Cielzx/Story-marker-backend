import { Injectable } from '@nestjs/common';
import { compare } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';

@Injectable()
export class AuthService {
  constructor(
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
