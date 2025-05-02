import { Injectable, NotFoundException } from '@nestjs/common'
import { hash } from 'argon2'
import { PrismaService } from '../prisma/prisma.service'
import { AuthMethod } from '../__generated__'

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {
  }

  async findById(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
      include: {
        accounts: true,
      },
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }
    return user
  }

  async findByEmail(email: string) {
    return await this.prismaService.user.findUnique({
      where: {
        email,
      },
      include: {
        accounts: true,
      },
    })
  }

  async create(
    { email, password, displayName, picture, authMethod, isVerified }:
    {
      email: string,
      password: string,
      displayName: string,
      picture: string,
      authMethod: AuthMethod,
      isVerified: boolean,
    },
  ) {
    const { password: hashedPassword, ...userWithoutPassword } = await this.prismaService.user.create({
        data: {
          email,
          //При регистрации через OAuth2 не получаем пароль, поэтому заполняем пустой строкой.
          password: password ? await hash(password) : '',
          displayName,
          picture,
          authMethod,
          isVerified,
        },
        include: {
          accounts: true,
        },
      },
    )

    return userWithoutPassword
  }
}
