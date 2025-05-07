import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import { Reflector } from '@nestjs/core'
import { ROLES_KEY } from '../../decorators/roles.decorator'
import { UserRole } from '../../../../prisma/__generated__'

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles: UserRole[] | undefined = this.reflector.getAllAndOverride(ROLES_KEY, [
      //Получаем значение параметра декоратора @Roles() метода.
      context.getHandler(),
      //Получаем значение параметра декоратора @Roles() контроллера.
      context.getClass(),
    ])

    //undefined, если декоратор @Roles() не был использован (специфические роли не требуются).
    if (!requiredRoles) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const requestUserRole = request.user?.role as UserRole

    //Если у пользователя есть хотя бы одна требуемая роль
    const doesHaveRequiredRole = requiredRoles.some(role => role === requestUserRole)

    //Генерация кастомного исключения.
    /*
    if(!doesHaveRequiredRole){
      throw new UnauthorizedException('Not enough rights')
    }*/

    //При false по умолчанию генерируется ForbiddenException.
    return doesHaveRequiredRole
  }
}
