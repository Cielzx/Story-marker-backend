import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuth } from './local-auth.guard';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/entities/user.entity';

@Controller('login')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('')
  @UseGuards(LocalAuth)
  async login(@Body() user: LoginDto) {
    return this.authService.login(user.email);
  }
}
