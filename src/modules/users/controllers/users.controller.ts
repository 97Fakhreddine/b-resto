import { Body, Controller, Get, Post, Headers } from '@nestjs/common';
import { UserService } from '../services/users.service';
import { Login, Signup } from '../types/types';

@Controller('auth/users')
export class UsersAuthController {
  constructor(private readonly userAuthService: UserService) {}

  @Post('login')
  async login(@Body() body: Login): Promise<object | Error> {
    return await this.userAuthService.login(body);
  }

  @Post('signup')
  async signup(@Body() body: Signup): Promise<object | Error> {
    return await this.userAuthService.signup(body);
  }

  @Get('session')
  async getCurrentUser(@Headers() header: any): Promise<object | string> {
    return await this.userAuthService.getCurrentUser(header.authorization);
  }
}
