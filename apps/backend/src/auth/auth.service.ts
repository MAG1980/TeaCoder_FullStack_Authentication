import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common'
import { UserService } from '../user/user.service'
import { RegisterDto } from './dto/register.dto'
import { AuthMethod } from '../../prisma/__generated__'
import { UserModel } from '../../prisma/__generated__/models/User'
import { Request } from 'express'


@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

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

  async login() {
  }

  async logout() {
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

        resolve ({ user })
      })
    })
  }
}
