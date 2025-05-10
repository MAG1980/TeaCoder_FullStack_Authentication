import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common'
import { UserService } from './user.service';
import { AuthorizedUser } from '../auth/decorators/authorized-user.decorator'
import { Authorization } from '../auth/decorators/authorization.decorator'
import { UserRole } from '../../prisma/__generated__'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Authorization()
  @HttpCode(HttpStatus.OK)
  @Get('profile')
  findProfile(@AuthorizedUser('id')userId: string){
    return this.userService.findById(userId)
  }

  @Authorization(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  findById(@Param('id') id: string){
    return this.userService.findById(id)
  }
}
