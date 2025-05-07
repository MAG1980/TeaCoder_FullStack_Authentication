import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { UserService } from '../../../user/user.service'
import { Request } from 'express'
import { UserModel } from '../../../../prisma/__generated__/models/User'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(
    context: ExecutionContext,
  ):  Promise<boolean> {
    const request = context.switchToHttp().getRequest() as Request & {user: UserModel}
    const sessionUserId = request.session.userId

    if (typeof sessionUserId === 'undefined') {
      throw new UnauthorizedException('The user is not authorized')
    }

    const user = await this.userService.findById(sessionUserId)

    if (!user) {
      throw new UnauthorizedException('The user was not found')
    }

    request.user = user

    return true
  }
}
