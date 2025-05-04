import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { UserService } from '../user/user.service'
import { RegisterDto } from './dto/register.dto'
import { AuthMethod } from '../../prisma/__generated__'
import { UserModel } from '../../prisma/__generated__/models/User'
import { Request, Response } from 'express'
import { LoginDto } from './dto/login.dto'
import { verify } from 'argon2'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService) {}

  async register(req: Request, registerDto: RegisterDto) {
    const user = await this.userService.findByEmail(registerDto.email)

    if (user) {
      throw new ConflictException('The user with such email already exists')
    }

    const newUser = await this.userService.create({
      ...registerDto,
      picture: '',
      authMethod: AuthMethod.CREDENTIALS,
      isVerified: false,
    })

    return this.saveSession(req, newUser)
  }

  async login(req: Request, { email, password }: LoginDto) {
    const user = await this.userService.findByEmail(email)
    if (!user || !user.password) {
      throw new NotFoundException('User not found')
    }

    const isValidPassword = await verify(user.password, password)
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid password')
    }

    return this.saveSession(req, user)
  }

  async logout(req: Request, res: Response) {
    return new Promise<void>((resolve, reject) => {
      req.session.destroy(error => {
        if (error) {
          return reject(
            new InternalServerErrorException('Failed to complete the session or the session has already been completed'),
          )
        }

        res.clearCookie(this.configService.getOrThrow<string>('SESSION_NAME'))
        resolve()
      })
    })
  }

  private async saveSession(req: Request, user: UserModel) {
    return new Promise((resolve, reject) => {
      req.session.userId = user.id

      //Сохраняем userId в сессии.
      req.session.save(error => {
        if (error) {
          return reject(
            new InternalServerErrorException('Session not saved. Check parameters'),
          )
        }

        resolve({ user })
      })
    })
  }
}
