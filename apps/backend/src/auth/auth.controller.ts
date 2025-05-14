import { Body, Controller, HttpCode, Post, Req, Res } from '@nestjs/common'
import { AuthService } from './auth.service'
import { HttpStatusCode } from 'axios'
import { RegisterDto } from './dto/register.dto'
import type { Request, Response } from 'express'
import { LoginDto } from './dto/login.dto'
import { Recaptcha } from '@nestlab/google-recaptcha'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Recaptcha()
  @Post('register')
  @HttpCode(HttpStatusCode.Ok)
  async register(@Req() req: Request, @Body() registerDto: RegisterDto) {
    return await this.authService.register(req, registerDto)
  }

  @Recaptcha()
  @Post('login')
  @HttpCode(HttpStatusCode.Ok)
  async login(@Req() req: Request, @Body() loginDto: LoginDto) {
    return await this.authService.login(req, loginDto)
  }

  @Post('logout')
  @HttpCode(HttpStatusCode.Ok)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return await this.authService.logout(req, res)
  }
}
