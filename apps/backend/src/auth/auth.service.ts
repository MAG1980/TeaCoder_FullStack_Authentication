import { ConflictException, Injectable } from '@nestjs/common'
import { UserService } from '../user/user.service'
import { RegisterDto } from './dto/register.dto'
import { AuthMethod } from '../../prisma/__generated__'


@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async register(regiserDto: RegisterDto) {
    const user = await this.userService.findByEmail(regiserDto.email)

    if ( user ) {
      throw new ConflictException('The user with such email already exists')
    }

    return await this.userService.create({
      ...regiserDto,
      picture: '',
      authMethod: AuthMethod.CREDENTIALS,
      isVerified: false,
    })
  }

  async login() {
  }

  async logout() {
  }

  private async saveSession() {
  }
}
