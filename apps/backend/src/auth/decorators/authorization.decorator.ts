import { UserRole } from '../../../prisma/__generated__'
import { applyDecorators, UseGuards } from '@nestjs/common'
import { Roles } from './roles.decorator'
import { AuthGuard } from '../guards/auth/auth.guard'
import { RoleGuard } from '../guards/role/role.guard'

export const Authorization = (...roles: UserRole[]) => {
  if (roles.length) {
    return applyDecorators(
      Roles(...roles),
      UseGuards(AuthGuard, RoleGuard),
    )
  }

  //Если требуемые роли не переданы, то нет смысла применять RoleGuard.
  return applyDecorators(UseGuards(AuthGuard))
}