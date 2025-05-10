import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { UserModel } from '../../../prisma/__generated__/models/User'
import { Request } from 'express'

export const AuthorizedUser = createParamDecorator(
  (data: keyof UserModel, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest() as Request & { user: UserModel }
    const { user } = request

    return data ? user[data] : user
  })