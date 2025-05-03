import { Body, Controller, HttpCode, Post, Req } from '@nestjs/common'
import { AuthService } from './auth.service'
import { HttpStatusCode } from 'axios'
import { RegisterDto } from './dto/register.dto'
import type { Request } from 'express'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatusCode.Ok)
  async register(@Req() req: Request, @Body() registerDto: RegisterDto) {
    return await this.authService.register(req, registerDto)
  }

  async login() {
    return await this.authService.login()
  }
}
