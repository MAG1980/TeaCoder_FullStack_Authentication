import { Body, Controller, HttpCode, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { HttpStatusCode } from 'axios'
import { RegisterDto } from './dto/register.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatusCode.Ok)
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto)
  }

  async login() {
    return await this.authService.login()
  }
}
